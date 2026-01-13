import { z } from 'zod';

// Example user schema
export const userSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

// Example create post schema
export const createPostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    content: z.string().min(1, 'Content is required'),
    published: z.boolean().default(false),
});

// Validation middleware helper
export function validate<T>(schema: z.ZodSchema<T>) {
    return (data: unknown): T => {
        return schema.parse(data);
    };
}

// Types inferred from schemas
export type User = z.infer<typeof userSchema>;
export type CreatePost = z.infer<typeof createPostSchema>;
