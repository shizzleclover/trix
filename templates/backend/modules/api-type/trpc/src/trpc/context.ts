import { inferAsyncReturnType } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

interface User {
    id: string;
    email: string;
    name?: string;
}

export async function createContext({ req, res }: CreateExpressContextOptions) {
    // Get user from request (e.g., from JWT token)
    const user: User | null = null; // Replace with actual auth logic

    return {
        req,
        res,
        user,
    };
}

export type Context = inferAsyncReturnType<typeof createContext>;
