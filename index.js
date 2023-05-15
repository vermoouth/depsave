const child_process = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const fetch = require('node-fetch');

const utils = require('./utils');


// function updatePackageLock()

const getDependecyURLs = function (packageName) {
	const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'depsave-'));
	fs.writeFileSync(path.join(tempDir, 'package.json'), '{"private": true}');
	console.log(tempDir);
	install = child_process.execFileSync(
		'npm',
		[
			'install', 
			'--package-lock-only', 
			'--quiet', 
			'--no-audit',
			...packageName
		],
		{
			cwd: tempDir, shell: true, stdio: 'inherit'
		}
	);

	const tempLock = require(path.join(tempDir, 'package-lock'));
	urls = Object.values(tempLock.dependencies).map(dep => dep.resolved);
	utils.rmdirRecursiveSync(tempDir);

	return urls;
};

console.log(getDependecyURLs('node-fetch@2 @vue/cli'));