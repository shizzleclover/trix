import { Validator } from './validator.js';
import { TemplateModule } from '../types/template.js';
import { ProjectConfig, FrontendConfig, BackendConfig, MobileConfig } from '../types/config.js';
import { DependencyInstaller } from '../installers/dependency-installer.js';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      throw new Error(`Invalid configuration: ${validation.issues.map(i => i.message).join(', ')}`);
    }

    const modules = await this.loadModules(config);
    const dependencies = this.mergeDependencies(modules);
    const mergedPackageJson = this.buildPackageJson(config, modules, dependencies);
    const postInstallCommands = this.collectPostInstallCommands(modules, config);
    const postInstallMessages = this.collectPostInstallMessages(modules);

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
    const modules: TemplateModule[] = [];

    if (config.projectType === 'frontend') {
      modules.push(...this.loadFrontendModules(config as FrontendConfig));
    } else if (config.projectType === 'backend') {
      modules.push(...this.loadBackendModules(config as BackendConfig));
    } else if (config.projectType === 'mobile') {
      modules.push(...this.loadMobileModules(config as MobileConfig));
    }

    return modules;
  }

  private loadFrontendModules(config: FrontendConfig): TemplateModule[] {
    const modules: TemplateModule[] = [];

    modules.push(this.loadModule('frontend', 'base', config.framework));
    modules.push(this.loadModule('frontend', 'styling', config.styling));

    if (config.auth !== 'none') {
      modules.push(this.loadModule('frontend', 'auth', config.auth));
    }

    config.uiComponents.forEach(lib => {
      if (lib !== 'none') {
        modules.push(this.loadModule('frontend', 'ui-components', lib));
      }
    });

    if (config.stateManagement !== 'none') {
      modules.push(this.loadModule('frontend', 'state-management', config.stateManagement));
    }

    modules.push(this.loadModule('frontend', 'api-client', config.apiClient));

    if (config.routing) {
      modules.push(this.loadModule('frontend', 'routing', 'react-router'));
    }

    if (config.pwa) {
      modules.push(this.loadModule('frontend', 'pwa', 'vite-pwa'));
    }

    if (config.testing) {
      modules.push(this.loadModule('frontend', 'testing', 'vitest'));
    }

    return modules;
  }

  private loadBackendModules(config: BackendConfig): TemplateModule[] {
    const modules: TemplateModule[] = [];

    // Base module is required
    modules.push(this.loadModule('backend', 'base', `${config.runtime}-${config.framework}`));

    // Optional modules - only load if template exists
    if (config.database !== 'none') {
      this.tryLoadModule(modules, 'backend', 'database', config.database);
    }

    if (config.orm !== 'none') {
      this.tryLoadModule(modules, 'backend', 'orm', config.orm);
    }

    if (config.auth !== 'none') {
      this.tryLoadModule(modules, 'backend', 'auth', config.auth);
    }

    // These modules may not exist yet - silently skip if missing
    this.tryLoadModule(modules, 'backend', 'api-type', config.apiType);

    if (config.validation !== 'none') {
      this.tryLoadModule(modules, 'backend', 'validation', config.validation);
    }

    if (config.fileUpload) {
      this.tryLoadModule(modules, 'backend', 'file-upload', 'multer');
    }

    if (config.email) {
      this.tryLoadModule(modules, 'backend', 'email', 'nodemailer');
    }

    if (config.queue) {
      this.tryLoadModule(modules, 'backend', 'queue', 'bullmq');
    }

    if (config.cache) {
      this.tryLoadModule(modules, 'backend', 'cache', 'redis');
    }

    if (config.testing) {
      this.tryLoadModule(modules, 'backend', 'testing', 'jest');
    }

    if (config.logging) {
      this.tryLoadModule(modules, 'backend', 'logging', 'winston');
    }

    if (config.docker) {
      this.tryLoadModule(modules, 'backend', 'docker', 'compose');
    }

    return modules;
  }

  private tryLoadModule(
    modules: TemplateModule[],
    projectType: string,
    category: string,
    name: string
  ): void {
    const modulePath = this.getModulePath(projectType, category, name);
    if (fs.existsSync(modulePath)) {
      modules.push(this.loadModule(projectType, category, name));
    }
  }

  private getModulePath(projectType: string, category: string, name: string): string {
    if (category === 'base') {
      const nameParts = name.split('-');
      return path.join(__dirname, '../../templates', projectType, 'base', ...nameParts, 'module.json');
    }
    return path.join(__dirname, '../../templates', projectType, 'modules', category, name, 'module.json');
  }

  private loadMobileModules(config: MobileConfig): TemplateModule[] {
    const modules: TemplateModule[] = [];

    // Base framework template (expo or react-native-cli)
    modules.push(this.loadModule('mobile', 'base', config.framework));

    // Navigation
    if (config.navigation !== 'none') {
      modules.push(this.loadModule('mobile', 'navigation', config.navigation));
    }

    // Styling
    if (config.styling !== 'vanilla') {
      modules.push(this.loadModule('mobile', 'styling', config.styling));
    }

    // State management
    if (config.stateManagement !== 'none') {
      modules.push(this.loadModule('mobile', 'state-management', config.stateManagement));
    }

    // API client
    if (config.apiClient !== 'fetch') {
      modules.push(this.loadModule('mobile', 'api-client', config.apiClient));
    }

    // Auth
    if (config.auth !== 'none') {
      modules.push(this.loadModule('mobile', 'auth', config.auth));
    }

    // Testing
    if (config.testing) {
      modules.push(this.loadModule('mobile', 'testing', 'jest-rn'));
    }

    return modules;
  }

  private loadModule(
    projectType: string,
    category: string,
    name: string
  ): TemplateModule {
    let modulePath: string;

    if (category === 'base') {
      // Base templates handle their own nesting (e.g., node/express)
      const nameParts = name.split('-');
      modulePath = path.join(
        __dirname,
        '../../templates',
        projectType,
        'base',
        ...nameParts,
        'module.json'
      );
    } else {
      modulePath = path.join(
        __dirname,
        '../../templates',
        projectType,
        'modules',
        category,
        name,
        'module.json'
      );
    }

    try {
      if (fs.existsSync(modulePath)) {
        return fs.readJSONSync(modulePath);
      } else {
        console.warn(`Module file not found: ${modulePath}`);
      }
    } catch (error) {
      console.warn(`Could not load module: ${modulePath}`, error);
    }

    return {
      name: `${category}-${name}`,
      type: 'addon',
      files: [],
      dependencies: { prod: {}, dev: {} },
      scripts: {},
      configs: {},
      injections: [],
      postInstall: []
    };
  }

  private mergeDependencies(modules: TemplateModule[]): { prod: string[]; dev: string[] } {
    const prod = new Set<string>();
    const dev = new Set<string>();

    modules.forEach(module => {
      Object.keys(module.dependencies.prod).forEach(pkg => prod.add(pkg));
      Object.keys(module.dependencies.dev).forEach(pkg => dev.add(pkg));
    });

    return {
      prod: Array.from(prod),
      dev: Array.from(dev)
    };
  }

  private buildPackageJson(
    config: ProjectConfig,
    modules: TemplateModule[],
    dependencies: { prod: string[]; dev: string[] }
  ): any {
    const packageJson: any = {
      name: config.projectName,
      version: '0.1.0',
      private: true,
      type: 'module',
      scripts: {},
      dependencies: {},
      devDependencies: {}
    };

    modules.forEach(module => {
      Object.assign(packageJson.dependencies, module.dependencies.prod);
      Object.assign(packageJson.devDependencies, module.dependencies.dev);
      Object.assign(packageJson.scripts, module.scripts);
    });

    return packageJson;
  }

  private collectPostInstallCommands(
    modules: TemplateModule[],
    config: ProjectConfig
  ): PostInstallCommand[] {
    const commands: PostInstallCommand[] = [];

    if (config.projectType === 'frontend') {
      const fe = config as FrontendConfig;
      if (fe.uiComponents.includes('shadcn')) {
        commands.push({
          name: 'shadcn-init',
          execute: async (installer, cwd) => {
            await installer.exec('shadcn-ui@latest', ['init', '-y'], cwd);
          }
        });
      }
    }

    if (config.projectType === 'backend') {
      const be = config as BackendConfig;
      if (be.orm === 'prisma') {
        commands.push({
          name: 'prisma-generate',
          execute: async (installer, cwd) => {
            await installer.exec('prisma', ['generate'], cwd);
          }
        });
      }
    }

    return commands;
  }

  private collectPostInstallMessages(modules: TemplateModule[]): string[] {
    const messages: string[] = [];

    modules.forEach(module => {
      if (module.postInstall) {
        messages.push(...module.postInstall);
      }
    });

    return messages;
  }
}