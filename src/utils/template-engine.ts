import Handlebars from 'handlebars';

export class TemplateEngine {
  private handlebars: typeof Handlebars;
  
  constructor() {
    this.handlebars = Handlebars;
    this.registerHelpers();
  }
  
  compile(template: string): HandlebarsTemplateDelegate {
    return this.handlebars.compile(template);
  }
  
  render(template: string, data: any): string {
    const compiled = this.compile(template);
    return compiled(data);
  }
  
  private registerHelpers(): void {
    this.handlebars.registerHelper('eq', (a, b) => a === b);
    this.handlebars.registerHelper('ne', (a, b) => a !== b);
    this.handlebars.registerHelper('includes', (array, value) => {
      return Array.isArray(array) && array.includes(value);
    });
    this.handlebars.registerHelper('uppercase', (str) => {
      return typeof str === 'string' ? str.toUpperCase() : str;
    });
    this.handlebars.registerHelper('lowercase', (str) => {
      return typeof str === 'string' ? str.toLowerCase() : str;
    });
  }
}