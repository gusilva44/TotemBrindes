import './statusPedido.scss'

export default function StatusPedido({ concluido }) {
  return (
    <div
      className={`status ${
        concluido
          ? "status-concluido"
          : "status-pendente"
      }`}
    >
      <div className="status-indicador" />

      <div>
        <strong>
          {concluido
            ? "Pedido pronto!"
            : "Pedido em preparação"}
        </strong>

        <p>
          {concluido
            ? "Apresente o código de retirada."
            : "Aguarde nesta tela até o pedido ser concluído."}
        </p>
      </div>
    </div>
  );
}