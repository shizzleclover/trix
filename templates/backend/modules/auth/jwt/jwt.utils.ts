import jwt from 'jsonwebtoken';

export const generateToken = (id{{#if typescript}}: string{{/if}}) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    });
};
