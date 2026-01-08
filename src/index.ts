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
  .action((projectName) => {
    const cli = new TrixCLI();
    const args = projectName ? [projectName] : [];
    cli.run(args).catch((error) => {
      console.error(error);
      process.exit(1);
    });
  });

program.parse(process.argv);
