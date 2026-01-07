export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export interface PackageManagerConfig {
  install: string[];
  installDev: string[];
  run: string;
  exec: string;
  lockFile: string;
}

export interface PackageManagerInfo {
  name: PackageManager;
  detected: boolean;
  installed: boolean;
  version?: string;
}