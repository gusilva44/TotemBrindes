import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../components/header/header";
import CabecalhoPedido from '../components/recebimento/cabecalhoPedido/cabecalhoPedido'
import DadosPedido from '../components/recebimento/dadosPedido/dadosPedido'
import ProdutoPedido from '../components/recebimento/produtoPedido/produtoPedido'
import StatusPedido from '../components/recebimento/statusPedido/statusPedido'
import BotaoFinalizar from '../components/recebimento/botaoFinalizar/botaoFinalizar'

import "../css/recebimento.scss";

export default function Recebimento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let intervalo;

    async function buscarPedido() {
      try {
        const resposta = await fetch(
          `http://localhost:3000/api/pedidos/${id}`
        );

        if (!resposta.ok) {
          throw new Error("Pedido não encontrado.");
        }

        const dados = await resposta.json();

        setPedido(dados);
        setCarregando(false);
        setErro(false);

        // Para de consultar quando o pedido estiver concluído
        if (dados.status === "concluido") {
          clearInterval(intervalo);
        }

      } catch (error) {
        console.error("Erro ao buscar pedido:", error);

        setErro(true);
        setCarregando(false);
      }
    }

    buscarPedido();

    // Atualiza o pedido a cada 3 segundos
    intervalo = setInterval(buscarPedido, 3000);

    return () => {
      clearInterval(intervalo);
    };
  }, [id]);

  function sair() {
    if (!pedido) {
      return;
    }

    if (pedido.status !== "concluido") {
      return;
    }

    navigate("/");
  }

  if (carregando) {
    return (
      <div className="recebimento-page">
        <Header />

        <main className="recebimento">
          <div className="carregando">
            <p>Carregando pedido...</p>
          </div>
        </main>
      </div>
    );
  }

  if (erro || !pedido) {
    return (
      <div className="recebimento-page">
        <Header />

        <main className="recebimento">
          <div className="erro-pedido">
            <h2>Pedido não encontrado</h2>

            <p>
              Não foi possível encontrar este pedido.
            </p>

            <button
              className="botao-voltar"
              onClick={() => navigate("/")}
            >
              VOLTAR
            </button>
          </div>
        </main>
      </div>
    );
  }

  const concluido = pedido.status === "concluido";

  return (
    <div className="recebimento-page">
      <Header />

      <main className="recebimento">

        <CabecalhoPedido concluido={concluido} />

        <div className="cartao-pedido">

          <DadosPedido
            codigoPedido={pedido.codigo_pedido}
            codigoRetirada={pedido.codigo_retirada}
            cliente={pedido.cliente}
          />

          <ProdutoPedido
            imagem={pedido.produto_imagem}
            nome={pedido.produto_nome}
            descricao={pedido.produto_descricao}
          />

        </div>

        <StatusPedido concluido={concluido} />

        <BotaoFinalizar
          concluido={concluido}
          onClick={sair}
        />

      </main>
    </div>
  );
}