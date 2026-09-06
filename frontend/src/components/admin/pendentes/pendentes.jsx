import './pendentes.scss'

export default function Pendentes({ pendentes }){
    return(
        <div className="pedidos-pendentes">
            <h1>PENDENTES</h1>

            <div className="pedidos">
                {pendentes.length === 0 ? (
                    <p>Nenhum pedido pendente.</p>
                ) : (
                    pendentes.map((pedido) => (
                        <div className='pedido' key={pedido.id}>
                            {pedido.codigo_pedido}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}