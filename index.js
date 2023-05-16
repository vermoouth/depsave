const child_process = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const fetch = require('node-fetch');

const utils = require('./utils');


const getDependecyURLs = function (packageNames) {
	console.info(`Using temporary project to fetch links for ${packageNames.join(', ')} dependencies`);
	console.debug('Creating temporary project');
	const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'depsave-'));

	console.debug(`Operating in ${tempDir}`);
	fs.writeFileSync(path.join(tempDir, 'package.json'), '{"private": true}');

	console.debug('Creating lock file for temporary project');
	install = child_process.execFileSync(
		'npm',
		[
			'install',
			'--package-lock-only',
			'--quiet',
			'--no-audit',
			...packageNames
		],
		{
			cwd: tempDir,
			shell: true,
			stdio: 'inherit'
		}
	);

	console.debug(`Fetching dependencies' urls for ${packageNames.join(', ')}`);
	const tempLock = require(path.join(tempDir, 'package-lock'));
	urls = Object.values(tempLock.dependencies).map(dep => dep.resolved);

	console.debug(`Removing temporafy directory ${tempDir}`);
	utils.rmdirRecursiveSync(tempDir);

	return urls;
};


const batchDownload = async function (urls, downloadDir) {
	// TODO: create directory
	urls.forEach(function (url, i) {
		console.debug(`Fetching [ ${i + 1} / ${urls.length} ] - ${path.basename(url, path.extname(url))}`);
		downloadFile(url, downloadDir);
	})
};


const downloadFile = async function (url, downloadDir) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
	response.body.pipe(fs.createWriteStream(path.join(downloadDir, path.basename(url))));
};

console.log(getDependecyURLs(['node-fetch@2', 'yaml']));
// batchDownload(getDependecyURLs(['@vue/cli-service']), '../downloads');
