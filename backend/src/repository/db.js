import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE
});

export default pool;