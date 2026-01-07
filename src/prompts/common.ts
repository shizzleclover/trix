import inquirer from 'inquirer';
import validatePackageName from 'validate-npm-package-name';

export class CommonPrompts {
  static validateProjectName(name: string): boolean | string {
    if (!name) {
      return 'Project name is required';
    }
    
    const validation = validatePackageName(name);
    
    if (!validation.validForNewPackages) {
      const errors = [
        ...(validation.errors || []),
        ...(validation.warnings || [])
      ];
      return errors[0] || 'Invalid project name';
    }
    
    return true;
  }
}