const child_process = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const fetch = require('node-fetch');
const http = require('http');
const https = require('https');
const asyncPool = require('tiny-async-pool')

const utils = require('./utils');


const defaultDownloadOptions = {
  directory: null,
  concurrent: 20
};

const resolveDownloadOptions = function (downloadOptions) {
  let resolvedOptions = defaultDownloadOptions;

  for (const key in downloadOptions) {
    if (key !== null) {
      resolvedOptions[key] = downloadOptions[key]
    };
  }

  return resolvedOptions;
};

const depsave = function (packageNames, packageJSONs, downloadOptions) {
  downloadOptions = resolveDownloadOptions(downloadOptions);
  batchDownload(getDependecyURLs(packageNames), downloadOptions.directory, downloadOptions.concurrent);
};

const agentOptions = {
  keepAlive: true
};

const fetchOptions = {
  agent: function (_parsedURL) {
    if (_parsedURL.protocol === 'http:') {
      return http.Agent(agentOptions);
    } else {
      return https.Agent(agentOptions);
    }
  }
};


const getDependecyURLs = function (packageNames) {
  console.info(`Using temporary project to fetch links for ${
    packageNames.join(', ')} dependencies`);
  console.debug('Creating temporary project');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'depsave-'));

  console.debug(`Operating in ${tempDir}`);
  fs.writeFileSync(path.join(tempDir, 'package.json'), '{"private": true}');

  console.debug('Creating lock file for temporary project');
  npmExecutable = (process.platform === 'win32' ? 'npm.cmd' : 'npm');
  install = child_process.spawnSync(
    npmExecutable,
    [
      'install',
      '--package-lock-only',
      '--quiet',
      '--no-audit',
      '--no-fund',
      ...packageNames
    ],
    {
      cwd: tempDir,
      stdio: 'inherit'
    }
  );

  console.debug(`Fetching dependencies' urls for ${packageNames.join(', ')}`);
  const tempLock = require(path.join(tempDir, 'package-lock'));
  urls = Object.values(tempLock.dependencies).map(dep => dep.resolved);

  console.debug(`Removing temporary directory ${tempDir}`);
  utils.rmdirRecursiveSync(tempDir);

  return urls;
};


const batchDownload = async function (urls, downloadDir, concurrentDownloads) {
  concurrentDownloads = concurrentDownloads === undefined ? 20 : concurrentDownloads
  downloadDir = downloadDir === undefined ? `./depsave-${Date.now()}` : downloadDir

  fs.mkdirSync(downloadDir);

  // FIXME
  index = 0;
  const downloadPromise = url => new Promise(
    resolve => fetch(url, fetchOptions).then(
      res => res.body.pipe(
        fs.createWriteStream(path.join(downloadDir, path.basename(url)))
          .on("close", () => {
            index++;
            console.debug(`[${index}/${urls.length}] Fetched ${
              path.basename(url, path.extname(url))}`);
          })
      )
    ).then(resolve()));

  await asyncPool(concurrentDownloads, urls, downloadPromise);
};

// console.log(getDependecyURLs(['node-fetch@2', 'yaml']));
// batchDownload(getDependecyURLs(['@vue/cli-service']));
// batchDownload(getDependecyURLs(['node-fetch@2']));

module.exports = { depsave }
