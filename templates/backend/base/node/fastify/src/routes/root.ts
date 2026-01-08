import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/', async function (request, reply) {
        return {
            message: 'Welcome to {{projectName}} API',
            framework: 'Fastify',
            version: '1.0.0'
        };
    });

    fastify.get('/health', async function (request, reply) {
        return { status: 'ok' };
    });
}

export default root;
