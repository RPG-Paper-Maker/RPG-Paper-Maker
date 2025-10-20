import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const version = process.argv[2];

if (!version) {
	console.error('❌ Usage: node update-version.mjs <version>');
	process.exit(1);
}

const versionFile = 'public/version';
const versionsJsonFile = 'versions/versions.json';

// Step 1: Update public/version
writeFileSync(versionFile, version);
console.log(`✅ Updated ${versionFile} with: ${version}`);

// Step 2: Update versions/versions.json
let versionsData = JSON.parse(readFileSync(versionsJsonFile, 'utf-8'));

if (!versionsData.versions.includes(version)) {
	versionsData.versions.push(version);
}

writeFileSync(versionsJsonFile, JSON.stringify(versionsData, null, 4));
console.log(`✅ Updated ${versionsJsonFile} with lastVersion and versions array`);

// Step 3: Git commit and push
execSync(`git add ${versionFile} ${versionsJsonFile}`, { stdio: 'inherit' });
execSync(`git commit -m "Update version to ${version}"`, { stdio: 'inherit' });
execSync('git push', { stdio: 'inherit' });
console.log(`🚀 Version ${version} committed and pushed`);
