import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./produtos2.scss";

export default function Produtos2() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarProdutos() {
      try {
        const resposta = await fetch(
          "http://localhost:3000/produtos"
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            dados.mensagem || "Erro ao buscar produtos."
          );
        }

        setProdutos(dados);
      } catch (erro) {
        console.error("Erro ao buscar produtos:", erro);
        alert("Não foi possível carregar os produtos.");
      } finally {
        setCarregando(false);
      }
    }

    buscarProdutos();
  }, []);

  function selecionarProduto(produto) {
    setProdutoSelecionado(produto);
  }

  async function enviarEscolha(event) {
    event.preventDefault();

    if (!produtoSelecionado) {
      alert("Selecione um brinde antes de continuar.");
      return;
    }

    const dadosCliente = JSON.parse(
      sessionStorage.getItem("dadosCliente")
    );

    console.log("DADOS DO CLIENTE:", dadosCliente);
    console.log("EMAIL:", dadosCliente?.email);

    if (!dadosCliente) {
      alert("Dados do cliente não encontrados.");
      navigate("/");
      return;
    }

    try {
      const resposta = await fetch(
        "http://localhost:3000/pedidos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            produtoId: produtoSelecionado.id,
            cliente: dadosCliente.cliente,
            email: dadosCliente.email,
            telefone: dadosCliente.telefone,
            sexualidade: dadosCliente.sexualidade,
            foiAluno: dadosCliente.foiAluno
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem || "Erro ao criar pedido."
        );
      }

      console.log("Pedido criado:", dados);

      navigate(`/recebimento/${dados.id}`);

    } catch (erro) {
      console.error("Erro:", erro);
      alert("Não foi possível criar o pedido.");
    }
  }

  if (carregando) {
    return <p>Carregando produtos...</p>;
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
              src={produto.imagem}
              alt={`Imagem do ${produto.nome}`}
            />
          </div>

          <div className="brinde-info">
            <h2>{produto.nome}</h2>

            <p>{produto.descricao}</p>
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
        <i className="fa-solid fa-arrow-right-long"></i>
      </button>
    </form>
  );
}
