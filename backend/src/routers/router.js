import express from 'express';
import pedidosController from '../controllers/pedidosController.js';
import produtosController from '../controllers/produtosController.js'
import authController from '../controllers/authController.js';
import { exigirAdministrador, exigirAutenticacao } from '../middlewares/authentication.js';
import { validarCadastro, validarId, validarPedido } from '../middlewares/validation.js';

const router = express.Router();

router.get('/health', (req, res) => {
    return res.status(200).json({ status: 'ok' });
});

router.get('/pedidos', exigirAdministrador, pedidosController.listarTodos);

router.get('/pedidos/pendentes', exigirAdministrador, pedidosController.listarPendentes);
router.get('/pedidos/concluidos', exigirAdministrador, pedidosController.listarConcluidos);

router.get('/pedidos/contagem', exigirAdministrador, pedidosController.contagem)

router.post('/auth/cadastro', validarCadastro, authController.cadastrar);

router.post('/pedidos', exigirAutenticacao, validarPedido, pedidosController.criarPedido);
router.get('/pedidos/:id', exigirAutenticacao, validarId, pedidosController.buscarPorId);
router.patch('/pedidos/concluir/:codigo', exigirAdministrador, pedidosController.concluirNovoPedido);

router.get('/produtos', produtosController.buscarProdutos)

export default router;
