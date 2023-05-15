const child_process = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const fetch = require('node-fetch');

const utils = require('./utils');


const getDependecyURLs = function (packageNames) {
	console.log('Creating temporary project');
	const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'depsave-'));

	console.log(`Operating in ${tempDir}`);
	fs.writeFileSync(path.join(tempDir, 'package.json'), '{"private": true}');

	console.log('Creating lock file for temporary project');
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
			cwd: tempDir, shell: true, stdio: 'inherit'
		}
	);

	console.log(`Fetching dependencies' urls for ${packageNames.join(', ')}`)
	const tempLock = require(path.join(tempDir, 'package-lock'));
	urls = Object.values(tempLock.dependencies).map(dep => dep.resolved);

	console.log(`Removing temporafy directory ${tempDir}`)
	utils.rmdirRecursiveSync(tempDir);

	return urls;
};

console.log(getDependecyURLs(['node-fetch@2', 'yaml']));