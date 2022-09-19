import { error, log } from 'node:console';

import chalk from 'chalk';
import { Command } from 'commander';

import packageJson from '../package.json' assert { type: 'json' };
import type { FrontMatter } from './utils.js';
import { generatePost, getSlug } from './utils.js';
import {
  ensureDir,
  generateFrontMatter,
  getPromptCategory,
  getPromptDescription,
  getPromptThumbnail,
  getPromptTitle,
} from './utils.js';

const TARGET_DIR = '__post';

const program = new Command();

program.version(packageJson.version);
program.name(chalk.cyan(packageJson.name));

program.option('-d | --directory', 'choose a post directory');
program.parse();

async function generator() {
  const date = new Date().toISOString();

  const { directory } = await program.opts();

  let targetDir = TARGET_DIR;

  if (directory) {
    if (typeof directory !== 'string') {
      error('-d | --directory option must be string');
      process.exit(-1);
    }
    targetDir = directory;
  }

  const category = await getPromptCategory(targetDir);
  const title = await getPromptTitle(targetDir, category);
  const description = await getPromptDescription();
  const thumbnail = await getPromptThumbnail();

  const frontMatter: FrontMatter = {
    date,

    category,
    title,
    description,
    draft: false,
    ...(thumbnail ? { thumbnail } : {}),
    // ...(tags ? { tags } : {}),
  };

  const contents = generateFrontMatter(frontMatter);

  const fileName = getSlug(title);
  const fileDir = `${targetDir}/${category}`;

  ensureDir(fileDir);

  const filePath = `${fileDir}/${fileName}.mdx`;

  const result = generatePost(filePath, contents);
  if (!result) {
    error('Unknown Error: Cannot write file!');
    process.exit(-1);
  }

  log(`\n\n${contents}\n✅ ${chalk.green('Success to generate new post!')} ${filePath}\n\n`);
}

generator();

export { type FrontMatter };
