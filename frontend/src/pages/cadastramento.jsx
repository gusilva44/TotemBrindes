import Formulario from "../components/cadastramento/cadastramento";
import Header from "../components/header/header";
import '../css/cadastramento.scss'

export default function Cadastramento() {
    return (
        <div className="cadastramento-page">
            <Header />
            <Formulario />
        </div>
    )
}