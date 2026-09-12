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

        try {
            const pedido =
                await pedidosService.getPedidoPorId(id);

            if (!pedido) {
                return res.status(404).json({
                    erro: "Pedido não encontrado."
                });
            }

            if (pedido.email !== req.auth.cliente.email || pedido.telefone !== req.auth.cliente.telefone) {
                return res.status(403).json({ erro: 'Você não tem acesso a este pedido.' });
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

    async criarPedido(req, res) {
        try {
            const pedido = await pedidosService.criarPedido({
                ...req.auth.cliente,
                produtoId: req.body.produtoId
            });

            return res.status(201).json(pedido);

        } catch (error) {
            logError(error);

            if (error.code === 'PEDIDO_JA_EXISTE') {
                return res.status(409).json({ erro: 'Já existe um pedido para este cadastro.' });
            }
            if (error.code === 'PRODUTO_INVALIDO') {
                return res.status(400).json({ erro: 'Produto inválido.' });
            }

            return res.status(500).json({
                erro: 'Não foi possível criar o pedido.'
            });
        }
    }

    async concluirNovoPedido(req, res) {
        const codigo = Number(req.params.codigo);

        if (!Number.isInteger(codigo) || codigo <= 0) {
            throw new Error("O codigo do pedido deve ser positivo e inteiro")
        }

        try {
            const pedido = await pedidosService.concluirPedido(codigo);

            if (!pedido) {
                return res.status(404).json({ erro: 'Pedido não encontrado.' });
            }

            return res.status(200).json(pedido);
        } catch (error) {
            logError(error)
            return res.status(500).json({ erro: 'Não foi possível concluir o pedido.' });
        }
    }

    async contagem(req, res) {
        try {
            const contagem = await pedidosService.contagemService()
            const contagemPendentes = await pedidosService.contagemPendentesService()
            const contagemConcluidos = await pedidosService.contagemConcluidosService()

            res.status(200).json({
                total: contagem,
                pendentes: contagemPendentes,
                concluidos: contagemConcluidos
            })
        } catch (error) {
            logError(error)
            res.status(500).json({ erro: "Não foi possível obter a contagem dos pedidos." })
        }
    }
}

export default new PedidosController();
