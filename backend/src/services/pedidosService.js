import pool from '../repository/db.js'

class PedidosService {

    async getTodosPedidos() {
        const resultado = await pool.query(
            `SELECT *
             FROM pedidos
             ORDER BY id DESC`
        )

        return resultado
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
        )

        return resultado.rows[0]
    }


    async getPedidosConcluidos() {
        const resultado = await pool.query(
            `SELECT
                pedidos.*,
                produtos.nome AS produto,
                TO_CHAR(
                    pedidos.criado_em,
                    'DD/MM/YYYY HH24:MI'
                ) AS horario_pedido
             FROM pedidos
             INNER JOIN produtos
                ON produtos.id = pedidos.produto_id
             WHERE pedidos.status = $1
             ORDER BY pedidos.id DESC`,
            ['concluido']
        )

        return resultado.rows
    }


    async getPedidosPendentes() {
        const resultado = await pool.query(
            `SELECT
                pedidos.*,
                produtos.nome AS produto,
                TO_CHAR(
                    pedidos.criado_em,
                    'DD/MM/YYYY HH24:MI'
                ) AS horario_pedido
             FROM pedidos
             INNER JOIN produtos
                ON produtos.id = pedidos.produto_id
             WHERE pedidos.status = $1
             ORDER BY pedidos.id DESC`,
            ['pendente']
        )

        return resultado.rows
    }


    async concluirPedido(codigo) {

        const resultadoUpdate = await pool.query(
            `UPDATE pedidos
             SET
                status = $1,
                concluido_em = CURRENT_TIMESTAMP
             WHERE codigo_retirada = $2
             AND status = $3
             RETURNING *`,
            [
                'concluido',
                codigo,
                'pendente'
            ]
        )

        if (resultadoUpdate.rowCount === 0) {
            return null
        }

        return resultadoUpdate.rows[0]
    }


    async criarPedido(pedido) {

        const client = await pool.connect()

        try {

            await client.query('BEGIN')
            
            const produtos = await client.query(
                `SELECT
                    id,
                    estoque
                 FROM produtos
                 WHERE id = $1
                 FOR UPDATE`,
                [pedido.produtoId]
            )


            if (produtos.rows.length === 0) {

                const error = new Error(
                    'Produto não encontrado'
                )

                error.code = 'PRODUTO_INVALIDO'

                throw error
            }


            if (produtos.rows[0].estoque <= 0) {

                const error = new Error(
                    'Produto esgotado'
                )

                error.code = 'PRODUTO_ESGOTADO'

                throw error
            }

            const verificacao = await client.query(
                `SELECT id
                 FROM pedidos
                 WHERE LOWER(email) = LOWER($1)
                 OR REGEXP_REPLACE(
                        telefone,
                        '[^0-9]',
                        '',
                        'g'
                    ) = REGEXP_REPLACE(
                        $2,
                        '[^0-9]',
                        '',
                        'g'
                    )
                 LIMIT 1`,
                [
                    pedido.email,
                    pedido.telefone
                ]
            )


            if (verificacao.rows.length > 0) {

                const error = new Error(
                    'Usuário já possui pedido'
                )

                error.code = 'PEDIDO_JA_EXISTE'

                throw error
            }

            const ultimoPedido = await client.query(
                `SELECT codigo_pedido
                 FROM pedidos
                 WHERE codigo_pedido IS NOT NULL
                 ORDER BY id DESC
                 LIMIT 1`
            )


            let proximoNumero = 1


            if (ultimoPedido.rows.length > 0) {

                const ultimoCodigo =
                    ultimoPedido.rows[0].codigo_pedido

                const numero = parseInt(
                    ultimoCodigo.replace('A', ''),
                    10
                )


                if (!isNaN(numero)) {
                    proximoNumero = numero + 1
                }
            }


            const codigoPedido =
                `A${String(proximoNumero).padStart(3, '0')}`

            let codigoRetirada


            for (
                let tentativa = 0;
                tentativa < 10;
                tentativa += 1
            ) {

                const candidato =
                    String(
                        Math.floor(
                            1000 + Math.random() * 9000
                        )
                    )


                const codigoEmUso =
                    await client.query(
                        `SELECT 1
                         FROM pedidos
                         WHERE codigo_retirada = $1`,
                        [candidato]
                    )


                if (codigoEmUso.rows.length === 0) {

                    codigoRetirada = candidato

                    break
                }
            }


            if (!codigoRetirada) {

                const error = new Error(
                    'Não foi possível gerar um código de retirada único.'
                )

                error.code = 'CODIGO_RETIRADA_ERRO'

                throw error
            }

            const insertResult =
                await client.query(
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
                    VALUES (
                        $1, $2, $3, $4, $5,
                        $6, $7, $8, $9
                    )
                    RETURNING id`,
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
                )


            const pedidoId = insertResult.rows[0].id

            await client.query(
                `UPDATE produtos
                 SET estoque = estoque - 1
                 WHERE id = $1`,
                [pedido.produtoId]
            )

            await client.query('COMMIT')

            const novoPedido =
                await pool.query(
                    `SELECT
                        pedidos.*,
                        produtos.nome AS produto_nome,
                        produtos.descricao AS produto_descricao,
                        produtos.imagem AS produto_imagem
                     FROM pedidos
                     INNER JOIN produtos
                        ON produtos.id = pedidos.produto_id
                     WHERE pedidos.id = $1`,
                    [pedidoId]
                )


            return novoPedido.rows[0]

        } catch (error) {

            await client.query('ROLLBACK')

            throw error

        } finally {

            client.release()
        }
    }


    async contagemService() {

        const resultado = await pool.query(
            `SELECT COUNT(*) AS total
             FROM pedidos`
        )

        return Number(resultado.rows[0].total)
    }


    async contagemPendentesService() {

        const resultado = await pool.query(
            `SELECT COUNT(*) AS total
             FROM pedidos
             WHERE status = 'pendente'`
        )

        return Number(resultado.rows[0].total)
    }


    async contagemConcluidosService() {

        const resultado = await pool.query(
            `SELECT COUNT(*) AS total
             FROM pedidos
             WHERE status = 'concluido'`
        )

        return Number(resultado.rows[0].total)
    }
}

export default new PedidosService()