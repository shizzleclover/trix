import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

export class GitHelper {
  async init(cwd: string): Promise<void> {
    await execa('git', ['init'], { cwd });
    
    const gitignore = `
node_modules
dist
.env
.env.local
*.log
.DS_Store
    `.trim();
    
    await fs.writeFile(path.join(cwd, '.gitignore'), gitignore);
  }
  
  async initialCommit(cwd: string): Promise<void> {
    await execa('git', ['add', '-A'], { cwd });
    await execa('git', ['commit', '-m', 'Initial commit from Trix'], { cwd });
  }
}