import Header from "../components/header/header";
import Amostra from "../components/produtos1/produtos1";
import { Link } from 'react-router-dom'
import '../css/home.scss'

export default function Home(){
    return (
        <div className="home-page">
            <Header/>
            <div className="entrada">
                <h1>TOTEM DE BRINDES</h1>
                <p>Escolha um brinde gratuitamente!</p>
            </div>
            <Amostra />
            <Link to='/cadastramento' className="cadastramento">Realizar cadastramento <i class="fa-solid fa-arrow-right-long"></i></Link>
        </div>
    )
}