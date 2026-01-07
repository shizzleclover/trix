import { execa } from 'execa';

export class NPMInstaller {
  async installAll(cwd: string): Promise<void> {
    await execa('npm', ['install'], { cwd, stdio: 'inherit' });
  }
}