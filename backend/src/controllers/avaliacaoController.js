import avaliacaoService from '../services/avalicacaoService.js';
import logError from '../utils/logError.js';

class AvaliacaoController {
    async criar(req, res) {
        const { cliente, avaliacao } = req.body;

        if (typeof cliente !== 'string' || typeof avaliacao !== 'number') {
            throw new Error("Digite os campos corretamente!")
        }

        try {
            const novaAvaliacao = await avaliacaoService.enviarAvaliacao({
                cliente: cliente.trim(),
                avaliacao: avaliacao
            });

            return res.status(201).json(novaAvaliacao);
        } catch (error) {
            logError(error)
            return res.status(500).json({ erro: 'Não foi possível enviar a avaliação.' });
        }
    }
}

export default new AvaliacaoController();