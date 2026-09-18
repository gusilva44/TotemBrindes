import api from '../api'
import Concluidos from '../components/admin/concluidos/concluidos'
import Pendentes from '../components/admin/pendentes/pendentes'
import { useCallback, useEffect, useState } from 'react'
import '../css/admin.scss'
import Painel from '../components/admin/painel/painel'
import Header from '../components/header/header';

export default function Admin() {
    const [chaveAdmin, setChaveAdmin] = useState('')
    const [chaveDigitada, setChaveDigitada] = useState('')
    const [validandoChave, setValidandoChave] = useState(false)
    const [erroSenha, setErroSenha] = useState('')
    const [tela, setTela] = useState(null)
    const [listaAtiva, setListaAtiva] = useState('pendentes')
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(false)

    const [pendentes, setPendentes] = useState([])
    const [concluidos, setConcluidos] = useState([])

    const [contagem, setContagem] = useState({
        total: 0,
        pendentes: 0,
        concluidos: 0
    })

    async function validarAcesso(event) {
        event.preventDefault()
        setValidandoChave(true)
        setErroSenha('')

        try {
            const resposta = await fetch(
                api('/pedidos/contagem'),
                { headers: { 'X-Admin-Key': chaveDigitada } }
            )

            if (!resposta.ok) {
                throw new Error('Chave inválida')
            }

            setChaveAdmin(chaveDigitada)
        } catch (error) {
            console.error('Erro ao validar acesso administrativo:', error)
            setErroSenha('Senha incorreta. Tente novamente.')
        } finally {
            setValidandoChave(false)
        }
    }

    const buscarPedidos = useCallback(async () => {
        if (!chaveAdmin) return
        try {
            const [
                respostaPendentes,
                respostaConcluidos,
                respostaContagem
            ] = await Promise.all([
                fetch(api('/pedidos/pendentes'), { headers: { 'X-Admin-Key': chaveAdmin } }),
                fetch(api('/pedidos/concluidos'), { headers: { 'X-Admin-Key': chaveAdmin } }),
                fetch(api('/pedidos/contagem'), { headers: { 'X-Admin-Key': chaveAdmin } })
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
                api(`/pedidos/concluir/${codigo}`),
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
                    <form className='chaveAdmin' onSubmit={validarAcesso}>
                        <div className="welcome">
                            <h1>Acesso administrativo</h1>
                            <p>Bem vindo a área administrativa</p>
                        </div>
                        <label htmlFor="chave-admin">
                        <p>Chave do painel</p>
                        <input
                            id="chave-admin"
                            type="password"
                            value={chaveDigitada}
                            onChange={(event) => {
                                setChaveDigitada(event.target.value)
                                setErroSenha('')
                            }}
                            required
                            autoComplete="current-password"
                            placeholder='Digite a senha de administrador'
                        /></label>
                        {erroSenha && <p className="erro-senha" role="alert">{erroSenha}</p>}
                        <button type="submit" disabled={validandoChave}>
                            {validandoChave ? 'Validando...' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </main>
        )
    }

    if (!tela) {
        return (
            <main className="menu-admin">
                <Header />

                <section>
                    <h1>Área administrativa</h1>
                    <p>Escolha o que deseja acessar.</p>

                    <button type="button" onClick={() => setTela('painel')}>
                        Painel admin
                    </button>
                    <button type="button" onClick={() => setTela('pedidos')}>
                        Ver todos os pedidos
                    </button>
                </section>
            </main>
        )
    }

    if (carregando) {
        return (
            <div className="admin-page carregando">
                <div className="carregando">
                    <p>Carregando pedidos...</p>
                </div>

            </div>
        )
    }

    if (erro) {
        return (
            <div className="admin-erro">
                <button type="button" onClick={() => setTela(null)}>
                    Voltar
                </button>
                <main>
                    <p>Erro ao carregar os pedidos</p>
                </main>

            </div>
        )
    }

    if (tela === 'painel') {
        return (
            <div className="admin-page">
                <Painel
                    contagem={contagem}
                    validarPedido={validarPedido}
                />
                <Pendentes pendentes={pendentes} />
                <Concluidos concluidos={concluidos} />
                <button
                    className="voltar-menu-admin"
                    type="button"
                    onClick={() => setTela(null)}
                >
                    Sair
                </button>
            </div>
        )
    }

    return (
        <main className="todos-pedidos-admin">
            <header>
                <button type="button" onClick={() => setTela(null)}>
                    Voltar ao menu
                </button>
                <h1>Todos os pedidos</h1>
            </header>

            <div className="filtros-pedidos" role="tablist" aria-label="Filtrar pedidos">
                <button
                    type="button"
                    className={listaAtiva === 'pendentes' ? 'ativo' : ''}
                    onClick={() => setListaAtiva('pendentes')}
                    aria-pressed={listaAtiva === 'pendentes'}
                >
                    Pendentes ({contagem.pendentes})
                </button>
                <button
                    type="button"
                    className={listaAtiva === 'concluidos' ? 'ativo' : ''}
                    onClick={() => setListaAtiva('concluidos')}
                    aria-pressed={listaAtiva === 'concluidos'}
                >
                    Concluídos ({contagem.concluidos})
                </button>
            </div>

            {listaAtiva === 'pendentes' ? (
                <Pendentes pendentes={pendentes} detalhado />
            ) : (
                <Concluidos concluidos={concluidos} detalhado />
            )}
        </main>
    )
}
