import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import fse from 'fs-extra';
import { afterEach, assert, beforeEach, describe, it } from 'vitest';

import * as utils from '../src/utils.js';

describe('utils', async () => {
  describe('ensureDir', () => {
    let TEST_DIR: string;

    beforeEach(async () => {
      TEST_DIR = path.join(os.tmpdir(), 'test-dir', 'fs-extra');
      await fse.emptyDir(TEST_DIR);
    });

    afterEach(async () => {
      await fse.remove(TEST_DIR);
    });

    describe('when directory exists', () => {
      it('should not do anything', async () => {
        // given
        const directory = path.join(TEST_DIR, 'dir/does/not/exist');
        fse.mkdirpSync(directory);

        // when - then
        try {
          await utils.ensureDir(directory);
        } catch (err) {
          assert.ifError(err);
        } finally {
          assert(fs.existsSync(directory));
        }
      });
    });

    describe('when dir does not exist', () => {
      it('should create the dir', async () => {
        // given
        const directory = path.join(TEST_DIR, 'dir/that/does/not/exist');

        // when - then
        try {
          await utils.ensureDir(directory);
        } catch (err) {
          assert.ifError(err);
        } finally {
          assert(fs.existsSync(directory));
        }
      });
    });
  });

  describe('slugify', () => {
    describe('when input is normal letters', () => {
      let input: string;

      beforeEach(() => {
        input = '';
      });

      it('should slugify for cjk + english(with capital) + number', () => {
        // given
        input = '한글韓子ヤマトEnglish123';

        // when
        const output = utils.getSlug(input);

        // then
        assert.equal(output, '한글韓子ヤマトenglish123');
      });

      it('should slugify for space(" ") + dash("-") + underscore("_") + dot(".")', () => {
        // given
        input = '시작 --__.. 끝';

        // when
        const output = utils.getSlug(input);

        // then
        assert.strictEqual(output, '시작-끝');
      });
    });

    describe('when input is already published samples', () => {
      it('should slugify for sample 1', () =>
        assert.strictEqual(
          utils.getSlug('Nextjs Layouts RFC Update'),
          'nextjs-layouts-rfc-update'
        ));
      it('should slugify for sample 2', () =>
        assert.equal(utils.getSlug('Nextjs 12.3'), 'nextjs-12-3'));
      it('should slugify for sample 3', () =>
        assert.equal(
          utils.getSlug('Understanding useMemo and useCallback'),
          'understanding-usememo-and-usecallback'
        ));
      it('should slugify for sample 4', () =>
        assert.equal(utils.getSlug('Remix@1.6.5'), 'remix-1-6-5'));
    });
  });

  describe('getDirectories', () => {
    let TEST_DIR: string;

    beforeEach(async () => {
      TEST_DIR = path.join(os.tmpdir(), 'test-dir', 'posts');
      await fse.emptyDir(TEST_DIR);
    });

    afterEach(async () => {
      await fse.remove(TEST_DIR);
    });

    describe('when category directory exists', () => {
      it('should not do anything', async () => {
        // given
        const directory = path.join(TEST_DIR, 'react');
        fse.mkdirpSync(directory);

        // when - then
        try {
          const categories = await utils.getCategories(TEST_DIR);
          assert.include(categories, 'react');
        } catch (err) {
          assert.ifError(err);
        }
      });
    });

    describe('when category directory not exists', () => {
      it('should not do anything', async () => {
        // given
        const directory = path.join(TEST_DIR, 'not/category');
        fse.mkdirpSync(directory);

        // when - then
        try {
          const categories = await utils.getCategories(TEST_DIR);
          assert.notInclude(categories, 'category');
        } catch (err) {
          assert.ifError(err);
        }
      });
    });
  });

  describe('generateFrontMatter', () => {
    describe('when input empty object', () => {
      it('should generate for empty new line string', () => {
        const input = {};
        const frontMatter = utils.generateFrontMatter(input);

        const output = '\n';
        assert.equal(frontMatter, output);
      });
    });

    describe('when input object with title', () => {
      it('should generate for title', () => {
        const input = {
          title: 'title',
        };
        const frontMatter = utils.generateFrontMatter(input);

        const output = `---\ntitle: title\n---\n\n`;
        assert.equal(frontMatter, output);
      });
    });

    describe('when input object with title', () => {
      it('should generate for date', () => {
        const datetime = new Date('2022-09-21 12:34:56');
        const input = {
          date: datetime.toISOString(),
        };
        const frontMatter = utils.generateFrontMatter(input);

        const output = `---\ndate: '${datetime.toISOString()}'\n---\n\n`;
        assert.equal(frontMatter, output);
      });
    });

    describe('when input object with all data', () => {
      it('should generate for all data', () => {
        const datetime = new Date('2022-09-21 12:34:56');
        const input = {
          date: datetime.toISOString(),
          title: 'title',
          category: 'category',
          description: 'description',
          draft: false,
          thumbnail: 'thumbnail',
        };
        const frontMatter = utils.generateFrontMatter(input);

        const output = `---\ndate: '${datetime.toISOString()}'\ntitle: title\ncategory: category\ndescription: description\ndraft: false\nthumbnail: thumbnail\n---\n\n`;
        assert.equal(frontMatter, output);
      });
    });
  });

  describe('generatePost', () => {
    let TEST_DIR: string;
    let fileName: string;
    let filePath: string;
    let contents: string;

    beforeEach(async () => {
      TEST_DIR = path.join(os.tmpdir(), 'category', 'posts');
      fileName = 'test.mdx';
      filePath = `${TEST_DIR}/${fileName}`;
      contents = '# h1 ## h2';

      await fse.emptyDir(TEST_DIR);
    });

    afterEach(async () => {
      await fse.remove(TEST_DIR);
    });

    describe('success generate for post', () => {
      it('should generate post', () => {
        assert(utils.generatePost(filePath, contents));
        assert(fse.pathExistsSync(filePath));
      });
    });

    describe('failure generate for post', () => {
      it('should not generate post if filepath includes special char', () => {
        filePath = '!@#...\\// ;;""';

        assert(!utils.generatePost(filePath, contents));
        assert(!fse.pathExistsSync(filePath));
      });
    });
  });

  // TODO: inquirer
  // getPromptTitle
  // getPromptDescription
  // getPromptCategory
  // getPromptThumbnail
});
