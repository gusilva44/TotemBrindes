export function horaAtual() {
    let agora = new Date()
    let horaAtual = agora.toLocaleTimeString() + ' ' + agora.toLocaleDateString()
    return horaAtual
}