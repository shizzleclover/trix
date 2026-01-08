import { TrixCLI } from './core/cli.js';

const cli = new TrixCLI();
const args = process.argv.slice(2);

cli.run(args).catch((error) => {
  console.error(error);
  process.exit(1);
});