import { error, log } from "node:console"
import chalk from "chalk"
import { Command } from "commander"

import packageJson from "../package.json"
import {
  ensureDir,
  generateFrontMatter,
  generatePost,
  getPromptCategory,
  getPromptDescription,
  getPromptThumbnail,
  getPromptTitle,
  getPromptUseAssetDir,
  getSlug,
  type FrontMatter,
} from "./utils.js"

const TARGET_DIR = "__post"
const PUBLIC_DIR = "public/post"

const program = new Command()

program.version(packageJson.version)
program.name(chalk.cyan(packageJson.name))

program.option("-d, --directory <path>", "choose a post directory")
program.option("-a, --asset-directory <path>", "choose a asset directory")
program.parse()

async function generator() {
  const date = new Date().toISOString()

  const { directory, assetDirectory } = await program.opts()

  let targetDir = TARGET_DIR
  let publicDir = PUBLIC_DIR

  if (directory) {
    if (typeof directory !== "string") {
      error("-d | --directory option must be string")
      process.exit(-1)
    }
    targetDir = directory
  }

  if (assetDirectory) {
    if (typeof assetDirectory !== "string") {
      error("-a | --asset-directory option must be string")
      process.exit(-1)
    }
    publicDir = assetDirectory
  }

  const category = await getPromptCategory(targetDir)
  const title = await getPromptTitle(targetDir, category)
  const description = await getPromptDescription()
  const useAssetDir = await getPromptUseAssetDir()
  const thumbnail = await getPromptThumbnail()

  const frontMatter: FrontMatter = {
    date,
    category,
    title,
    description,
    // ...(tags ? { tags } : {}),
    ...(thumbnail && { thumbnail }),
    draft: false,
  }

  const contents = generateFrontMatter(frontMatter)

  const fileName = getSlug(title)
  const fileDir = `${targetDir}/${category}`

  await ensureDir(fileDir)

  const filePath = `${fileDir}/${fileName}.mdx`

  if (useAssetDir) {
    const assetDir = `${publicDir}/${category}/${fileName}`
    await ensureDir(assetDir)
  }

  const result = generatePost(filePath, contents)
  if (!result) {
    error("Unknown Error: Cannot write file!")
    process.exit(-1)
  }

  log(`\n\n${contents}\n✅ ${chalk.green("Success to generate new post!")} ${filePath}\n\n`)
}

export { generator }
