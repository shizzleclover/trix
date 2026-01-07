import { spawn } from 'child_process';

export class ProcessHelper {
  static async execute(
    command: string,
    args: string[],
    cwd: string
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { cwd, shell: true });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        resolve({ stdout, stderr, exitCode: code || 0 });
      });
      
      child.on('error', (error) => {
        reject(error);
      });
    });
  }
}