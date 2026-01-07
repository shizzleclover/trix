import fs from 'fs-extra';
import path from 'path';

export class FileSystemHelper {
  static async ensureDir(dirPath: string): Promise<void> {
    await fs.ensureDir(dirPath);
  }
  
  static async fileExists(filePath: string): Promise<boolean> {
    return fs.pathExists(filePath);
  }
  
  static async readFile(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
  }
  
  static async writeFile(filePath: string, content: string): Promise<void> {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
  }
  
  static async copyFile(src: string, dest: string): Promise<void> {
    await fs.ensureDir(path.dirname(dest));
    await fs.copy(src, dest);
  }
  
  static async readJSON(filePath: string): Promise<any> {
    return fs.readJSON(filePath);
  }
  
  static async writeJSON(filePath: string, data: any): Promise<void> {
    await fs.writeJSON(filePath, data, { spaces: 2 });
  }
}