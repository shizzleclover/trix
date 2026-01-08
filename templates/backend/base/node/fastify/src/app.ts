import fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import rootResults from './routes/root';

export async function buildApp() {
    const app = fastify({
        logger: true
    });

    await app.register(cors);
    await app.register(sensible);

    // Register routes
    await app.register(rootResults);

    return app;
}
