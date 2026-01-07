import chalk from 'chalk';

export class ColorHelper {
  static success(text: string): string {
    return chalk.green(text);
  }
  
  static error(text: string): string {
    return chalk.red(text);
  }
  
  static warning(text: string): string {
    return chalk.yellow(text);
  }
  
  static info(text: string): string {
    return chalk.blue(text);
  }
  
  static highlight(text: string): string {
    return chalk.cyan(text);
  }
}