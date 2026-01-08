import { ProjectConfig } from './config.js';

export interface TemplateModule {
  name: string;
  type: 'base' | 'addon';
  framework?: string;

  files: TemplateFile[];

  dependencies: {
    prod: Record<string, string>;
    dev: Record<string, string>;
  };

  scripts?: Record<string, string>;

  configs?: Record<string, any>;

  injections?: CodeInjection[];

  compatibleWith?: string[];
  incompatibleWith?: string[];

  postInstall?: string[];
}

export interface TemplateFile {
  source: string;
  destination: string;
  type: 'copy' | 'template' | 'merge';
  condition?: (config: ProjectConfig) => boolean;
}

export interface CodeInjection {
  file: string;
  position: 'import' | 'provider' | 'config' | 'custom';
  code: string;
  marker?: string;
}