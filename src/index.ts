import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';

import packageJson from '../package.json';
import questions from './questions.js';
import type { MDXFrontMatter } from './types.js';

const program = new Command();

program.version(packageJson.version);
program.name(chalk.cyan(packageJson.name));

program.option('-y', 'initialize using default configuration');

program.parse();

inquirer
  .prompt(questions)
  .then((answers) => {
    console.log(answers);
  })
  .catch((err) => console.error(err));
