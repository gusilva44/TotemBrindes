import { verificarToken } from '../auth/jwt.js';

export function exigirAutenticacao(req, res, next) {
    const [scheme, token] = (req.get('authorization') || '').split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ erro: 'Autenticação obrigatória.' });
    }

    try {
        req.auth = verificarToken(token);
        return next();
    } catch {
        return res.status(401).json({ erro: 'Sessão inválida ou expirada. Faça o cadastro novamente.' });
    }
}

export function exigirDonoDoPedido(req, res, next) {
    if (req.pedido && req.pedido.email === req.auth.cliente.email &&
        req.pedido.telefone === req.auth.cliente.telefone) {
        return next();
    }

    return res.status(403).json({ erro: 'Você não tem acesso a este pedido.' });
}

export function exigirAdministrador(req, res, next) {
    const configuredKey = process.env.ADMIN_API_KEY;
    const receivedKey = req.get('x-admin-key');

    if (!configuredKey) {
        return res.status(503).json({ erro: 'A chave administrativa não foi configurada.' });
    }
    if (!receivedKey || receivedKey.length !== configuredKey.length || receivedKey !== configuredKey) {
        return res.status(401).json({ erro: 'Autorização administrativa obrigatória.' });
    }
    return next();
}
