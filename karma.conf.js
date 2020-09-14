// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: [
      'jasmine',
      // '@angular-devkit/build-angular',
      'karma-typescript'
    ],
    // plugins: [
    //   require('karma-jasmine'),
    //   require('karma-chrome-launcher'),
    //   require('karma-jasmine-html-reporter'),
    //   require('karma-coverage-istanbul-reporter'),
    //   require('@angular-devkit/build-angular'),
    // ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: 'test/didRegistry/*.spec.ts', watch: true }
    ],
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/ewUIBoilerPlate'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    karmaTypescriptConfig: {
      compilerOptions: {
        target: 'ES2015'
      },
      files: [
        'test/didRegistry/*.spec.ts'
      ],
      exclude: ["node_modules"]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
