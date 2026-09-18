import { horaAtual } from "./date.js";

export default function logError(err) {
    let hora = horaAtual()
    console.error(`${hora} ERROR ---> ${err}`)
}