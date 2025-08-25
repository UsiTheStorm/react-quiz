/** @type {import("prettier").Config} */
const config = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  jsxClosingBracketSameLine: false,
  proseWrap: 'always',
  embeddedLanguageFormatting: 'auto',
  overrides: [
    {
      files: ['*.html', 'legacy/**/*.html'],
      options: {
        tabWidth: 2,
      },
    },
  ],
};

export default config;
