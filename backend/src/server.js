import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';

import router from './routers/router.js';
import swaggerSpec from './docs/swagger.js';
import { protegerResposta, rotaNaoEncontrada, tratarErro } from './middlewares/security.js';

const PORT = process.env.PORT || 3000;

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3001')
    .split(',')
    .map((origin) => origin.trim());
const isLocalDevelopmentOrigin = (origin) =>
    process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || isLocalDevelopmentOrigin(origin)) {
            return callback(null, true);
        }
        console.warn(`Origem CORS bloqueada: ${origin}`);
        return callback(new Error('Origem não permitida pelo CORS.'));
    },
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Key'],
    maxAge: 600
}));
app.use(express.json({ limit: '20kb', strict: true }));
app.use(protegerResposta);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', router);
app.use(rotaNaoEncontrada);
app.use(tratarErro);

app.listen(PORT, () => {
    console.log(`API rodando na porta: ${PORT}`);
});
