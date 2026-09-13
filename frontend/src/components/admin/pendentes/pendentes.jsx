import './pendentes.scss'

export default function Pendentes({ pendentes, detalhado = false }){
    return(
        <div className="pedidos-pendentes">
            <h1>PENDENTES</h1>

            <div className="pedidos">
                {pendentes.length === 0 ? (
                    <p>Nenhum pedido pendente.</p>
                ) : (
                    pendentes.map((pedido) => detalhado ? (
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
