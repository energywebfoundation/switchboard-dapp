module.exports = {
  extends: [
    '@energyweb',
    'plugin:@angular-eslint/recommended',
    'plugin:@angular-eslint/template/process-inline-templates',
  ],
  env: {
    browser: true,
    es2021: true,
    jasmine: true,
  },
  overrides: [
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
    },
    {
      files: ['*.spec.ts'],
      rules: {
        "@typescript-eslint/no-explicit-any": "off"
      }
    },
    {
      files: ['**/tests/**/*.ts'],
      rules: {
        "@typescript-eslint/no-explicit-any": "off"
      }
    },
  ],
};
