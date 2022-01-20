module.exports = {
  ...require('@energyweb/prettier-config'),
  bracketSameLine: true,
  // Other options...
  overrides: [
    {
      // change .html with .vue if you are using Vue files instead of HTML
      files: 'src/**/*.html',
      options: {
        printWidth: 120,
      },
    },
  ],
};
