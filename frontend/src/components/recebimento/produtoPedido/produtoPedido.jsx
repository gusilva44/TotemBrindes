export default function ProdutoPedido({ pedido }) {
  return (
    <div className="produto-pedido">

      <div className="produto-imagem">
        <img
          src={pedido.produto_imagem}
          alt={pedido.produto_nome}
        />
      </div>

      <div className="produto-info">
        <span>SEU BRINDE</span>

        <h2>{pedido.produto_nome}</h2>

        <p>{pedido.produto_descricao}</p>
      </div>

    </div>
  );
}