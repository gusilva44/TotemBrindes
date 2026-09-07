import { horaAtual } from "./date.js";

export default function logError(err) {
    let hora = horaAtual()
    console.log(`${hora} ERROR ---> ${err}`)
}