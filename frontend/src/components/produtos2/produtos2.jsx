import { useState } from "react";
import { produtos } from "../../data/produtos";
import "./produtos2.scss";

export default function Produtos2() {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  function selecionarProduto(id) {
    setProdutoSelecionado(id);
  }

  function enviarEscolha(event) {
    event.preventDefault();

    if (produtoSelecionado === null) {
      alert("Selecione um brinde antes de continuar.");
      return;
    }

    console.log("Brinde escolhido:", produtoSelecionado);
  }

  return (
    <form className="produtos-componente" onSubmit={enviarEscolha}>
      {produtos.map((i) => (
        <div
          className={`brinde ${
            produtoSelecionado === i.id ? "selecionado" : ""
          }`}
          key={i.id}
          onClick={() => selecionarProduto(i.id)}
        >
          <div className="brinde-img">
            <img src={i.img} alt={`Imagem do ${i.nome}`} />
          </div>

          <div className="brinde-info">
            <h2>{i.nome}</h2>
            <p>{i.desc}</p>
          </div>

          <input
            type="radio"
            name="brinde"
            value={i.id}
            checked={produtoSelecionado === i.id}
            onChange={() => selecionarProduto(i.id)}
          />
        </div>
      ))}

      <button className="enviar-escolha" type="submit">
        Confirmar escolha
      </button>
    </form>
  );
}