import ora, { Ora } from 'ora';

export class SpinnerHelper {
  private spinner: Ora | null = null;
  
  start(text: string): void {
    this.spinner = ora(text).start();
  }
  
  succeed(text?: string): void {
    if (this.spinner) {
      this.spinner.succeed(text);
      this.spinner = null;
    }
  }
  
  fail(text?: string): void {
    if (this.spinner) {
      this.spinner.fail(text);
      this.spinner = null;
    }
  }
}