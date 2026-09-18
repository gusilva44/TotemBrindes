const base = process.env.REACT_APP_API_URL ?? '/api'

export default function api(caminho) {
    return `${base}${caminho}`
}
