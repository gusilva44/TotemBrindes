import './concluidos.scss'

export default function Concluidos({ concluidos, detalhado = false }){
    // Se não for detalhado, pega apenas os 12 primeiros. Se for detalhado, pega todos.
    const pedidosExibidos = detalhado ? concluidos : concluidos.slice(0, 12);

    return(
        <div className="pedidos-concluidos">
            <h1>CONCLUIDOS</h1>

            <div className="pedidos">
                {pedidosExibidos.length === 0 ? (
                    <p>Nenhum pedido concluídos.</p>
                ) : (
                    pedidosExibidos.map((pedido) => detalhado ? (
                        <article className='pedido pedido-detalhado' key={pedido.id}>
                            <strong>{pedido.cliente}</strong>
                            <span>Pedido: {pedido.produto || 'Produto não informado'}</span>
                            <time>Horário do pedido: {pedido.horario_pedido || 'Horário não informado'}</time>
                        </article>
                    ) : (
                        <div className='pedido' key={pedido.id}>
                            <div className="codigo">{pedido.codigo_pedido}</div>
                            <div className="descricao">
                                <p>{pedido.produto}</p>
                                <p>{pedido.cliente}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
