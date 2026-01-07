import { execa } from 'execa';

export class PNPMInstaller {
  async installAll(cwd: string): Promise<void> {
    await execa('pnpm', ['install'], { cwd, stdio: 'inherit' });
  }
}