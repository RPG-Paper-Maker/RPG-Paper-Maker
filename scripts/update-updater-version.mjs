import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const args = process.argv.slice(2);
const version = args.find((a) => !a.startsWith('--'));

if (!version) {
	console.error('❌ Usage: node update-updater-version.mjs <version>');
	process.exit(1);
}

const versionFile = 'updater/version';
writeFileSync(versionFile, `updater/${version}`);
console.log(`✅ Updated ${versionFile} with: ${version}`);

execSync(`git add ${versionFile}`, { stdio: 'inherit' });
execSync(`git commit -m "Update updater version to ${version}"`, { stdio: 'inherit' });
execSync('git push', { stdio: 'inherit' });
console.log(`🚀 Updater version ${version} committed and pushed to develop`);

execSync('git checkout master', { stdio: 'inherit' });
execSync('git pull origin develop', { stdio: 'inherit' });
execSync('git push', { stdio: 'inherit' });
console.log(`🚀 master updated with develop`);
execSync('git checkout develop', { stdio: 'inherit' });
