import { ProjectConfig, FrontendConfig, BackendConfig } from '../types/config';

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
    
    return {
      valid: issues.filter(i => i.type === 'error').length === 0,
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
    
    return issues;
  }
}