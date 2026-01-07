import fs from 'fs-extra';
import path from 'path';
import { ResolvedConfig } from '../core/config-builder';
import { ProjectConfig } from '../types/config';
import { CodeInjector } from './code-injector';

export class FileGenerator {
  async generateProject(resolvedConfig: ResolvedConfig): Promise<void> {
    const { config, mergedPackageJson } = resolvedConfig;
    
    await fs.ensureDir(config.targetDirectory);
    await fs.ensureDir(path.join(config.targetDirectory, 'src'));
    
    await this.generatePackageJson(mergedPackageJson, config);
    await this.generateReadme(config);
  }
  
  private async generatePackageJson(packageJson: any, config: ProjectConfig): Promise<void> {
    const packageJsonPath = path.join(config.targetDirectory, 'package.json');
    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
  }
  
  private async generateReadme(config: ProjectConfig): Promise<void> {
    const readmePath = path.join(config.targetDirectory, 'README.md');
    const readme = `# ${config.projectName}\n\nGenerated with Trix\n`;
    await fs.writeFile(readmePath, readme);
  }
}