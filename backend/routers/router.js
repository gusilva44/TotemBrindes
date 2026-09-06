import express from 'express';
import avaliacaoController from '../controllers/avaliacaoController.js';
import pedidosController from '../controllers/pedidosController.js';

const router = express.Router();

router.get('/health', (req, res) => {
    return res.status(200).json({ status: 'ok' });
});

router.get('/pedidos', pedidosController.listarTodos);
router.get('/pedidos/:id', pedidosController.buscarPorId);
router.get('/pedidos/pendentes', pedidosController.listarPendentes);
router.get('/pedidos/concluidos', pedidosController.listarConcluidos);

router.post('/pedidos', pedidosController.criarNovoPedido);
router.patch('/pedidos/:id/concluir', pedidosController.concluirNovoPedido);
router.post('/avaliacoes', avaliacaoController.criar);

export default router;
