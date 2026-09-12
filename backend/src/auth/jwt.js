import crypto from 'crypto';

const encoder = new TextEncoder();
const base64url = (value) => Buffer.from(value).toString('base64url');

function secret() {
    const value = process.env.JWT_SECRET;

    if (value) return value;
    if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET é obrigatório em produção.');
    }

    // Permite iniciar o projeto localmente, mas os tokens deixam de valer ao reiniciar.
    return 'desenvolvimento-altere-esta-chave-jwt';
}

function sign(value) {
    return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

export function criarTokenCliente(cliente) {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = Number(process.env.JWT_EXPIRES_IN_SECONDS || 1800);
    const subject = crypto
        .createHash('sha256')
        .update(`${cliente.email}:${cliente.telefone}`)
        .digest('hex');

    const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = base64url(JSON.stringify({
        iss: 'totem-brindes-api',
        aud: 'totem-brindes-cliente',
        sub: subject,
        iat: now,
        exp: now + expiresIn,
        // Os dados foram validados antes de assinar e não são aceitos do cliente no pedido.
        cliente
    }));
    const signature = sign(`${header}.${payload}`);

    return { accessToken: `${header}.${payload}.${signature}`, expiresAt: (now + expiresIn) * 1000 };
}

export function verificarToken(token) {
    if (typeof token !== 'string') throw new Error('Token ausente.');

    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Token malformado.');

    const [header, payload, receivedSignature] = parts;
    const expectedSignature = sign(`${header}.${payload}`);
    const receivedBuffer = Buffer.from(receivedSignature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (receivedBuffer.length !== expectedBuffer.length ||
        !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)) {
        throw new Error('Assinatura inválida.');
    }

    let decodedHeader;
    let decodedPayload;
    try {
        decodedHeader = JSON.parse(Buffer.from(header, 'base64url').toString('utf8'));
        decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    } catch {
        throw new Error('Token malformado.');
    }

    const now = Math.floor(Date.now() / 1000);
    if (decodedHeader.alg !== 'HS256' || decodedPayload.iss !== 'totem-brindes-api' ||
        decodedPayload.aud !== 'totem-brindes-cliente' || !decodedPayload.exp ||
        decodedPayload.exp <= now || !decodedPayload.cliente) {
        throw new Error('Token expirado ou inválido.');
    }

    return decodedPayload;
}
