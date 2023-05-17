

const cli = require('commander');
const index = require('../lib/index')
 
cli
  .version(require('../package.json').version.toString(), '-v, --version')
  .option('-d --directory [directory]', 'custom directory for downloaded dependencies')
  .option('-c --concurrent [max-concurrent]', 'maximum amount of concurrent downloads')
  .arguments('[package-names...]')
  .action((packages) => {
    index.batchDownload(index.getDependecyURLs(packages), cli.directory, cli.concurrent);
  })
  .parse(process.argv);

// console.log(cli)