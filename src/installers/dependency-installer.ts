import { execa } from 'execa';
import { PackageManager } from '../types/package-managers';
import { PACKAGE_MANAGER_CONFIGS } from './package-manager';

export class DependencyInstaller {
  private config;
  
  constructor(private packageManager: PackageManager) {
    this.config = PACKAGE_MANAGER_CONFIGS[packageManager];
  }
  
  async installAll(cwd: string): Promise<void> {
    await execa(
      this.packageManager,
      ['install'],
      { cwd, stdio: 'inherit' }
    );
  }
  
  async exec(command: string, args: string[], cwd: string): Promise<void> {
    const execParts = this.config.exec.split(' ');
    await execa(
      execParts[0],
      [...execParts.slice(1), command, ...args],
      { cwd, stdio: 'inherit' }
    );
  }
}