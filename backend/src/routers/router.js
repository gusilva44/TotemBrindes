import express from 'express';
import avaliacaoController from '../controllers/avaliacaoController.js';
import pedidosController from '../controllers/pedidosController.js';
import produtosController from '../controllers/produtosController.js'

const router = express.Router();

router.get('/health', (req, res) => {
    return res.status(200).json({ status: 'ok' });
});

router.get('/pedidos', pedidosController.listarTodos);

router.get('/pedidos/pendentes', pedidosController.listarPendentes);
router.get('/pedidos/concluidos', pedidosController.listarConcluidos);

router.get('/pedidos/contagem', pedidosController.contagem)

router.post('/pedidos', pedidosController.criarPedido);
router.get('/pedidos/:id', pedidosController.buscarPorId);
router.patch('/pedidos/concluir/:codigo', pedidosController.concluirNovoPedido);

router.get('/produtos', produtosController.buscarProdutos)

router.post('/avaliacoes', avaliacaoController.criar);

export default router;