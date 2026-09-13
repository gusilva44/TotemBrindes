import './concluidos.scss'

export default function Concluidos({ concluidos, detalhado = false }){
    return(
        <div className="pedidos-concluidos">
            <h1>CONCLUIDOS</h1>

            <div className="pedidos">
                {concluidos.length === 0 ? (
                    <p>Nenhum pedido concluidos.</p>
                ) : (
                    concluidos.map((pedido) => detalhado ? (
                        <article className='pedido pedido-detalhado' key={pedido.id}>
                            <strong>{pedido.cliente}</strong>
                            <span>Pedido: {pedido.produto || 'Produto não informado'}</span>
                            <time>Horário do pedido: {pedido.horario_pedido || 'Horário não informado'}</time>
                        </article>
                    ) : (
                        <div className='pedido' key={pedido.id}>
                            {pedido.codigo_pedido}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
