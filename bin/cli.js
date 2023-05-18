#!/usr/bin/env node

const cli = require('commander');
const index = require('../lib/index');

const package = require('../package.json');


cli
  .name(package.name)
  .version(package.version.toString(), '-v, --version')
  .option('-d, --directory [directory]', 'custom directory for downloaded dependencies')
  .option('-c, --concurrent [max-concurrent]', 'maximum amount of concurrent downloads')
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
