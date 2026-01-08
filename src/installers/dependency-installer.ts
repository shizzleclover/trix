import { execa } from 'execa';
import { PackageManager } from '../types/package-manager.js';
import { PACKAGE_MANAGER_CONFIGS } from './package-manager.js';

export class DependencyInstaller {
  private config;

  constructor(private packageManager: PackageManager) {
    this.config = PACKAGE_MANAGER_CONFIGS[packageManager];
  }

  async installProd(packages: string[], cwd: string): Promise<void> {
    if (packages.length === 0) return;

    await execa(
      this.packageManager,
      [...this.config.install, ...packages],
      { cwd, stdio: 'inherit' }
    );
  }

  async installDev(packages: string[], cwd: string): Promise<void> {
    if (packages.length === 0) return;

    await execa(
      this.packageManager,
      [...this.config.installDev, ...packages],
      { cwd, stdio: 'inherit' }
    );
  }

  async runScript(script: string, cwd: string): Promise<void> {
    await execa(
      this.packageManager,
      [this.config.run, script],
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

  async installAll(cwd: string): Promise<void> {
    await execa(
      this.packageManager,
      ['install'],
      { cwd, stdio: 'inherit' }
    );
  }
}