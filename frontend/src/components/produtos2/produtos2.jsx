import { useState } from "react";
import { produtos } from "../../data/produtos";
import "./produtos2.scss";

export default function Produtos2() {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  function selecionarProduto(produto) {
    setProdutoSelecionado(produto);
  }

  async function enviarEscolha(event) {
    event.preventDefault();

    if (produtoSelecionado === null) {
      alert("Selecione um brinde antes de continuar.");
      return;
    }

    console.log("Produto escolhido:", produtoSelecionado);

    try {
      const resposta = await fetch(
        "http://localhost:3000/api/escolher-brinde",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            produtoId: produtoSelecionado.id,
            nome: produtoSelecionado.nome,
            descricao: produtoSelecionado.desc,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "Erro ao enviar escolha."
        );
      }

      console.log("Escolha salva:", dados);

      alert("Brinde escolhido com sucesso!");
    } catch (erro) {
      console.error("Erro:", erro);
      alert("Não foi possível salvar sua escolha.");
    }
  }

  return (
    <form
      className="produtos-componente"
      onSubmit={enviarEscolha}
    >
      <div className="escolha">
        <h3>ESCOLHA UM PRODUTO:</h3>

        <p>
          {produtos.length}{" "}
          {produtos.length === 1 ? "ITEM" : "ITENS"}
        </p>
      </div>

      {produtos.map((produto) => (
        <button
          type="button"
          className={`brinde ${
            produtoSelecionado?.id === produto.id
              ? "selecionado"
              : ""
          }`}
          key={produto.id}
          onClick={() => selecionarProduto(produto)}
          aria-pressed={
            produtoSelecionado?.id === produto.id
          }
        >
          <div className="brinde-img">
            <img
              src={produto.img}
              alt={`Imagem do ${produto.nome}`}
            />
          </div>

          <div className="brinde-info">
            <h2>{produto.nome}</h2>

            <p>{produto.desc}</p>
          </div>

          <div
            className={`radio-personalizado ${
              produtoSelecionado?.id === produto.id
                ? "ativo"
                : ""
            }`}
            aria-hidden="true"
          />
        </button>
      ))}

      <div className="resumo-selecao">
        <p>SELECIONADO</p>

        <p>
          {produtoSelecionado?.nome || "NENHUM"}
        </p>
      </div>

      <button
        className="enviar-escolha"
        type="submit"
      >
        CONTINUAR
        <i class="fa-solid fa-arrow-right-long"></i>
      </button>
    </form>
  );
}