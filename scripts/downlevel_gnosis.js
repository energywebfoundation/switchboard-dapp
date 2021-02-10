const fs = require('fs');
const { exec } = require('child_process');

console.log('__dirname', __dirname);

const pathToModules = `${__dirname}/../node_modules`;
const pathToIamModules = `${__dirname}/../node_modules/iam-client-lib/node_modules/`;
const pathToDownDts = `${__dirname}/../node_modules/.bin/downlevel-dts`;
console.log('path to dts:', pathToDownDts);

if (fs.existsSync(`${pathToModules}/@gnosis.pm`)) {
  exec(`cd ${pathToModules} && node ${pathToDownDts} @gnosis.pm @gnosis.pm`,
    (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    }
  );
}

if (fs.existsSync(`${pathToIamModules}/@gnosis.pm`)) {
  exec(`cd ${pathToIamModules} && node ${pathToDownDts} @gnosis.pm @gnosis.pm`,
    (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }
    }
  );
}
