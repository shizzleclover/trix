import Joi from 'joi';

// Example user schema
export const userSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email address',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters',
    }),
    name: Joi.string().min(2).optional(),
});

// Example create post schema
export const createPostSchema = Joi.object({
    title: Joi.string().min(1).max(100).required(),
    content: Joi.string().min(1).required(),
    published: Joi.boolean().default(false),
});

// Validation middleware helper
export function validate(schema: Joi.ObjectSchema) {
    return (data: unknown) => {
        const result = schema.validate(data, { abortEarly: false });
        if (result.error) {
            throw result.error;
        }
        return result.value;
    };
}
