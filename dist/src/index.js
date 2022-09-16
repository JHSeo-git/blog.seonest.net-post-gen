import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import questions from './questions.js';
const program = new Command();
program.version('0.0.1');
program.name(chalk.cyan('seonest-post-gen'));
program.option('-y', 'initialize using default configuration');
program.parse();
inquirer
    .prompt(questions)
    .then((answers) => {
    console.log(answers);
})
    .catch((err) => console.error(err));
