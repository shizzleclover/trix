import { TrixCLI } from './core/cli.js';
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = fs.readJSONSync(path.join(__dirname, '../package.json'));

const program = new Command();

program
  .name('create-trix')
  .description('Universal project scaffolding CLI for frontend and backend applications')
  .version(packageJson.version)
  .argument('[project-name]', 'Name of the project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('-t, --type <type>', 'Project type: frontend, backend, mobile')
  .option('--dry-run', 'Show what would be created without creating files')
  .action((projectName, options) => {
    const cli = new TrixCLI();
    const args = projectName ? [projectName] : [];
    cli.run(args, options).catch((error) => {
      console.error(error);
      process.exit(1);
    });
  });

program.parse(process.argv);
