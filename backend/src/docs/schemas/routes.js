/**
 * @swagger
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Verifica se a API está funcionando
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */

/**
 * @swagger
 * /pedidos:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Lista todos os pedidos
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /pedidos/pendentes:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Lista os pedidos pendentes
 *     responses:
 *       200:
 *         description: Lista de pedidos pendentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /pedidos/concluidos:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Lista os pedidos concluídos
 *     responses:
 *       200:
 *         description: Lista de pedidos concluídos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /pedidos:
 *   post:
 *     tags:
 *       - Pedidos
 *     summary: Cria um novo pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pedido
 *               - cliente
 *               - email
 *               - telefone
 *               - sexualidade
 *               - foi_aluno
 *             properties:
 *               pedido:
 *                 type: string
 *                 example: Curso de Desenvolvimento Web
 *               cliente:
 *                 type: string
 *                 example: Gustavo Silva
 *               email:
 *                 type: string
 *                 example: gustavo@email.com
 *               telefone:
 *                 type: string
 *                 example: 11999999999
 *               sexualidade:
 *                 type: string
 *                 example: Prefiro não informar
 *               foi_aluno:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados obrigatórios não informados
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /pedidos/{id}/concluir:
 *   patch:
 *     tags:
 *       - Pedidos
 *     summary: Conclui um pedido
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Pedido concluído com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /avaliacoes:
 *   post:
 *     tags:
 *       - Avaliações
 *     summary: Cria uma avaliação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cliente
 *               - avaliacao
 *             properties:
 *               cliente:
 *                 type: string
 *                 example: Gustavo Silva
 *               avaliacao:
 *                 type: number
 *                 example: 5
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
