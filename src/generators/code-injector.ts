import fs from 'fs-extra';
import path from 'path';
import { CodeInjection } from '../types/templates';

export class CodeInjector {
  async applyInjections(injections: CodeInjection[], targetDir: string): Promise<void> {
    for (const injection of injections) {
      const fullPath = path.join(targetDir, injection.file);
      
      if (!await fs.pathExists(fullPath)) {
        continue;
      }
      
      let content = await fs.readFile(fullPath, 'utf-8');
      content = this.inject(content, injection);
      await fs.writeFile(fullPath, content);
    }
  }
  
  private inject(content: string, injection: CodeInjection): string {
    switch (injection.position) {
      case 'import':
        return injection.code + '\n' + content;
      default:
        return content;
    }
  }
}