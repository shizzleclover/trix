import { Validator } from './validator';
import { TemplateModule } from '../types/templates';
import { ProjectConfig, FrontendConfig, BackendConfig } from '../types/config';
import { DependencyInstaller } from '../installers/dependency-installer';
import path from 'path';
import fs from 'fs-extra';

export interface ResolvedConfig {
  config: ProjectConfig;
  modules: TemplateModule[];
  dependencies: {
    prod: string[];
    dev: string[];
  };
  mergedPackageJson: any;
  postInstallCommands: PostInstallCommand[];
  postInstallMessages: string[];
}

export interface PostInstallCommand {
  name: string;
  execute: (installer: DependencyInstaller, cwd: string) => Promise<void>;
}

export class ConfigurationBuilder {
  private validator: Validator;
  
  constructor() {
    this.validator = new Validator();
  }
  
  async buildConfiguration(config: ProjectConfig): Promise<ResolvedConfig> {
    const validation = await this.validator.validateCombination(config);
    if (!validation.valid) {
      throw new Error(`Invalid configuration`);
    }
    
    const modules = await this.loadModules(config);
    const dependencies = this.mergeDependencies(modules);
    const mergedPackageJson = this.buildPackageJson(config, modules);
    const postInstallCommands: PostInstallCommand[] = [];
    const postInstallMessages: string[] = [];
    
    return {
      config,
      modules,
      dependencies,
      mergedPackageJson,
      postInstallCommands,
      postInstallMessages
    };
  }
  
  private async loadModules(config: ProjectConfig): Promise<TemplateModule[]> {
    return [];
  }
  
  private mergeDependencies(modules: TemplateModule[]): { prod: string[]; dev: string[] } {
    return { prod: [], dev: [] };
  }
  
  private buildPackageJson(config: ProjectConfig, modules: TemplateModule[]): any {
    return {
      name: config.projectName,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'vite build'
      },
      dependencies: {},
      devDependencies: {}
    };
  }
}