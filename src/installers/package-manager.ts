import { execa } from 'execa';
import fs from 'fs-extra';
import { PackageManager, PackageManagerConfig } from '../types/package-managers';

export const PACKAGE_MANAGER_CONFIGS: Record<PackageManager, PackageManagerConfig> = {
  npm: {
    install: ['install'],
    installDev: ['install', '--save-dev'],
    run: 'run',
    exec: 'npx',
    lockFile: 'package-lock.json'
  },
  yarn: {
    install: ['add'],
    installDev: ['add', '--dev'],
    run: 'run',
    exec: 'yarn',
    lockFile: 'yarn.lock'
  },
  pnpm: {
    install: ['add'],
    installDev: ['add', '--save-dev'],
    run: 'run',
    exec: 'pnpm dlx',
    lockFile: 'pnpm-lock.yaml'
  },
  bun: {
    install: ['add'],
    installDev: ['add', '--dev'],
    run: 'run',
    exec: 'bunx',
    lockFile: 'bun.lockb'
  }
};

export class PackageManagerDetector {
  detect(): PackageManager {
    const userAgent = process.env.npm_config_user_agent || '';
    
    if (userAgent.includes('bun')) return 'bun';
    if (userAgent.includes('pnpm')) return 'pnpm';
    if (userAgent.includes('yarn')) return 'yarn';
    
    if (fs.existsSync('bun.lockb')) return 'bun';
    if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
    if (fs.existsSync('yarn.lock')) return 'yarn';
    if (fs.existsSync('package-lock.json')) return 'npm';
    
    return 'npm';
  }
  
  async isInstalled(pm: PackageManager): Promise<boolean> {
    try {
      await execa(pm, ['--version']);
      return true;
    } catch {
      return false;
    }
  }
  
  async getAvailable(): Promise<PackageManager[]> {
    const managers: PackageManager[] = ['npm', 'yarn', 'pnpm', 'bun'];
    const available: PackageManager[] = [];
    
    for (const pm of managers) {
      if (await this.isInstalled(pm)) {
        available.push(pm);
      }
    }
    
    return available;
  }
}