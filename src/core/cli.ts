import { InitialPrompts } from '../prompts/initial.js';
import { FrontendPrompts } from '../prompts/frontend/index.js';
import { BackendPrompts } from '../prompts/backend/index.js';
import { ConfigurationBuilder } from './config-builder.js';
import { FileGenerator } from '../generators/file-generator.js';
import { DependencyInstaller } from '../installers/dependency-installer.js';
import { Logger } from './logger.js';
import { GitHelper } from '../utils/git.js';
import { ProjectConfig } from '../types/config.js';
import { PACKAGE_MANAGER_CONFIGS } from '../installers/package-manager.js';
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
      await this.installDependencies(installer, resolvedConfig, projectConfig.targetDirectory);

      if (projectConfig.git) {
        const gitSpinner = ora('Initializing git repository...').start();
        await this.gitHelper.init(projectConfig.targetDirectory);
        await this.gitHelper.initialCommit(projectConfig.targetDirectory);
        gitSpinner.succeed('Git repository initialized');
      }

      this.displaySuccess(projectConfig, resolvedConfig);

    } catch (error) {
      this.logger.error('Project creation failed');
      console.error(error);
      process.exit(1);
    }
  }

  private async installDependencies(
    installer: DependencyInstaller,
    resolvedConfig: any,
    targetDir: string
  ): Promise<void> {
    const spinner = ora('Installing dependencies...').start();

    try {
      await installer.installAll(targetDir);
      spinner.succeed('Dependencies installed');

      if (resolvedConfig.postInstallCommands.length > 0) {
        spinner.start('Running post-install scripts...');
        for (const command of resolvedConfig.postInstallCommands) {
          await command.execute(installer, targetDir);
        }
        spinner.succeed('Post-install scripts completed');
      }

    } catch (error) {
      spinner.fail('Installation failed');
      throw error;
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
    console.log(chalk.white(`  Package Manager: ${config.packageManager}`));

    if (config.projectType === 'frontend') {
      const fe = config as any;
      console.log(chalk.white(`  Framework: ${fe.framework}`));
      console.log(chalk.white(`  Styling: ${fe.styling}`));
      if (fe.auth !== 'none') console.log(chalk.white(`  Auth: ${fe.auth}`));
      if (fe.uiComponents.length > 0) {
        console.log(chalk.white(`  UI Components: ${fe.uiComponents.join(', ')}`));
      }
    } else if (config.projectType === 'backend') {
      const be = config as any;
      console.log(chalk.white(`  Runtime: ${be.runtime}`));
      console.log(chalk.white(`  Framework: ${be.framework}`));
      if (be.database !== 'none') console.log(chalk.white(`  Database: ${be.database}`));
      if (be.orm !== 'none') console.log(chalk.white(`  ORM: ${be.orm}`));
      console.log(chalk.white(`  API Type: ${be.apiType}`));
    }

    console.log('');
  }

  private displaySuccess(config: ProjectConfig, resolved: any): void {
    console.log(chalk.green.bold('\n✨ Project created successfully!\n'));

    console.log(chalk.cyan('📂 Next steps:\n'));
    console.log(chalk.white(`  cd ${config.projectName}`));

    const pmConfig = PACKAGE_MANAGER_CONFIGS[config.packageManager];
    console.log(chalk.white(`  ${config.packageManager} ${pmConfig.run} dev`));

    if (resolved.postInstallMessages.length > 0) {
      console.log(chalk.yellow('\n⚠️  Important Notes:\n'));
      resolved.postInstallMessages.forEach((msg: string) => {
        console.log(chalk.white(`  • ${msg}`));
      });
    }

    console.log(chalk.cyan('\n📚 Documentation:\n'));
    console.log(chalk.white('  https://trix.dev/docs'));
    console.log('');
  }
}
