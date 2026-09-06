import './dadosPedido.scss'

export default function DadosPedido({ pedido }) {
  return (
    <>
      <hr className="divisor" />
      <div className="informacao">
        <span>CÓDIGO DO PEDIDO</span>

        <strong>
          {pedido.codigo_pedido}
        </strong>
      </div>
      <hr className="divisor" />

      <div className="informacao retirada">
        <span>CÓDIGO DE RETIRADA</span>

        <strong>
          {pedido.codigo_retirada}
        </strong>
      </div>

      <hr className="divisor" />

      <div className="cliente">
        <span>CLIENTE</span>

        <strong>
          {pedido.cliente}
        </strong>
      </div>

      <hr className="divisor" />
    </>
  );
}