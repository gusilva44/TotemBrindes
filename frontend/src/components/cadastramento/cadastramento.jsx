import { useNavigate } from "react-router-dom";
import "./cadastramento.scss";

export default function Formulario() {
  const navigate = useNavigate();

  function enviarFormulario(event) {
    event.preventDefault();
    navigate("/pedido");
  }

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
          />
        </div>

        <div className="inputs">
          <label htmlFor="sexo">Sexo</label>

          <select name="sexo" id="sexo" required>
            <option value="">Selecione</option>
            <option value="Homem">Homem</option>
            <option value="Mulher">Mulher</option>
            <option value="Outro">Outro</option>
            <option value="nao-informado">
              Prefiro não informar
            </option>
          </select>
        </div>

        <div className="inputs">
          <label htmlFor="aluno">Já foi aluno?</label>

          <select name="aluno" id="aluno" required>
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="pretendo">Pretendo ser</option>
          </select>
        </div>

        <input
          className="proximaPagina"
          type="submit"
          value="Escolher Brinde"
        />
      </form>
    </div>
  );
}