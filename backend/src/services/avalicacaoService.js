import { con } from "../repository/db.js";

class AvaliacaoService {
    async enviarAvaliacao(avaliacao) {
        const [resultado] = await con.query(
            `INSERT INTO avaliacoes (cliente, avaliacao)
             VALUES (?, ?)
            RETURNING *`,
            [
                avaliacao.cliente,
                avaliacao.avaliacao
            ]
        );

        return resultado;
    }
}
export default new AvaliacaoService();