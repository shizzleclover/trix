import dotenv from 'dotenv';
import { buildApp } from './app';

dotenv.config();

const start = async () => {
    try {
        const app = await buildApp();
        const port = parseInt(process.env.PORT || '3000', 10);

        await app.listen({ port, host: '0.0.0.0' });
    } catch (err) {
        console.error(err);
        process.exit(1);}};

start();
