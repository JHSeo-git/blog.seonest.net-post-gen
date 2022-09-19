import chalk from 'chalk';
import { Command } from 'commander';

import type { FrontMatter } from './promts.js';
import { getPromptThumbnail } from './promts.js';
import { getPromptCategory, getPromptDescription, getPromptTitle } from './promts.js';
// import packageJson from '../package.json';

const TARGET_DIR = '__post';

const program = new Command();

program.version('0.0.1');
program.name(chalk.cyan('seonest-post-gen'));
// program.version(packageJson.version);
// program.name(chalk.cyan(packageJson.name));

program.option('-y', 'initialize using default configuration');
program.parse();

async function gen() {
  const date = new Date().toISOString();

  const category = await getPromptCategory(TARGET_DIR);
  const title = await getPromptTitle(TARGET_DIR, category);
  const description = await getPromptDescription();
  const thumbnail = await getPromptThumbnail();

  const frontMatter: FrontMatter = {
    date,

    category,
    title,
    description,
    draft: false,
    tags: undefined,
    thumbnail,
  };

  console.log(frontMatter);
}

gen();
