import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from './index';

export const appRouter = router({
    // Public procedures
    hello: publicProcedure
        .input(z.object({ name: z.string().optional() }))
        .query(({ input }) => {
            return { greeting: `Hello ${input.name ?? 'World'}!` };
        }),

    // Example CRUD operations
    users: router({
        list: publicProcedure.query(async () => {
            // Replace with your database query
            return [
                { id: '1', name: 'Alice', email: 'alice@example.com' },
                { id: '2', name: 'Bob', email: 'bob@example.com' },
            ];
        }),

        byId: publicProcedure
            .input(z.object({ id: z.string() }))
            .query(async ({ input }) => {
                // Replace with your database query
                return { id: input.id, name: 'User', email: 'user@example.com' };
            }),

        create: protectedProcedure
            .input(z.object({
                name: z.string().min(2),
                email: z.string().email(),
            }))
            .mutation(async ({ input }) => {
                // Replace with your database insert
                return { id: 'new-id', ...input };
            }),
    }),
});

// Export type router type signature
export type AppRouter = typeof appRouter;
