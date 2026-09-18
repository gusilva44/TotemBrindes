import api from '../api'
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { encerrarSessao, obterToken } from "../auth/session";

import Header from '../components/header/header'
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
          api(`/pedidos/${id}`),
          { headers: { Authorization: `Bearer ${obterToken()}` } }
        );

        if (!resposta.ok) {
          if (resposta.status === 401) {
            encerrarSessao();
            navigate("/cadastramento", { replace: true });
            return;
          }
          throw new Error("Pedido não encontrado.");
        }

        const dados = await resposta.json();

        setPedido(dados);
        setCarregando(false);
        setErro(false);

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

    intervalo = setInterval(buscarPedido, 3000);

    return () => {
      clearInterval(intervalo);
    };
  }, [id, navigate]);

  function sair() {
    if (!pedido) {
      return;
    }

    if (pedido.status !== "concluido") {
      return;
    }

    navigate("/finalizado", {
      replace: true,
      state: { cliente: pedido.cliente }
    });
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
            pedido={pedido}
          />

          <ProdutoPedido
            pedido={pedido}
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
