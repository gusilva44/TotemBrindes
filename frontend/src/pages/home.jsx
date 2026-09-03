import Header from "../components/header/header";
import Amostra from "../components/produtos1/produtos1";
import { Link } from 'react-router-dom'
import '../css/home.scss'

export default function Home(){
    return (
        <div className="home-page">
            <Header/>
            <Amostra />
            <Link to='/cadastramento' className="cadastramento">Realizar cadastramento</Link>
        </div>
    )
}