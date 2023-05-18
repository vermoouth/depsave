#!/usr/bin/env node

const cli = require('commander');

const { depsave } = require('../lib/index');
const package = require('../package.json');


function collect(val, memo) {
  memo = memo === undefined ? [] : memo

  memo.push(val);
  return memo;
}


cli
  .name(package.name)
  .description(package.description)
  .version(package.version.toString(), '-v, --version')
  .option('-d, --directory [path/to/directory]', 'custom directory for downloaded dependencies (default: depsave-<epoch_time>)')
  .option('-f, --file [path/to/package.json]', 'package.json file to fetch dependencies from', collect)
  .option('-c, --concurrent [int]', 'maximum amount of concurrent downloads', 20)
  .arguments('[package-names...]')
  .action((packages) => {
    if (packages.length && cli.file.length) {
      console.warn('Usage of package names and package.json file simultaneously is not recommended yet')
    };
    depsave(
      packages,
      cli.file,
      {
        directory: cli.directory,
        concurrent: cli.concurrent
      }
    );
  })
  .parse(process.argv);
