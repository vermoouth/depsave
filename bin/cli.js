#!/usr/bin/env node

const cli = require('commander');
const index = require('../lib/index');

const package = require('../package.json');


cli
  .name(package.name)
  .version(package.version.toString(), '-v, --version')
  .option('-d, --directory [path/to/directory]', 'custom directory for downloaded dependencies (default: depsave-<epoch_time>)')
  .option('-c, --concurrent [int]', 'maximum amount of concurrent downloads', 20)
  .arguments('[package-names...]')
  .action((packages) => {
    index.depsave(
      packages,
      [],
      {
        directory: cli.directory,
        concurrent: cli.concurrent
      }
    );
  })
  .parse(process.argv);
