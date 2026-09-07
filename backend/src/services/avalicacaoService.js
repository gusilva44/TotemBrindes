import pool from '../repository/db.js';

class AvaliacaoService {
    async enviarAvaliacao(avaliacao) {
        const resultado = await pool.query(
            `INSERT INTO avaliacoes (cliente, avaliacao)
             VALUES ($1, $2)
            RETURNING *`,
            [
                avaliacao.cliente,
                avaliacao.avaliacao
            ]
        );

        return resultado.rows[0];
    }
}
export default new AvaliacaoService();