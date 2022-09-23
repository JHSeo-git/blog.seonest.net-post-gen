import esbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import shebang from 'rollup-plugin-preserve-shebang';

const name = require('./package.json').main.replace(/\.mjs$/, '');

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
