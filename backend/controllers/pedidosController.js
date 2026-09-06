import pedidosService from '../services/pedidosService.js';
import logError from '../utils/logError.js';

class PedidosController {
    async listarTodos(req, res) {
        try {
            const pedidos = await pedidosService.getTodosPedidos();

            if(!pedidos) throw new Error("Erro na hora de buscar os pedidos")

            return res.status(200).json(pedidos);
        } catch (error) {
            logError(error)
            return res.status(500).json({ erro: 'Não foi possível listar os pedidos.' });
        }
    }

    async buscarPorId(req, res) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: "ID inválido."
            });
        }

        try {
            const pedido =
                await pedidosService.getPedidoPorId(id);

            if (!pedido) {
                return res.status(404).json({
                    erro: "Pedido não encontrado."
                });
            }

            return res.status(200).json(pedido);

        } catch (error) {
            logError(error);

            return res.status(500).json({
                erro: "Não foi possível buscar o pedido."
            });
        }
    }

    async listarConcluidos(req, res) {
        try {
            const pedidos = await pedidosService.getPedidosConcluidos();

            return res.status(200).json(pedidos);
        } catch (error) {
            logError(error)
            return res.status(500).json({ erro: 'Não foi possível listar os pedidos concluídos.' });
        }
    }

    async listarPendentes(req, res) {
        try {
            const pedidos = await pedidosService.getPedidosPendentes();

            return res.status(200).json(pedidos);
        } catch (error) {
            logError(error)
            return res.status(500).json({ erro: 'Não foi possível listar os pedidos pendentes.' });
        }
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

    async concluirNovoPedido(req, res) {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("O id do pedido deve ser positivo e inteiro")
        }

        try {
            const pedido = await pedidosService.concluirPedido(id);

            if (!pedido) {
                return res.status(404).json({ erro: 'Pedido não encontrado.' });
            }

            return res.status(200).json(pedido);
        } catch (error) {
            logError(error)
            return res.status(500).json({ erro: 'Não foi possível concluir o pedido.' });
        }
    }
}

export default new PedidosController();
