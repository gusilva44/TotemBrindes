import logError from './logError.js'

const url = process.env.EVOLUTION_API_URL
const instancia = process.env.EVOLUTION_INSTANCE
const apiKey = process.env.EVOLUTION_API_KEY

const habilitado = Boolean(url && instancia && apiKey)

function numeroInternacional(telefone) {
    const digitos = String(telefone ?? '').replace(/\D/g, '')

    if (digitos.length < 10 || digitos.length > 13) return null
    if (digitos.startsWith('55')) return digitos

    return `55${digitos}`
}

export default async function enviarMensagem(telefone, texto) {
    if (!habilitado) return

    const numero = numeroInternacional(telefone)

    if (!numero) {
        logError(`WhatsApp: telefone inválido (${telefone})`)
        return
    }

    try {
        const resposta = await fetch(`${url}/message/sendText/${instancia}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: apiKey
            },
            body: JSON.stringify({ number: numero, text: texto }),
            signal: AbortSignal.timeout(5000)
        })

        if (!resposta.ok) {
            logError(`WhatsApp: envio falhou (${resposta.status}) para ${numero}`)
        }
    } catch (error) {
        logError(`WhatsApp: ${error}`)
    }
}
