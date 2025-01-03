import json from '@rollup/plugin-json';
import esbuild from 'rollup-plugin-esbuild';
import shebang from 'rollup-plugin-preserve-shebang';

import packageJson from './package.json' with { type: 'json' };

const name = packageJson.main.replace(/\.mjs$/, '');

const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [
      esbuild({
        jsx: 'automatic',
      }),
      json(),
      shebang(),
    ],
    output: [
      // {
      //   file: `${name}.cjs`,
      //   format: 'cjs',
      //   sourcemap: true,
      // },
      {
        file: `${name}.mjs`,
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
];
