import pool from '../repository/db.js';

class PedidosService {
    async getTodosPedidos() {
        const resultado = await pool.query(
            'SELECT * FROM pedidos ORDER BY id DESC'
        );

        return resultado.rows;
    }

    async getPedidoPorId(id) {

        const resultado = await pool.query(
            `SELECT
                pedidos.*,

                produtos.nome AS produto_nome,
                produtos.descricao AS produto_descricao,
                produtos.imagem AS produto_imagem

            FROM pedidos

            INNER JOIN produtos
                ON pedidos.produto_id = produtos.id

            WHERE pedidos.id = $1`,
            [id]
        );

        return resultado.rows[0];
    }

    async getPedidosConcluidos() {
        const resultado = await pool.query(
            `SELECT * FROM pedidos
             WHERE status = $1
             ORDER BY id DESC`,
            ['concluido']
        );

        return resultado.rows;
    }

    async getPedidosPendentes() {
        const resultado = await pool.query(
            `SELECT * FROM pedidos
             WHERE status = $1
             ORDER BY id DESC`,
            ['pendente']
        );

        return resultado.rows;
    }

    async concluirPedido(codigo) {
        const resultado = await pool.query(
            `UPDATE pedidos
             SET status = $1
             WHERE codigo_retirada = $2
             RETURNING *`,
            ['concluido', codigo]
        );

        return resultado.rows[0];
    }

    async criarPedido(pedido) {

        const ultimoPedido = await pool.query(
            `SELECT codigo_pedido
            FROM pedidos
            WHERE codigo_pedido IS NOT NULL
            ORDER BY id DESC
            LIMIT 1`
        );

        let proximoNumero = 1;

        if (ultimoPedido.rows.length > 0) {
            const ultimoCodigo =
                ultimoPedido.rows[0].codigo_pedido;

            const numero = parseInt(
                ultimoCodigo.replace("A", ""),
                10
            );

            if (!isNaN(numero)) {
                proximoNumero = numero + 1;
            }
        }

        const verificacao = await pool.query(
            `SELECT * FROM pedidos
            WHERE email = $1
            AND telefone = $2`,
            [
                pedido.email,
                pedido.telefone
            ]
        )

        if(verificacao.rows > 0){
            throw new Error("Usuário já existe")
        }

        const codigoPedido =
            `A${String(proximoNumero).padStart(3, "0")}`;

        const codigoRetirada =
            String(Math.floor(1000 + Math.random() * 9000));

        const resultado = await pool.query(
            `INSERT INTO pedidos (
                cliente,
                email,
                telefone,
                sexualidade,
                foi_aluno,
                produto_id,
                status,
                codigo_pedido,
                codigo_retirada
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                pedido.cliente,
                pedido.email,
                pedido.telefone,
                pedido.sexualidade,
                pedido.foiAluno,
                pedido.produtoId,
                'pendente',
                codigoPedido,
                codigoRetirada
            ]
        );

        return resultado.rows[0];
    }

    async contagemService(){
        const resultado = await pool.query(
            `SELECT count(*) FROM pedidos`
        )

        return parseInt(resultado.rows[0].count, 10);
    }

    async contagemPendentesService(){
        const resultado = await pool.query(
            `SELECT count(*) FROM pedidos
            WHERE status = 'pendente'`
        )

        return parseInt(resultado.rows[0].count, 10);
    }

    async contagemConcluidosService(){
        const resultado = await pool.query(
            `SELECT count(*) FROM pedidos
            WHERE status = 'concluido'`
        )

        return parseInt(resultado.rows[0].count, 10);
    }
}

export default new PedidosService();
