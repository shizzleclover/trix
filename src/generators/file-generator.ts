import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import Handlebars from 'handlebars';
import { ResolvedConfig } from '../core/config-builder.js';
import { ProjectConfig, FrontendConfig, BackendConfig } from '../types/config.js';
import { CodeInjector } from './code-injector.js';
import { PACKAGE_MANAGER_CONFIGS } from '../installers/package-manager.js';

export class FileGenerator {
    private handlebars: typeof Handlebars;

    constructor() {
        this.handlebars = Handlebars;
        this.registerHelpers();
    }

    async generateProject(resolvedConfig: ResolvedConfig): Promise<void> {
        const { config, modules, mergedPackageJson } = resolvedConfig;

        await fs.ensureDir(config.targetDirectory);

        for (const module of modules) {
            await this.processModule(module, config);
        }

        await this.generatePackageJson(mergedPackageJson, config);
        await this.applyInjections(resolvedConfig, config);
        await this.generateReadme(config);
        await this.generateEnvExample(config);
    }

    private async processModule(module: any, config: ProjectConfig): Promise<void> {
        for (const file of module.files || []) {
            if (file.condition && !file.condition(config)) {
                continue;
            }

            const sourcePath = path.join(__dirname, '../../templates', file.source);

            // Render destination path as a template
            const destSubPathTmpl = this.handlebars.compile(file.destination);
            const renderedDestSubPath = destSubPathTmpl(config);
            const destPath = path.join(config.targetDirectory, renderedDestSubPath);

            await fs.ensureDir(path.dirname(destPath));

            switch (file.type) {
                case 'copy':
                    await fs.copy(sourcePath, destPath);
                    break;

                case 'template':
                    await this.processTemplate(sourcePath, destPath, config);
                    break;

                case 'merge':
                    await this.mergeFile(sourcePath, destPath, config);
                    break;
            }
        }
    }

    private async processTemplate(
        sourcePath: string,
        destPath: string,
        config: ProjectConfig
    ): Promise<void> {
        const templateContent = await fs.readFile(sourcePath, 'utf-8');
        const template = this.handlebars.compile(templateContent);
        const rendered = template(config);
        await fs.writeFile(destPath, rendered);
    }

    private async mergeFile(
        sourcePath: string,
        destPath: string,
        config: ProjectConfig
    ): Promise<void> {
        const sourceContent = await fs.readFile(sourcePath, 'utf-8');

        if (await fs.pathExists(destPath)) {
            const existingContent = await fs.readFile(destPath, 'utf-8');
            const merged = existingContent + '\n\n' + sourceContent;
            await fs.writeFile(destPath, merged);
        } else {
            await fs.writeFile(destPath, sourceContent);
        }
    }

    private async generatePackageJson(packageJson: any, config: ProjectConfig): Promise<void> {
        const packageJsonPath = path.join(config.targetDirectory, 'package.json');
        await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
    }

    private async applyInjections(resolvedConfig: ResolvedConfig, config: ProjectConfig): Promise<void> {
        const injector = new CodeInjector();

        for (const module of resolvedConfig.modules) {
            if (module.injections && module.injections.length > 0) {
                await injector.applyInjections(module.injections, config.targetDirectory);
            }
        }
    }

    private async generateReadme(config: ProjectConfig): Promise<void> {
        const readmePath = path.join(config.targetDirectory, 'README.md');

        let readme = `# ${config.projectName}\n\n`;
        readme += `Generated with [Trix](https://trix.dev)\n\n`;
        readme += `## Getting Started\n\n`;
        readme += `\`\`\`bash\n`;
        readme += `# Install dependencies\n`;
        readme += `${config.packageManager} install\n\n`;
        readme += `# Start development server\n`;
        readme += `${config.packageManager} ${PACKAGE_MANAGER_CONFIGS[config.packageManager].run} dev\n`;
        readme += `\`\`\`\n\n`;

        if (config.projectType === 'frontend') {
            readme += `## Frontend Stack\n\n`;
            const fe = config as FrontendConfig;
            readme += `- Framework: ${fe.framework}\n`;
            readme += `- Styling: ${fe.styling}\n`;
            if (fe.auth !== 'none') readme += `- Auth: ${fe.auth}\n`;
        } else if (config.projectType === 'backend') {
            readme += `## Backend Stack\n\n`;
            const be = config as BackendConfig;
            readme += `- Runtime: ${be.runtime}\n`;
            readme += `- Framework: ${be.framework}\n`;
            if (be.database !== 'none') readme += `- Database: ${be.database}\n`;
            if (be.orm !== 'none') readme += `- ORM: ${be.orm}\n`;
        }

        await fs.writeFile(readmePath, readme);
    }

    private async generateEnvExample(config: ProjectConfig): Promise<void> {
        const envPath = path.join(config.targetDirectory, '.env.example');
        let envContent = '# Environment Variables\n\n';

        if (config.projectType === 'frontend') {
            const fe = config as FrontendConfig;
            if (fe.auth === 'privy') {
                envContent += 'VITE_PRIVY_APP_ID=your_privy_app_id\n';
            } else if (fe.auth === 'clerk') {
                envContent += 'VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key\n';
            }
        } else if (config.projectType === 'backend') {
            const be = config as BackendConfig;
            envContent += 'PORT=3000\n';
            envContent += 'NODE_ENV=development\n\n';

            if (be.database === 'postgresql') {
                envContent += 'DATABASE_URL=postgresql://user:password@localhost:5432/dbname\n';
            } else if (be.database === 'mongodb') {
                envContent += 'MONGODB_URI=mongodb://localhost:27017/dbname\n';
            }

            if (be.auth === 'jwt') {
                envContent += 'JWT_SECRET=your_jwt_secret_here\n';
            }
        }

        await fs.writeFile(envPath, envContent);
    }

    private registerHelpers(): void {
        this.handlebars.registerHelper('eq', (a, b) => a === b);
        this.handlebars.registerHelper('ne', (a, b) => a !== b);
        this.handlebars.registerHelper('gt', (a, b) => a > b);
        this.handlebars.registerHelper('lt', (a, b) => a < b);
        this.handlebars.registerHelper('gte', (a, b) => a >= b);
        this.handlebars.registerHelper('lte', (a, b) => a <= b);

        this.handlebars.registerHelper('and', (...args) => {
            return args.slice(0, -1).every(Boolean);
        });

        this.handlebars.registerHelper('or', (...args) => {
            return args.slice(0, -1).some(Boolean);
        });

        this.handlebars.registerHelper('not', (value) => !value);

        this.handlebars.registerHelper('includes', (array, value) => {
            return Array.isArray(array) && array.includes(value);
        });

        this.handlebars.registerHelper('length', (array) => {
            return Array.isArray(array) ? array.length : 0;
        });

        this.handlebars.registerHelper('uppercase', (str) => {
            return typeof str === 'string' ? str.toUpperCase() : str;
        });

        this.handlebars.registerHelper('lowercase', (str) => {
            return typeof str === 'string' ? str.toLowerCase() : str;
        });

        this.handlebars.registerHelper('capitalize', (str) => {
            if (typeof str !== 'string') return str;
            return str.charAt(0).toUpperCase() + str.slice(1);
        });

        this.handlebars.registerHelper('kebabCase', (str) => {
            if (typeof str !== 'string') return str;
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        });

        this.handlebars.registerHelper('camelCase', (str) => {
            if (typeof str !== 'string') return str;
            return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        });

        this.handlebars.registerHelper('ifCond', function (this: any, v1, operator, v2, options) {
            switch (operator) {
                case '==': return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=': return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==': return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<': return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=': return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>': return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=': return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&': return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||': return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default: return options.inverse(this);
            }
        });
    }
}