import Concluidos from '../components/admin/concluidos/concluidos'
import Pendentes from '../components/admin/pendentes/pendentes'
import { useEffect, useState } from 'react'
import '../css/admin.scss'
import Painel from '../components/admin/painel/painel'

export default function Admin() {
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(false)

    const [pendentes, setPendentes] = useState([])
    const [concluidos, setConcluidos] = useState([])

    const [contagem, setContagem] = useState({
        total: 0,
        pendentes: 0,
        concluidos: 0
    })

    async function buscarPedidos() {
        try {
            const [
                respostaPendentes,
                respostaConcluidos,
                respostaContagem
            ] = await Promise.all([
                fetch('http://localhost:3001/pedidos/pendentes'),
                fetch('http://localhost:3001/pedidos/concluidos'),
                fetch('http://localhost:3001/pedidos/contagem')
            ])

            if (!respostaContagem.ok) {
                throw new Error(
                    'Erro ao buscar a contagem dos pedidos'
                )
            }

            if (!respostaPendentes.ok) {
                throw new Error(
                    'Erro ao buscar os pedidos pendentes'
                )
            }

            if (!respostaConcluidos.ok) {
                throw new Error(
                    'Erro ao buscar os pedidos concluídos'
                )
            }

            const dadosPendentes =
                await respostaPendentes.json()

            const dadosConcluidos =
                await respostaConcluidos.json()

            const dadosContagem =
                await respostaContagem.json()

            setPendentes(dadosPendentes)
            setConcluidos(dadosConcluidos)
            setContagem(dadosContagem)

            setErro(false)

        } catch (error) {
            console.error(
                'Erro ao buscar os pedidos:',
                error
            )

            setErro(true)

        } finally {
            setCarregando(false)
        }
    }

    async function validarPedido(codigo) {
        try {
            const resposta = await fetch(
                `http://localhost:3001/pedidos/concluir/${codigo}`,
                {
                    method: 'PATCH'
                }
            )

            if (!resposta.ok) {
                return false
            }

            await buscarPedidos()

            return true

        } catch (error) {
            console.error('Erro ao concluir pedido:', error)

            return false
        }
    }

    useEffect(() => {
        buscarPedidos()

        const intervalo = setInterval(() => {
            buscarPedidos()
        }, 2000)

        return () => {
            clearInterval(intervalo)
        }
    }, [])

    if (carregando) {
        return (
            <div className="admin-page carregando">

                <Painel
                    contagem={contagem}
                    validarPedido={validarPedido}
                />

                <div className="carregando">
                    <p>Carregando pedidos...</p>
                </div>

            </div>
        )
    }

    if (erro) {
        return (
            <div className="admin-page">

                <Painel
                    contagem={contagem}
                    validarPedido={validarPedido}
                />

                <main>
                    <p>Erro ao carregar os pedidos</p>
                </main>

            </div>
        )
    }

    return (
        <div className="admin-page">

            <Painel
                contagem={contagem}
                validarPedido={validarPedido}
            />

            <Pendentes
                pendentes={pendentes}
            />

            <Concluidos
                concluidos={concluidos}
            />

        </div>
    )
}