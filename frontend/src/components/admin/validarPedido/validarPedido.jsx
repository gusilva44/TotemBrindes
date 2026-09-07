import { useState } from 'react'
import './validarPedido.scss'

export default function ValidarPedido({ onValidar }) {
    const [codigo, setCodigo] = useState('')
    const [mensagem, setMensagem] = useState(false)

    async function enviar(e) {
        e.preventDefault()

        if (!codigo.trim()) {
            return
        }

        const sucesso = await onValidar(codigo.trim())

        if (sucesso) {
            setCodigo('')
            setMensagem(false)
        } else {
            setCodigo('')
            setMensagem(true)
        }
    }

    return (
        <form className="validar-pedido" onSubmit={enviar}>
            <h2>Validar pedido</h2>

            <input
                type="text"
                placeholder={
                    mensagem
                        ? 'Código não encontrado'
                        : 'Digite o código de retirada'
                }
                value={codigo}
                onChange={(e) => {
                    setCodigo(e.target.value)
                    setMensagem(false)
                }}
                className={mensagem ? "erro" : ''}
            />

            <button type="submit">
                Validar
            </button>
        </form>
    )
}