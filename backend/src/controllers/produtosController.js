import pool from '../repository/db.js'

class ProdutosController {
    async buscarProdutos(req, res){
        try {
            const resultado = await pool.query(
                "SELECT * FROM produtos ORDER BY id ASC"
            )

            return res.status(200).json(resultado.rows)

        } catch (error) {
            console.error("Erro ao buscar os produtos: " + error)

            return res.status(500).json({
                mensagem: "Erro ao buscar os produtos."
            })
        }
    }
}

export default new ProdutosController;
