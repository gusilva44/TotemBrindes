import { criarTokenCliente } from '../auth/jwt.js';

class AuthController {
    cadastrar(req, res) {
        const sessao = criarTokenCliente(req.body);
        return res.status(201).json(sessao);
    }
}

export default new AuthController();
