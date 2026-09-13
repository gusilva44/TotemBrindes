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
            `SELECT
                pedidos.*,
                produtos.nome AS produto,
                TO_CHAR(pedidos.criado_em, 'DD/MM/YYYY HH24:MI') AS horario_pedido
             FROM pedidos
             INNER JOIN produtos ON produtos.id = pedidos.produto_id
             WHERE pedidos.status = $1
             ORDER BY pedidos.id DESC`,
            ['concluido']
        );

        return resultado.rows;
    }

    async getPedidosPendentes() {
        const resultado = await pool.query(
            `SELECT
                pedidos.*,
                produtos.nome AS produto,
                TO_CHAR(pedidos.criado_em, 'DD/MM/YYYY HH24:MI') AS horario_pedido
             FROM pedidos
             INNER JOIN produtos ON produtos.id = pedidos.produto_id
             WHERE pedidos.status = $1
             ORDER BY pedidos.id DESC`,
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
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            await client.query('SELECT pg_advisory_xact_lock($1)', [5831701]);

            const produto = await client.query(
                'SELECT id, estoque FROM produtos WHERE id = $1 FOR UPDATE',
                [pedido.produtoId]
            );
            if (produto.rowCount === 0) {
                const error = new Error('Produto não encontrado');
                error.code = 'PRODUTO_INVALIDO';
                throw error;
            }

            if (produto.rows[0].estoque <= 0) {
                const error = new Error('Produto esgotado');
                error.code = 'PRODUTO_ESGOTADO';
                throw error;
            }

            const ultimoPedido = await client.query(
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

            const verificacao = await client.query(
            `SELECT id FROM pedidos
            WHERE lower(email) = lower($1)
            OR regexp_replace(telefone, '\\D', '', 'g') = $2
            LIMIT 1`,
            [
                pedido.email,
                pedido.telefone
            ]
        )

            if (verificacao.rowCount > 0) {
                const error = new Error('Usuário já possui pedido');
                error.code = 'PEDIDO_JA_EXISTE';
                throw error;
        }

        const codigoPedido =
            `A${String(proximoNumero).padStart(3, "0")}`;

        let codigoRetirada;
        for (let tentativa = 0; tentativa < 10; tentativa += 1) {
            const candidato = String(Math.floor(1000 + Math.random() * 9000));
            const codigoEmUso = await client.query(
                'SELECT 1 FROM pedidos WHERE codigo_retirada = $1',
                [candidato]
            );
            if (codigoEmUso.rowCount === 0) {
                codigoRetirada = candidato;
                break;
            }
        }

        if (!codigoRetirada) {
            throw new Error('Não foi possível gerar um código de retirada único.');
        }

        const resultado = await client.query(
            `INSERT INTO pedidos (
                cliente,
                email,
                telefone,
                genero,
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
                pedido.genero,
                pedido.foiAluno,
                pedido.produtoId,
                'pendente',
                codigoPedido,
                codigoRetirada
            ]
        );

            await client.query(
                'UPDATE produtos SET estoque = estoque - 1 WHERE id = $1',
                [pedido.produtoId]
            );

            await client.query('COMMIT');
            return resultado.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
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
