import { execa } from 'execa';

export class BunInstaller {
  async installAll(cwd: string): Promise<void> {
    await execa('bun', ['install'], { cwd, stdio: 'inherit' });
  }
}