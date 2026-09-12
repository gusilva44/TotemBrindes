import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { salvarSessao } from "../../auth/session";
import "./cadastramento.scss";

export default function Formulario() {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);

  async function enviarFormulario(event) {
    event.preventDefault();

    const formulario = new FormData(event.currentTarget);

    const nome = formulario.get("nome");
    const email = formulario.get("email");
    const telefone = formulario.get("telefone");
    const genero = formulario.get("genero");
    const aluno = formulario.get("aluno");

    const dadosCliente = {
      cliente: nome,
      email: email,
      telefone: telefone,
      genero: genero,
      foiAluno: aluno === "sim",
    };

    setEnviando(true);
    try {
      const resposta = await fetch("http://localhost:3000/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosCliente),
      });
      const dados = await resposta.json();
      if (!resposta.ok || !dados.accessToken) {
        throw new Error(dados.erro || "Não foi possível validar o cadastro.");
      }
      salvarSessao(dados.accessToken);
      navigate("/pedidos");
    } catch (erro) {
      alert(erro.message);
    } finally {
      setEnviando(false);
    }
  }

  const formatarTelefone = (valor) => {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 2) {
      return numeros.replace(/^(\d{0,2})/, '($1');
    }

    if (numeros.length <= 7) {
      return numeros.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    }

    return numeros.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  return (
    <div className="cadastramento">
      <form onSubmit={enviarFormulario}>

        <div className="inputs">
          <label htmlFor="nome">Nome</label>

          <input
            type="text"
            name="nome"
            id="nome"
            placeholder="Digite seu nome"
            required
            autoComplete="name"
          />
        </div>

        <div className="inputs">
          <label htmlFor="email">E-mail</label>

          <input
            type="email"
            name="email"
            id="email"
            placeholder="Digite seu e-mail"
            required
            autoComplete="email"
          />
        </div>

        <div className="inputs">
          <label htmlFor="telefone">Telefone</label>

          <input
            type="tel"
            name="telefone"
            id="telefone"
            placeholder="(11) 99999-9999"
            required
            autoComplete="tel"
            onChange={(e) => {
              e.target.value = formatarTelefone(e.target.value);
            }}
          />
        </div>

        <div className="inputs">
          <label htmlFor="genero">Gênero</label>

          <select name="genero" id="genero" required>
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="não-binario">Não-binário</option>
            <option value="outro">Outro</option>
            <option value="nao-informado">Prefiro não responder</option>
          </select>
        </div>

        <div className="inputs">
          <label htmlFor="aluno">Já foi aluno?</label>

          <select name="aluno" id="aluno" required>
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="pretendo">
              Pretendo ser
            </option>
          </select>
        </div>

        <input
          className="proximaPagina"
          type="submit"
          value={enviando ? "Validando..." : "Escolher Brinde"}
          disabled={enviando}
        />

      </form>
    </div>
  );
}
