import inquirer from 'inquirer';
import {
    BackendRuntime,
    BackendFramework,
    Database,
    ORM,
    BackendAuthStrategy,
    APIType,
    ValidationLibrary
} from '../../types/index.js';

export class BackendPrompts {
    async collect() {
        const runtime = await this.selectRuntime();
        const framework = await this.selectFramework(runtime);
        const database = await this.selectDatabase();
        const orm = await this.selectORM(database);
        const auth = await this.selectAuth();
        const apiType = await this.selectAPIType();
        const validation = await this.selectValidation();
        const features = await this.selectAdditionalFeatures();

        return {
            projectType: 'backend' as const,
            runtime,
            framework,
            database,
            orm,
            auth,
            apiType,
            validation,
            ...features
        };
    }

    private async selectRuntime(): Promise<BackendRuntime> {
        const { runtime } = await inquirer.prompt([
            {
                type: 'list',
                name: 'runtime',
                message: 'Choose a runtime:',
                choices: [
                    { name: 'Node.js', value: 'node' },
                    { name: 'Bun', value: 'bun' },
                    { name: 'Deno', value: 'deno' }
                ]
            }
        ]);

        return runtime;
    }

    private async selectFramework(runtime: BackendRuntime): Promise<BackendFramework> {
        const choices = this.getFrameworkChoices(runtime);

        const { framework } = await inquirer.prompt([
            {
                type: 'list',
                name: 'framework',
                message: 'Choose a backend framework:',
                choices
            }
        ]);

        return framework;
    }

    private getFrameworkChoices(runtime: BackendRuntime) {
        if (runtime === 'node') {
            return [
                { name: 'Express', value: 'express' },
                { name: 'Fastify', value: 'fastify' },
                { name: 'NestJS', value: 'nestjs' },
                { name: 'Hono', value: 'hono' },
                { name: 'Koa', value: 'koa' }
            ];
        }

        if (runtime === 'bun') {
            return [
                { name: 'Elysia', value: 'elysia' },
                { name: 'Hono', value: 'hono' }
            ];
        }

        if (runtime === 'deno') {
            return [
                { name: 'Oak', value: 'oak' },
                { name: 'Hono', value: 'hono' }
            ];
        }

        return [];
    }

    private async selectDatabase(): Promise<Database> {
        const { database } = await inquirer.prompt([
            {
                type: 'list',
                name: 'database',
                message: 'Choose a database:',
                choices: [
                    { name: 'None', value: 'none' },
                    { name: 'PostgreSQL', value: 'postgresql' },
                    { name: 'MySQL', value: 'mysql' },
                    { name: 'MongoDB', value: 'mongodb' },
                    { name: 'SQLite', value: 'sqlite' },
                    { name: 'Redis', value: 'redis' }
                ]
            }
        ]);

        return database;
    }

    private async selectORM(database: Database): Promise<ORM> {
        if (database === 'none') {
            return 'none';
        }

        const choices = this.getORMChoices(database);

        const { orm } = await inquirer.prompt([
            {
                type: 'list',
                name: 'orm',
                message: 'Choose an ORM/Query Builder:',
                choices: [
                    { name: 'None', value: 'none' },
                    ...choices
                ]
            }
        ]);

        return orm;
    }

    private getORMChoices(database: Database) {
        const choices: Array<{ name: string; value: ORM }> = [];

        if (database === 'postgresql' || database === 'mysql' || database === 'sqlite') {
            choices.push(
                { name: 'Prisma', value: 'prisma' },
                { name: 'Drizzle', value: 'drizzle' },
                { name: 'TypeORM', value: 'typeorm' },
                { name: 'Sequelize', value: 'sequelize' }
            );
        }

        if (database === 'mongodb') {
            choices.push(
                { name: 'Mongoose', value: 'mongoose' },
                { name: 'Prisma', value: 'prisma' }
            );
        }

        return choices;
    }

    private async selectAuth(): Promise<BackendAuthStrategy> {
        const { auth } = await inquirer.prompt([
            {
                type: 'list',
                name: 'auth',
                message: 'Choose an authentication strategy:',
                choices: [
                    { name: 'None', value: 'none' },
                    { name: 'JWT', value: 'jwt' },
                    { name: 'Passport.js', value: 'passport' },
                    { name: 'Lucia', value: 'lucia' },
                    { name: 'Clerk (Backend)', value: 'clerk' },
                    { name: 'Supabase Auth', value: 'supabase' }
                ]
            }
        ]);

        return auth;
    }

    private async selectAPIType(): Promise<APIType> {
        const { apiType } = await inquirer.prompt([
            {
                type: 'list',
                name: 'apiType',
                message: 'Choose API type:',
                choices: [
                    { name: 'REST API', value: 'rest' },
                    { name: 'GraphQL', value: 'graphql' },
                    { name: 'tRPC', value: 'trpc' }
                ]
            }
        ]);

        return apiType;
    }

    private async selectValidation(): Promise<ValidationLibrary> {
        const { validation } = await inquirer.prompt([
            {
                type: 'list',
                name: 'validation',
                message: 'Choose a validation library:',
                choices: [
                    { name: 'Zod', value: 'zod' },
                    { name: 'Joi', value: 'joi' },
                    { name: 'Yup', value: 'yup' },
                    { name: 'None', value: 'none' }
                ]
            }
        ]);

        return validation;
    }

    private async selectAdditionalFeatures() {
        const { features } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'features',
                message: 'Select additional features:',
                choices: [
                    { name: 'File Upload', value: 'fileUpload' },
                    { name: 'Email Service', value: 'email' },
                    { name: 'Job Queue', value: 'queue' },
                    { name: 'Caching', value: 'cache' },
                    { name: 'Testing Setup', value: 'testing', checked: true },
                    { name: 'Logging', value: 'logging', checked: true },
                    { name: 'Docker Configuration', value: 'docker' }
                ]
            }
        ]);

        return {
            fileUpload: features.includes('fileUpload'),
            email: features.includes('email'),
            queue: features.includes('queue'),
            cache: features.includes('cache'),
            testing: features.includes('testing'),
            logging: features.includes('logging'),
            docker: features.includes('docker')
        };
    }
}