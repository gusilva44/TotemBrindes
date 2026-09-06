import Header from "../components/header/header";
import Amostra from '../components/amostra/amostra'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../css/home.scss'

export default function Home(){
    const [carregando, setCarregando] = useState(true)
    const [produtos, setProdutos] = useState(null)
    const [erro, setErro] = useState(false)

    useEffect(() => {
        async function buscarBrindes() {
            try {
                const resposta = await fetch('http://localhost:3000/produtos')

                if(!resposta.ok){
                    throw new Error("Produtos não encontrados")
                }

                const dados = await resposta.json()

                setCarregando(false)
                setErro(false)
                setProdutos(dados)
            } catch (error) {
                console.error("Erro ao buscar pedido:", error)

                setErro(true)
                setCarregando(false)
            }
        }

        buscarBrindes()
    })

    if(carregando) {
        return (
            <div className="home-page-carregando">
                <Header />

                <div className="carregando">
                    <h1>Carregando...</h1>
                    <p>Espere os dados carregarem...</p>
                </div>
            </div>
        )
    }

    if(erro || !produtos){
        return(
            <div className="home-page-erro">
                <Header />

                <div className="erro">
                    <h1>Pedido não encontrado</h1>
                    <p>Não foi possivel encontrar o pedido</p>
                </div>
            </div>
        )
    }

    return (
        <div className="home-page">
            <Header/>
            <div className="entrada">
                <h1>TOTEM DE BRINDES</h1>
                <p>Escolha um brinde gratuitamente!</p>
            </div>
            <Amostra produtos={produtos}/>
            <Link to='/cadastramento' className="cadastramento">Realizar cadastramento <i class="fa-solid fa-arrow-right-long"></i></Link>
        </div>
    )
}