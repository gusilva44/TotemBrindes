import './painel.scss'
import logo from '../../../assets/images/logo.avif'
import ValidarPedido from '../validarPedido/validarPedido';
import { useState, useEffect } from 'react'

export default function Painel({ contagem = {}, validarPedido }) {
    const [horario, setHorario] = useState(() => {
        const agora = new Date()

        return agora.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        })
    })

    useEffect(() => {
        const intervalo = setInterval(() => {
            const agora = new Date()

            const novoHorario = agora.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            })

            setHorario(novoHorario)
        }, 1000)

        return () => {
            clearInterval(intervalo)
        }
    }, [])

    return(
        <div className="painel">
            <div className="img">
                <img src={logo} alt="logo do instituto" />
                <p>{horario}</p>
            </div>
            <div className="info">
                <span>
                    <h2>Total de pedidos</h2>
                    <p>{contagem.total ?? 0}</p>
                </span>
                <span>
                    <h2>Pendentes</h2>
                    <p>{contagem.pendentes ?? 0}</p>
                </span>
                <span>
                    <h2>Concluidos</h2>
                    <p>{contagem.concluidos ?? 0}</p>
                </span>
            </div>
            <ValidarPedido onValidar={validarPedido}/>
        </div>
    )
}