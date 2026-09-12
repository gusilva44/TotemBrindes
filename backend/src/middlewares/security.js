const sensitiveKeys = new Set(['password', 'senha', 'passwordhash', 'token', 'secret']);

function removerCamposSensiveis(value) {
    if (Array.isArray(value)) return value.map(removerCamposSensiveis);
    if (!value || typeof value !== 'object') return value;

    return Object.fromEntries(Object.entries(value)
        .filter(([key]) => key === 'accessToken' || !sensitiveKeys.has(key.toLowerCase()))
        .map(([key, item]) => [key, removerCamposSensiveis(item)]));
}

export function protegerResposta(req, res, next) {
    const json = res.json.bind(res);
    res.json = (body) => json(removerCamposSensiveis(body));
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cache-Control', 'no-store');
    return next();
}

export function rotaNaoEncontrada(req, res) {
    return res.status(404).json({ erro: 'Rota não encontrada.' });
}

export function tratarErro(error, req, res, next) {
    console.error(error);
    if (res.headersSent) return next(error);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
}
