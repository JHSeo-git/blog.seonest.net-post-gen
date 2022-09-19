import { error, log } from 'node:console';
import path from 'node:path';

import chalk from 'chalk';
import slugify from 'cjk-slug';
import fs from 'fs-extra';
import matter from 'gray-matter';
import inquirer from 'inquirer';

const __dirname = process.cwd();

// title
// description
// date
// category
// draft
// tags
// thumbnail
export type FrontMatter = {
  title: string;
  description: string;
  date: string;
  category: string;
  draft: boolean;
  tags?: string;
  thumbnail?: string;
};

export const ensureDir = (fileDir: string) => fs.ensureDirSync(fileDir);

export const getSlug = (name: string) => slugify(name);

export const getPromptTitle = async (targetDir: string, category: string) => {
  const { title } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Please input your title',
      default: () => 'New post title',
      validate: async (val) => {
        if (typeof val !== 'string') {
          return 'Title must be string';
        }

        if (val.includes("'")) {
          return 'Cannot use single quote';
        }

        const slug = getSlug(val);
        const dest = `${targetDir}/${category}/${slug}.md`;
        const destFileExists = fs.existsSync(dest);

        if (destFileExists) {
          return `Already exist file name: ${slug}.md.`;
        }

        return true;
      },
    },
  ]);

  return title as string;
};

export const getPromptDescription = async () => {
  const { description } = await inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: 'Please input your description',
      default: () => 'New post description',
      validate: async (val) => {
        if (typeof val !== 'string') {
          return 'Description must be string';
        }

        if (val.includes("'")) {
          return 'Cannot use single quote';
        }
        return true;
      },
    },
  ]);

  return description as string;
};

export const getPromptCategory = async (targetDir: string) => {
  let category: string;
  const newCategoryOption = '[CREATE NEW CATEGORY]';
  const categories = await getCategories(targetDir);
  const choices = [...categories, new inquirer.Separator(), newCategoryOption];

  const { selectedCategory } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedCategory',
      message: 'Please select category',
      choices,
    },
  ]);

  if (selectedCategory === newCategoryOption) {
    const { newCategory } = await inquirer.prompt([
      {
        type: 'input',
        name: 'newCategory',
        message: 'Please input new category',
        validate: (val) => {
          if (typeof val !== 'string') {
            return 'Category must be string';
          }

          if (val.includes("'")) {
            return 'Cannot use single quote';
          }

          if (categories.includes(val)) {
            return `Already exists category: ${val}`;
          }

          return true;
        },
      },
    ]);

    category = newCategory;
  } else {
    category = selectedCategory;
  }

  return category;
};

export const getPromptThumbnail = async () => {
  const { thumbnail } = await inquirer.prompt([
    {
      type: 'input',
      name: 'thumbnail',
      message: 'Please input your thumbnail',
      validate: async (val) => {
        if (val.includes("'")) {
          return 'Cannot use single quote';
        }
        return true;
      },
    },
  ]);

  return thumbnail as string | undefined;
};

// TODO: tags

export const generateFrontMatter = (contents: object) => matter.stringify('', contents);

export const generatePost = (filePath: string, contents: string) => {
  try {
    fs.writeFileSync(filePath, contents);

    return true;
  } catch (err) {
    error(`${chalk.red('Unknown Error: Cannot write file!')}\n\n${JSON.stringify(err, null, 2)}`);
    return false;
  }
};

const getCategories = async (targetDir: string) => {
  const dirPath = path.resolve(__dirname, targetDir);
  const dirs = fs.readdirSync(dirPath);

  return dirs;
};
