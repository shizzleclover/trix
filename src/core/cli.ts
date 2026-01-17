import { InitialPrompts } from '../prompts/initial.js';
import { FrontendPrompts } from '../prompts/frontend/index.js';
import { BackendPrompts } from '../prompts/backend/index.js';
import { MobilePrompts } from '../prompts/mobile/index.js';
import { ConfigurationBuilder } from './config-builder.js';
import { FileGenerator } from '../generators/file-generator.js';
import { FlutterGenerator } from '../generators/flutter-generator.js';
import { DependencyInstaller } from '../installers/dependency-installer.js';
import { Logger } from './logger.js';
import { GitHelper } from '../utils/git.js';
import { ProjectConfig, FlutterConfig, ProjectType } from '../types/config.js';
import { PACKAGE_MANAGER_CONFIGS } from '../installers/package-manager.js';
import chalk from 'chalk';
import ora from 'ora';

export interface CLIOptions {
  yes?: boolean;
  type?: ProjectType;
  dryRun?: boolean;
}

// Default configurations for non-interactive mode
const DEFAULTS = {
  frontend: {
    projectType: 'frontend' as const,
    framework: 'react' as const,
    styling: 'tailwind' as const,
    uiComponents: ['shadcn'] as const,
    stateManagement: 'zustand' as const,
    dataFetching: 'tanstack-query' as const,
    auth: 'none' as const,
    testing: false,
  },
  backend: {
    projectType: 'backend' as const,
    runtime: 'node' as const,
    framework: 'express' as const,
    database: 'postgresql' as const,
    orm: 'prisma' as const,
    auth: 'jwt' as const,
    apiType: 'rest' as const,
    validation: 'zod' as const,
    fileUpload: false,
    email: false,
    queue: false,
    cache: false,
    testing: true,
    logging: true,
    docker: true,
  },
  mobile: {
    projectType: 'mobile' as const,
    framework: 'expo' as const,
    navigation: 'expo-router' as const,
    styling: 'nativewind' as const,
    stateManagement: 'zustand' as const,
    apiClient: 'tanstack-query' as const,
    auth: 'none' as const,
    testing: false,
  },
};

export class TrixCLI {
  private initialPrompts: InitialPrompts;
  private frontendPrompts: FrontendPrompts;
  private backendPrompts: BackendPrompts;
  private mobilePrompts: MobilePrompts;
  private configBuilder: ConfigurationBuilder;
  private fileGenerator: FileGenerator;
  private flutterGenerator: FlutterGenerator;
  private logger: Logger;
  private gitHelper: GitHelper;

  constructor() {
    this.initialPrompts = new InitialPrompts();
    this.frontendPrompts = new FrontendPrompts();
    this.backendPrompts = new BackendPrompts();
    this.mobilePrompts = new MobilePrompts();
    this.configBuilder = new ConfigurationBuilder();
    this.fileGenerator = new FileGenerator();
    this.flutterGenerator = new FlutterGenerator();
    this.logger = new Logger();
    this.gitHelper = new GitHelper();
  }

  async run(args: string[], options: CLIOptions = {}): Promise<void> {
    try {
      // Version check is handled by Commander in index.ts
      this.displayWelcome();

      const useDefaults = options.yes || false;
      const dryRun = options.dryRun || false;

      if (useDefaults) {
        this.logger.info('Using default configuration (non-interactive mode)');
      }

      if (dryRun) {
        this.logger.info('Dry run mode - no files will be created');
      }

      const projectName = args[0] || (useDefaults ? 'my-app' : await this.initialPrompts.getProjectName());
      const projectType = options.type || (useDefaults ? 'frontend' : await this.initialPrompts.getProjectType());

      let projectConfig: ProjectConfig;

      if (useDefaults) {
        // Non-interactive mode - use defaults
        const defaults = DEFAULTS[projectType as keyof typeof DEFAULTS] || DEFAULTS.frontend;
        projectConfig = {
          projectName,
          typescript: true,
          packageManager: 'npm',
          git: true,
          targetDirectory: `./${projectName}`,
          ...defaults,
        } as ProjectConfig;
      } else if (projectType === 'mobile') {
        // For mobile, ask framework first to determine if Flutter or React Native
        const mobileConfig = await this.mobilePrompts.collect();

        if (mobileConfig.framework === 'flutter') {
          // Flutter uses Dart, not TypeScript, and uses pub instead of npm
          const git = await this.initialPrompts.getGitInit();
          projectConfig = {
            projectName,
            typescript: false, // Flutter uses Dart
            packageManager: 'npm', // Not used for Flutter, but required by type
            git,
            targetDirectory: `./${projectName}`,
            ...mobileConfig
          } as ProjectConfig;
        } else {
          // React Native - ask for TypeScript and package manager
          const typescript = await this.initialPrompts.getTypeScript();
          const packageManager = await this.initialPrompts.getPackageManager();
          const git = await this.initialPrompts.getGitInit();
          projectConfig = {
            projectName,
            typescript,
            packageManager,
            git,
            targetDirectory: `./${projectName}`,
            ...mobileConfig
          };
        }
      } else {
        // Frontend/Backend - normal flow
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

        if (projectType === 'frontend') {
          const frontendConfig = await this.frontendPrompts.collect();
          projectConfig = { ...baseConfig, ...frontendConfig };
        } else if (projectType === 'backend') {
          const backendConfig = await this.backendPrompts.collect();
          projectConfig = { ...baseConfig, ...backendConfig };
        } else {
          throw new Error('Fullstack not yet implemented');
        }
      }

      // Check if this is a Flutter project - handle differently
      const isFlutter = projectConfig.projectType === 'mobile' && (projectConfig as any).framework === 'flutter';

      // Skip config builder for Flutter - it doesn't use module.json templates
      let resolvedConfig: any = null;
      if (!isFlutter) {
        this.logger.step('Building configuration...');
        resolvedConfig = await this.configBuilder.buildConfiguration(projectConfig);
      }

      this.displaySummary(projectConfig);
      const proceed = await this.initialPrompts.confirmProceed();
      if (!proceed) {
        this.logger.info('Project creation cancelled');
        return;
      }

      // Handle Flutter projects differently
      if (isFlutter) {
        const spinner = ora('Creating Flutter project...').start();
        await this.flutterGenerator.generateProject(projectConfig as FlutterConfig);
        spinner.succeed('Flutter project created');

        // Run flutter pub get
        const pubSpinner = ora('Running flutter pub get...').start();
        const { execa } = await import('execa');
        await execa('flutter', ['pub', 'get'], { cwd: projectConfig.targetDirectory });
        pubSpinner.succeed('Dependencies installed');

        if (projectConfig.git) {
          const gitSpinner = ora('Initializing git repository...').start();
          await this.gitHelper.init(projectConfig.targetDirectory);
          await this.gitHelper.initialCommit(projectConfig.targetDirectory);
          gitSpinner.succeed('Git repository initialized');
        }

        this.displayFlutterSuccess(projectConfig as FlutterConfig);
      } else {
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
      }

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
    } else if (config.projectType === 'mobile') {
      const mb = config as any;
      console.log(chalk.white(`  Framework: ${mb.framework}`));

      if (mb.framework === 'flutter') {
        // Flutter-specific summary
        if (mb.stateManagement !== 'none') console.log(chalk.white(`  State: ${mb.stateManagement}`));
        if (mb.navigation !== 'none') console.log(chalk.white(`  Navigation: ${mb.navigation}`));
        console.log(chalk.white(`  HTTP Client: ${mb.httpClient}`));
        if (mb.auth !== 'none') console.log(chalk.white(`  Auth: ${mb.auth}`));
        console.log(chalk.white(`  Platforms: ${mb.platforms.join(', ')}`));
      } else {
        // React Native summary
        if (mb.navigation !== 'none') console.log(chalk.white(`  Navigation: ${mb.navigation}`));
        console.log(chalk.white(`  Styling: ${mb.styling}`));
        if (mb.stateManagement !== 'none') console.log(chalk.white(`  State: ${mb.stateManagement}`));
        console.log(chalk.white(`  API Client: ${mb.apiClient}`));
        if (mb.auth !== 'none') console.log(chalk.white(`  Auth: ${mb.auth}`));
      }
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

  private displayFlutterSuccess(config: FlutterConfig): void {
    console.log(chalk.green.bold('\n✨ Flutter project created successfully!\n'));

    console.log(chalk.cyan('📂 Next steps:\n'));
    console.log(chalk.white(`  cd ${config.projectName}`));
    console.log(chalk.white('  flutter run'));

    console.log(chalk.yellow('\n⚠️  Available commands:\n'));
    console.log(chalk.white('  flutter run              # Run on connected device'));
    console.log(chalk.white('  flutter run -d chrome    # Run on web'));
    console.log(chalk.white('  flutter build apk        # Build Android APK'));
    console.log(chalk.white('  flutter build ios        # Build iOS app'));

    if (config.stateManagement === 'riverpod' || config.navigation === 'auto-route') {
      console.log(chalk.yellow('\n⚠️  Code generation required:\n'));
      console.log(chalk.white('  flutter pub run build_runner build'));
    }

    console.log(chalk.cyan('\n📚 Documentation:\n'));
    console.log(chalk.white('  https://flutter.dev/docs'));
    console.log('');
  }
}
