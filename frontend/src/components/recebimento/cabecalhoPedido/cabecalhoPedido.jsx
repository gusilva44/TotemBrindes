import './cabecalhoPedido.scss'

export default function CabecalhoPedido({ concluido }) {
  return (
    <div className="recebimento-topo">
      <h1>
        {concluido
          ? "PEDIDO CONCLUÍDO!"
          : "PEDIDO RECEBIDO!"}
      </h1>

      <p>
        {concluido
          ? "Seu pedido está pronto para retirada!"
          : "Aguarde, enquanto seu pedido é preparado!"}
      </p>
    </div>
  );
}