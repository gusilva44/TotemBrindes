import './concluidos.scss'

export default function Concluidos({ concluidos }){
    return(
        <div className="pedidos-concluidos">
            <h1>CONCLUIDOS</h1>

            <div className="pedidos">
                {concluidos.length === 0 ? (
                    <p>Nenhum pedido concluidos.</p>
                ) : (
                    concluidos.map((pedido) => (
                        <div className='pedido' key={pedido.id}>
                            {pedido.codigo_pedido}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}