import inquirer from 'inquirer';
import {
  BackendRuntime,
  BackendFramework,
  Database,
  ORM,
  BackendAuthStrategy,
  APIType,
  ValidationLibrary
} from '../../types/config';

export class BackendPrompts {
  async collect() {
    const runtime = await this.selectRuntime();
    const framework = await this.selectFramework();
    const database = await this.selectDatabase();
    const orm = await this.selectORM();
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
  
  private async selectFramework(): Promise<BackendFramework> {
    const { framework } = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: 'Choose a backend framework:',
        choices: [
          { name: 'Express', value: 'express' },
          { name: 'Fastify', value: 'fastify' },
          { name: 'NestJS', value: 'nestjs' }
        ]
      }
    ]);
    
    return framework;
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
          { name: 'MongoDB', value: 'mongodb' }
        ]
      }
    ]);
    
    return database;
  }
  
  private async selectORM(): Promise<ORM> {
    const { orm } = await inquirer.prompt([
      {
        type: 'list',
        name: 'orm',
        message: 'Choose an ORM:',
        choices: [
          { name: 'None', value: 'none' },
          { name: 'Prisma', value: 'prisma' },
          { name: 'Drizzle', value: 'drizzle' }
        ]
      }
    ]);
    
    return orm;
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
          { name: 'Passport.js', value: 'passport' }
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
          { name: 'Testing Setup', value: 'testing', checked: true },
          { name: 'Logging', value: 'logging', checked: true },
          { name: 'Docker Configuration', value: 'docker' }
        ]
      }
    ]);
    
    return {
      fileUpload: false,
      email: false,
      queue: false,
      cache: false,
      testing: features.includes('testing'),
      logging: features.includes('logging'),
      docker: features.includes('docker')
    };
  }
}