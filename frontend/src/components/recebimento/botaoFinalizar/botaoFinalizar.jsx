import './botaoFinalizar.scss'

export default function BotaoFinalizar({
  concluido,
  onClick
}) {
  return (
    <button
      className="botao-sair"
      onClick={onClick}
      disabled={!concluido}
    >
      {concluido
        ? "FINALIZAR"
        : "AGUARDANDO PEDIDO..."}
    </button>
  );
}