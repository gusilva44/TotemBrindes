import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';

import router from './routers/router.js';
import swaggerSpec from './docs/swagger.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', router);

app.listen(PORT, () => {
    console.log(`API rodando na porta: ${PORT}`);
});