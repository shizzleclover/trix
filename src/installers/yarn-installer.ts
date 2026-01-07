import { execa } from 'execa';

export class YarnInstaller {
  async installAll(cwd: string): Promise<void> {
    await execa('yarn', ['install'], { cwd, stdio: 'inherit' });
  }
}