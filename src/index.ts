import { log } from 'node:console';

import chalk from 'chalk';
import { Command } from 'commander';

import packageJson from '../package.json' assert { type: 'json' };
import type { FrontMatter } from './prompts.js';
import { getPromptThumbnail } from './prompts.js';
import { getPromptCategory, getPromptDescription, getPromptTitle } from './prompts.js';

const TARGET_DIR = '__post';

const program = new Command();

program.version(packageJson.version);
program.name(chalk.cyan(packageJson.name));

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

  log(frontMatter);
}

gen();

export { type FrontMatter };
