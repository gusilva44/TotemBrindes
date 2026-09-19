function primeiroNome(cliente) {
    return String(cliente ?? '').trim().split(/\s+/)[0]
}

export function pedidoCriado(pedido) {
    return `🎉 Parabéns ${primeiroNome(pedido.cliente)} 🎉, você acabou de realizar o seu pedido!!!

➡️ Detalhes do pedido:

Item: ${pedido.produto_nome}
Código do Pedido: ${pedido.codigo_pedido}
Código de Retirada: ${pedido.codigo_retirada}

Retire seu pedido no balcão ao lado!`
}

export function pedidoConcluido(pedido) {
    return `${primeiroNome(pedido.cliente)}, agradecemos a sua presença na 6ª Edição da Feira das Profissões do nosso Instituto!

Nossa feira foi criada pensando em você, prestigie as outras salas, atrações e stands.

Esperamos que tenha gostado, avalie o nosso atendimento e muito obrigado!!! 💙💛`
}
