import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { encerrarSessao, obterToken } from "../../auth/session";
import "./produtos2.scss";

export default function Produtos2() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

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
    if (Number(produto.estoque) <= 0) return;

    setProdutoSelecionado(produto);
  }

  async function enviarEscolha(event) {
    event.preventDefault();

    if (!produtoSelecionado) {
      alert("Selecione um brinde antes de continuar.");
      return;
    }

    const token = obterToken();
    if (!token) return navigate("/cadastramento");

    setEnviando(true);
    try {
      const resposta = await fetch(
        "http://localhost:3000/pedidos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            produtoId: produtoSelecionado.id,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro || "Erro ao criar pedido."
        );
      }

      console.log("Pedido criado:", dados);

      navigate(`/recebimento/${dados.id}`);

    } catch (erro) {
      console.error("Erro:", erro);
      if (erro.message.includes("Sessão")) {
        encerrarSessao();
        navigate("/cadastramento");
      }
      alert(erro.message || "Não foi possível criar o pedido.");
    } finally {
      setEnviando(false);
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

      {produtos.map((produto) => {
        const esgotado = Number(produto.estoque) <= 0;

        return (
          <button
            type="button"
            className={`brinde ${
              produtoSelecionado?.id === produto.id
                ? "selecionado"
                : ""
            } ${esgotado ? "esgotado" : ""}`}
            key={produto.id}
            onClick={() => selecionarProduto(produto)}
            aria-pressed={produtoSelecionado?.id === produto.id}
            disabled={esgotado}
          >
            {esgotado && (
              <>
                <span className="brinde-overlay" aria-hidden="true" />
                <span className="selo-esgotado">ESGOTADO</span>
              </>
            )}

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
        );
      })}

      <div className="resumo-selecao">
        <p>SELECIONADO</p>

        <p>
          {produtoSelecionado?.nome || "NENHUM"}
        </p>
      </div>

      <button
        className="enviar-escolha"
        type="submit"
        disabled={enviando || !produtoSelecionado}
      >
        {enviando ? "ENVIANDO..." : "CONTINUAR"}
        <i className="fa-solid fa-arrow-right-long"></i>
      </button>
    </form>
  );
}
