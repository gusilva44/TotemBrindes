import { useNavigate } from "react-router-dom";

export default function Formulario() {
  const navigate = useNavigate();

  function enviarFormulario(event) {
    event.preventDefault(); // Impede a página de recarregar

    // 1. Aqui você coloca a lógica para salvar os dados (ex: API, estados, etc.)
    console.log("Formulário enviado com sucesso!");

    // 2. Redireciona o usuário para a próxima página após o envio
    navigate('/pedido');
  }

  return (
    <div className="cadastramento">
      <form onSubmit={enviarFormulario}>
        <div className="inputs">
          <label htmlFor="nome">Nome</label>
          <input type="text" name="nome" id="nome" required />
        </div>

        <div className="inputs">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>

        <div className="inputs">
          <label htmlFor="telefone">Telefone</label>
          <input type="number" name="telefone" id="telefone" />
        </div>

        <div className="inputs">
          <label htmlFor="sexualidade">Sexualidade</label>
          <select name="sexualidade" id="sexualidade">
            <option value="">Selecione</option>
            <option value="Homem">Homem</option>
            <option value="Mulher">Mulher</option>
            <option value="Outro">Outro</option>
            <option value="Não informado">Prefiro não falar</option>
          </select>
        </div>

        <div className="inputs">
          <label htmlFor="aluno">Já fui aluno</label>
          <select name="aluno" id="aluno">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="não">Não</option>
            <option value="pretendo">Pretendo</option>
          </select>
        </div>

        
        <input className="proximaPagina" type="submit" value="Escolher Brinde" />
      </form>
    </div>
  );
}
