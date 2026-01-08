import { ProjectConfig, FrontendConfig, BackendConfig } from '../types/config.js';

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
}

export class Validator {
  async validateCombination(config: ProjectConfig): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];

    if (config.projectType === 'frontend') {
      issues.push(...this.validateFrontend(config as FrontendConfig));
    } else if (config.projectType === 'backend') {
      issues.push(...this.validateBackend(config as BackendConfig));
    }

    const hasErrors = issues.some(issue => issue.type === 'error');

    return {
      valid: !hasErrors,
      issues
    };
  }

  private validateFrontend(config: FrontendConfig): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (config.styling !== 'tailwind') {
      if (config.uiComponents.includes('shadcn')) {
        issues.push({
          type: 'error',
          message: 'shadcn/ui requires Tailwind CSS'
        });
      }

      if (config.uiComponents.includes('daisyui')) {
        issues.push({
          type: 'error',
          message: 'daisyUI requires Tailwind CSS'
        });
      }
    }

    if (config.uiComponents.includes('shadcn') && config.uiComponents.includes('daisyui')) {
      issues.push({
        type: 'warning',
        message: 'Using both shadcn and daisyUI may cause conflicts. Consider using only one.'
      });
    }

    if (config.framework !== 'react' && config.framework !== 'vue') {
      if (config.stateManagement !== 'none') {
        issues.push({
          type: 'warning',
          message: `${config.stateManagement} is primarily designed for React/Vue`
        });
      }
    }

    if (config.auth === 'privy' && config.framework !== 'react') {
      issues.push({
        type: 'error',
        message: 'Privy currently only supports React'
      });
    }

    return issues;
  }

  private validateBackend(config: BackendConfig): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (config.orm !== 'none' && config.database === 'none') {
      issues.push({
        type: 'error',
        message: 'Cannot use an ORM without selecting a database'
      });
    }

    if (config.orm === 'mongoose' && config.database !== 'mongodb') {
      issues.push({
        type: 'error',
        message: 'Mongoose only works with MongoDB'
      });
    }

    if (config.orm === 'sequelize' && config.database === 'mongodb') {
      issues.push({
        type: 'error',
        message: 'Sequelize does not support MongoDB'
      });
    }

    if (config.framework === 'elysia' && config.runtime !== 'bun') {
      issues.push({
        type: 'error',
        message: 'Elysia only works with Bun runtime'
      });
    }

    if (config.framework === 'nestjs' && config.runtime !== 'node') {
      issues.push({
        type: 'warning',
        message: 'NestJS is primarily designed for Node.js'
      });
    }

    if (config.apiType === 'trpc') {
      if (config.validation !== 'zod') {
        issues.push({
          type: 'warning',
          message: 'tRPC works best with Zod for validation'
        });
      }
    }

    if (config.queue && !config.cache) {
      issues.push({
        type: 'info',
        message: 'Job queues typically require Redis. Consider enabling cache.'
      });
    }

    return issues;
  }
}