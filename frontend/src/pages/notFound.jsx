import '../css/notFound.scss'
import Header from '../components/header/header'
import { Link } from 'react-router-dom';


export default function NotFound(){
    return (
        <div className="notFound-page">
            <Header />
            <div className="content">
                <h1 className='numero'>404</h1>
                <h1>Página Não Encontrada</h1>
                <p>Clique no botao abaixo para voltar para o início </p>
                <Link to="/">
                    <button className="voltar">Voltar para home</button>
                </Link>
            </div>
        </div>
    )
}