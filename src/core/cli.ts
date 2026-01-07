import { InitialPrompts } from '../prompts/initial';
import { FrontendPrompts } from '../prompts/frontend';
import { BackendPrompts } from '../prompts/backend';
import { ConfigurationBuilder } from './config-builder';
import { FileGenerator } from '../generators/file-generator';
import { DependencyInstaller } from '../installers/dependency-installer';
import { Logger } from './logger';
import { GitHelper } from '../utils/git';
import { ProjectConfig } from '../types/config';
import { PACKAGE_MANAGER_CONFIGS } from '../installers/package-manager';
import chalk from 'chalk';
import ora from 'ora';

export class TrixCLI {
  private initialPrompts: InitialPrompts;
  private frontendPrompts: FrontendPrompts;
  private backendPrompts: BackendPrompts;
  private configBuilder: ConfigurationBuilder;
  private fileGenerator: FileGenerator;
  private logger: Logger;
  private gitHelper: GitHelper;
  
  constructor() {
    this.initialPrompts = new InitialPrompts();
    this.frontendPrompts = new FrontendPrompts();
    this.backendPrompts = new BackendPrompts();
    this.configBuilder = new ConfigurationBuilder();
    this.fileGenerator = new FileGenerator();
    this.logger = new Logger();
    this.gitHelper = new GitHelper();
  }
  
  async run(args: string[]): Promise<void> {
    try {
      this.displayWelcome();
      
      const projectName = args[0] || await this.initialPrompts.getProjectName();
      const projectType = await this.initialPrompts.getProjectType();
      const typescript = await this.initialPrompts.getTypeScript();
      const packageManager = await this.initialPrompts.getPackageManager();
      const git = await this.initialPrompts.getGitInit();
      
      const baseConfig = {
        projectName,
        projectType,
        typescript,
        packageManager,
        git,
        targetDirectory: `./${projectName}`
      };
      
      let projectConfig: ProjectConfig;
      
      if (projectType === 'frontend') {
        const frontendConfig = await this.frontendPrompts.collect();
        projectConfig = { ...baseConfig, ...frontendConfig };
      } else if (projectType === 'backend') {
        const backendConfig = await this.backendPrompts.collect();
        projectConfig = { ...baseConfig, ...backendConfig };
      } else {
        throw new Error('Fullstack not yet implemented');
      }
      
      this.logger.step('Building configuration...');
      const resolvedConfig = await this.configBuilder.buildConfiguration(projectConfig);
      
      this.displaySummary(projectConfig);
      const proceed = await this.initialPrompts.confirmProceed();
      if (!proceed) {
        this.logger.info('Project creation cancelled');
        return;
      }
      
      const spinner = ora('Generating project files...').start();
      await this.fileGenerator.generateProject(resolvedConfig);
      spinner.succeed('Project files generated');
      
      const installer = new DependencyInstaller(projectConfig.packageManager);
      
      const installSpinner = ora('Installing dependencies...').start();
      await installer.installAll(projectConfig.targetDirectory);
      installSpinner.succeed('Dependencies installed');
      
      if (projectConfig.git) {
        const gitSpinner = ora('Initializing git repository...').start();
        await this.gitHelper.init(projectConfig.targetDirectory);
        await this.gitHelper.initialCommit(projectConfig.targetDirectory);
        gitSpinner.succeed('Git repository initialized');
      }
      
      this.displaySuccess(projectConfig);
      
    } catch (error) {
      this.logger.error('Project creation failed');
      console.error(error);
      process.exit(1);
    }
  }
  
  private displayWelcome(): void {
    console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════╗
║                                       ║
║           Welcome to TRIX             ║
║     Universal Project Generator       ║
║                                       ║
╚═══════════════════════════════════════╝
    `));
  }
  
  private displaySummary(config: ProjectConfig): void {
    console.log(chalk.cyan('\n📋 Project Summary:\n'));
    console.log(chalk.white(`  Name: ${config.projectName}`));
    console.log(chalk.white(`  Type: ${config.projectType}`));
    console.log(chalk.white(`  TypeScript: ${config.typescript ? 'Yes' : 'No'}`));
    console.log(chalk.white(`  Package Manager: ${config.packageManager}\n`));
  }
  
  private displaySuccess(config: ProjectConfig): void {
    console.log(chalk.green.bold('\n✨ Project created successfully!\n'));
    console.log(chalk.cyan('📂 Next steps:\n'));
    console.log(chalk.white(`  cd ${config.projectName}`));
    console.log(chalk.white(`  ${config.packageManager} ${PACKAGE_MANAGER_CONFIGS[config.packageManager].run} dev\n`));
  }
}