import Concluidos from '../components/admin/concluidos/concluidos'
import Pendentes from '../components/admin/pendentes/pendentes'
import { useCallback, useEffect, useState } from 'react'
import '../css/admin.scss'
import Painel from '../components/admin/painel/painel'
import Header from '../components/header/header';

export default function Admin() {
    const [chaveAdmin, setChaveAdmin] = useState('')
    const [chaveDigitada, setChaveDigitada] = useState('')
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(false)

    const [pendentes, setPendentes] = useState([])
    const [concluidos, setConcluidos] = useState([])

    const [contagem, setContagem] = useState({
        total: 0,
        pendentes: 0,
        concluidos: 0
    })

    const buscarPedidos = useCallback(async () => {
        if (!chaveAdmin) return
        try {
            const [
                respostaPendentes,
                respostaConcluidos,
                respostaContagem
            ] = await Promise.all([
                fetch('http://localhost:3000/pedidos/pendentes', { headers: { 'X-Admin-Key': chaveAdmin } }),
                fetch('http://localhost:3000/pedidos/concluidos', { headers: { 'X-Admin-Key': chaveAdmin } }),
                fetch('http://localhost:3000/pedidos/contagem', { headers: { 'X-Admin-Key': chaveAdmin } })
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
    }, [chaveAdmin])

    async function validarPedido(codigo) {
        try {
            const resposta = await fetch(
                `http://localhost:3000/pedidos/concluir/${codigo}`,
                {
                    method: 'PATCH',
                    headers: { 'X-Admin-Key': chaveAdmin }
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
    }, [buscarPedidos])

    if (!chaveAdmin) {
        return (
            <main className="loginAdmin">
                <Header />
                <div className="loginAdmin">
                    <form className='chaveAdmin' onSubmit={(event) => { event.preventDefault(); setChaveAdmin(chaveDigitada); }}>
                        <h1>Acesso administrativo</h1>
                        <label htmlFor="chave-admin">
                        <p>Chave do painel</p>
                        <input
                            id="chave-admin"
                            type="password"
                            value={chaveDigitada}
                            onChange={(event) => setChaveDigitada(event.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder='Digite a senha de administrador'
                        /></label>
                        <button type="submit">Entrar</button>
                    </form>
                </div>
            </main>
        )
    }

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
