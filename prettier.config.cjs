/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: 'lf',
  tabWidth: 2,
  trailingComma: 'es5',
  singleQuote: false,
  semi: false,
  printWidth: 100,
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-packagejson'],
  importOrder: [
    '^(node:/(.*)$)|^(node:$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^types$',
    '^@/types/(.*)$',
    '',
    '^[./]',
  ],
  importOrderTypeScriptVersion: '5.0.0',
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
};
