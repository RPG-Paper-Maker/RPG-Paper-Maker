import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const localesFolder = 'public/Locales';
const localesJsonFile = 'scripts/locales.json';

const template = JSON.parse(readFileSync(localesJsonFile, 'utf-8'));
for (const lang of Object.keys(template)) {
	const targetFile = path.join(localesFolder, `${lang}.json`);
	let existing = {};
	if (existsSync(targetFile)) {
		existing = JSON.parse(readFileSync(targetFile, 'utf-8'));
	}
	const additions = template[lang];
	const merged = {
		...existing,
		...additions,
	};
	writeFileSync(targetFile, JSON.stringify(merged, null, '\t'));
	console.log(`Updated ${targetFile}`);
}
writeFileSync(localesJsonFile, JSON.stringify({}));

execSync(`git add public/Locales/*`, { stdio: 'inherit' });
execSync(`git commit -m "Update locales"`, { stdio: 'inherit' });
execSync('git push', { stdio: 'inherit' });
console.log(`🚀 Locales committed and pushed`);
