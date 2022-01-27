const fs = require('fs');
const targetPath = 'dist/sentry-config.json';

const sentryData = `{
  "SENTRY_DSN": "${process.env.SENTRY_DSN}"
}`;

function writeFileUsingFS(targetPath, content) {
  fs.writeFile(targetPath, content, function (err) {
    if (err) {
      console.log(err);
    }

    if (content == null) {
      console.log(`Empty content`);
    }
  });
}

writeFileUsingFS(targetPath, sentryData);
