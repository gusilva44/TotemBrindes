import { con } from "../repository/db.js";

class PedidosService {

    async getTodosPedidos() {
        const [resultado] = await con.query(
            `SELECT * 
             FROM pedidos 
             ORDER BY id DESC`
        );

        return resultado;
    }


    async getPedidoPorId(id) {
        const [resultado] = await con.query(
            `SELECT 
                pedidos.*,
                produtos.nome AS produto_nome,
                produtos.descricao AS produto_descricao,
                produtos.imagem AS produto_imagem
            FROM pedidos
            INNER JOIN produtos 
                ON pedidos.produto_id = produtos.id
            WHERE pedidos.id = ?`,
            [id]
        );

        return resultado[0];
    }


    async getPedidosConcluidos() {
        const [resultado] = await con.query(
            `SELECT 
                pedidos.*,
                produtos.nome AS produto,
                DATE_FORMAT(
                    pedidos.criado_em,
                    '%d/%m/%Y %H:%i'
                ) AS horario_pedido
             FROM pedidos
             INNER JOIN produtos 
                ON produtos.id = pedidos.produto_id
             WHERE pedidos.status = ?
             ORDER BY pedidos.id DESC`,
            ['concluido']
        );

        return resultado;
    }


    async getPedidosPendentes() {
        const [resultado] = await con.query(
            `SELECT 
                pedidos.*,
                produtos.nome AS produto,
                DATE_FORMAT(
                    pedidos.criado_em,
                    '%d/%m/%Y %H:%i'
                ) AS horario_pedido
             FROM pedidos
             INNER JOIN produtos 
                ON produtos.id = pedidos.produto_id
             WHERE pedidos.status = ?
             ORDER BY pedidos.id DESC`,
            ['pendente']
        );

        return resultado;
    }


    async concluirPedido(codigo) {

        const [resultadoUpdate] = await con.query(
            `UPDATE pedidos
             SET 
                status = ?,
                concluido_em = CURRENT_TIMESTAMP
             WHERE codigo_retirada = ?
             AND status = ?`,
            [
                'concluido',
                codigo,
                'pendente'
            ]
        );

        if (resultadoUpdate.affectedRows === 0) {
            return null;
        }

        const [resultado] = await con.query(
            `SELECT *
             FROM pedidos
             WHERE codigo_retirada = ?`,
            [codigo]
        );

        return resultado[0];
    }


    async criarPedido(pedido) {

        const client = await con.getConnection();

        try {

            await client.beginTransaction();

            /*
             * Impede duas requisições simultâneas
             * de criarem pedidos ao mesmo tempo.
             */
            await client.query(
                "SELECT GET_LOCK('criar_pedido_lock', 10)"
            );


            /*
             * Verifica o produto e bloqueia
             * a linha durante a transação.
             */
            const [produtos] = await client.query(
                `SELECT 
                    id,
                    estoque
                 FROM produtos
                 WHERE id = ?
                 FOR UPDATE`,
                [pedido.produtoId]
            );


            if (produtos.length === 0) {

                const error = new Error(
                    'Produto não encontrado'
                );

                error.code = 'PRODUTO_INVALIDO';

                throw error;
            }


            if (produtos[0].estoque <= 0) {

                const error = new Error(
                    'Produto esgotado'
                );

                error.code = 'PRODUTO_ESGOTADO';

                throw error;
            }


            /*
             * Verifica se o usuário já fez um pedido.
             */
            const [verificacao] = await client.query(
                `SELECT id
                 FROM pedidos
                 WHERE LOWER(email) = LOWER(?)
                 OR REGEXP_REPLACE(
                        telefone,
                        '[^0-9]',
                        ''
                    ) = REGEXP_REPLACE(
                        ?,
                        '[^0-9]',
                        ''
                    )
                 LIMIT 1`,
                [
                    pedido.email,
                    pedido.telefone
                ]
            );


            if (verificacao.length > 0) {

                const error = new Error(
                    'Usuário já possui pedido'
                );

                error.code = 'PEDIDO_JA_EXISTE';

                throw error;
            }


            /*
             * Descobre o próximo código do pedido.
             */
            const [ultimoPedido] = await client.query(
                `SELECT codigo_pedido
                 FROM pedidos
                 WHERE codigo_pedido IS NOT NULL
                 ORDER BY id DESC
                 LIMIT 1`
            );


            let proximoNumero = 1;


            if (ultimoPedido.length > 0) {

                const ultimoCodigo =
                    ultimoPedido[0].codigo_pedido;

                const numero = parseInt(
                    ultimoCodigo.replace("A", ""),
                    10
                );


                if (!isNaN(numero)) {
                    proximoNumero = numero + 1;
                }
            }


            const codigoPedido =
                `A${String(proximoNumero).padStart(3, "0")}`;


            /*
             * Gera código de retirada.
             */
            let codigoRetirada;


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
                    );


                const [codigoEmUso] =
                    await client.query(
                        `SELECT 1
                         FROM pedidos
                         WHERE codigo_retirada = ?`,
                        [candidato]
                    );


                if (codigoEmUso.length === 0) {

                    codigoRetirada = candidato;

                    break;
                }
            }


            if (!codigoRetirada) {

                const error = new Error(
                    'Não foi possível gerar um código de retirada único.'
                );

                error.code = 'CODIGO_RETIRADA_ERRO';

                throw error;
            }


            /*
             * Cria o pedido.
             */
            const [insertResult] =
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
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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


            /*
             * Diminui o estoque.
             */
            await client.query(
                `UPDATE produtos
                 SET estoque = estoque - 1
                 WHERE id = ?`,
                [pedido.produtoId]
            );


            /*
             * Finaliza a transação.
             */
            await client.commit();


            /*
             * Busca o pedido criado.
             */
            const [novoPedido] =
                await con.query(
                    `SELECT *
                     FROM pedidos
                     WHERE id = ?`,
                    [insertResult.insertId]
                );


            return novoPedido[0];

        } catch (error) {

            await client.rollback();

            throw error;

        } finally {

            /*
             * Libera o lock do MySQL.
             */
            await client.query(
                "SELECT RELEASE_LOCK('criar_pedido_lock')"
            );

            client.release();
        }
    }


    async contagemService() {

        const [resultado] = await con.query(
            `SELECT COUNT(*) AS total
             FROM pedidos`
        );

        return Number(resultado[0].total);
    }


    async contagemPendentesService() {

        const [resultado] = await con.query(
            `SELECT COUNT(*) AS total
             FROM pedidos
             WHERE status = 'pendente'`
        );

        return Number(resultado[0].total);
    }


    async contagemConcluidosService() {

        const [resultado] = await con.query(
            `SELECT COUNT(*) AS total
             FROM pedidos
             WHERE status = 'concluido'`
        );

        return Number(resultado[0].total);
    }
}

export default new PedidosService();