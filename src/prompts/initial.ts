import inquirer from 'inquirer';
import fs from 'fs-extra';
import { ProjectType, PackageManager } from '../types/config';
import { PackageManagerDetector } from '../installers/package-manager';

export class InitialPrompts {
  async getProjectType(): Promise<ProjectType> {
    const { projectType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'projectType',
        message: 'What type of project do you want to create?',
        choices: [
          { name: '🎨  Frontend Application', value: 'frontend' },
          { name: '⚙️   Backend API', value: 'backend' }
        ]
      }
    ]);
    
    return projectType;
  }
  
  async getProjectName(defaultName?: string): Promise<string> {
    const { projectName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: defaultName || 'my-trix-app',
        validate: (input: string) => {
          if (!input) return 'Project name is required';
          if (!/^[a-z0-9-_]+$/.test(input)) {
            return 'Project name can only contain lowercase letters, numbers, hyphens, and underscores';
          }
          if (fs.existsSync(input)) {
            return `Directory "${input}" already exists`;
          }
          return true;
        }
      }
    ]);
    
    return projectName;
  }
  
  async getTypeScript(): Promise<boolean> {
    const { typescript } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Use TypeScript?',
        default: true
      }
    ]);
    
    return typescript;
  }
  
  async getPackageManager(): Promise<PackageManager> {
    const detector = new PackageManagerDetector();
    const detected = detector.detect();
    const available = await detector.getAvailable();
    
    if (available.length === 1) {
      return available[0];
    }
    
    const { packageManager } = await inquirer.prompt([
      {
        type: 'list',
        name: 'packageManager',
        message: 'Which package manager do you want to use?',
        default: detected,
        choices: available.map(pm => ({
          name: pm === detected ? `${pm} (detected)` : pm,
          value: pm
        }))
      }
    ]);
    
    return packageManager;
  }
  
  async getGitInit(): Promise<boolean> {
    const { git } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'git',
        message: 'Initialize git repository?',
        default: true
      }
    ]);
    
    return git;
  }
  
  async confirmProceed(): Promise<boolean> {
    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Proceed with project creation?',
        default: true
      }
    ]);
    
    return proceed;
  }
}