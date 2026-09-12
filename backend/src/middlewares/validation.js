const generosAceitos = new Set([
    'masculino',
    'feminino',
    'nao-binario',
    'outro',
    'nao-informado'
]);

function erro(res, mensagem) {
    return res.status(400).json({ erro: mensagem });
}

function texto(value) {
    return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function telefone(value) {
    return typeof value === 'string' ? value.replace(/\D/g, '') : '';
}

export function validarCadastro(req, res, next) {
    const cliente = texto(req.body?.cliente);
    const email = texto(req.body?.email).toLowerCase();
    const numeroTelefone = telefone(req.body?.telefone);
    const genero = req.body?.genero;
    const foiAluno = req.body?.foiAluno;

    if (cliente.length < 2 || cliente.length > 150) return erro(res, 'Informe um nome válido.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 150) {
        return erro(res, 'Informe um e-mail válido.');
    }
    if (numeroTelefone.length < 10 || numeroTelefone.length > 13) {
        return erro(res, 'Informe um telefone válido.');
    }
    if (!generosAceitos.has(genero)) return erro(res, 'Informe uma opção de gênero válida.');
    if (typeof foiAluno !== 'boolean') return erro(res, 'Informe corretamente se já foi aluno.');

    req.body = { cliente, email, telefone: numeroTelefone, genero, foiAluno };
    return next();
}

export function validarPedido(req, res, next) {
    const produtoId = Number(req.body?.produtoId);
    if (!Number.isInteger(produtoId) || produtoId <= 0) {
        return erro(res, 'Selecione um produto válido.');
    }

    // Descarta campos extras: o perfil vem exclusivamente do JWT assinado.
    req.body = { produtoId };
    return next();
}

export function validarId(req, res, next) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return erro(res, 'ID inválido.');
    req.params.id = String(id);
    return next();
}
