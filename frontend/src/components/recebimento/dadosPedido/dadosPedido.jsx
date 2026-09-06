export default function DadosPedido({ pedido }) {
  return (
    <>
      <div className="informacao">
        <span>CÓDIGO DO PEDIDO</span>

        <strong>
          {pedido.codigo_pedido}
        </strong>
      </div>

      <div className="divisor" />

      <div className="informacao retirada">
        <span>CÓDIGO DE RETIRADA</span>

        <strong>
          {pedido.codigo_retirada}
        </strong>
      </div>

      <div className="divisor" />

      <div className="cliente">
        <span>CLIENTE</span>

        <strong>
          {pedido.cliente}
        </strong>
      </div>
    </>
  );
}