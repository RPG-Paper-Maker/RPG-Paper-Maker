import fs from 'fs';
import path from 'path';

const [, , version, ...commits] = process.argv;

if (!version) {
	console.error('Error: Missing version argument.');
	console.error('Usage: node generate-changelog.mjs <version> <commit1> <commit2> ...');
	process.exit(1);
}

if (!commits.length) {
	console.error('Error: No commit messages provided.');
	process.exit(1);
}

const features = [];
const fixes = [];
const others = [];
for (const msg of commits) {
	const lower = msg.toLowerCase();
	if (lower.startsWith('add')) {
		features.push(msg);
	} else if (lower.startsWith('fix') || lower.startsWith('try fix')) {
		fixes.push(msg);
	} else {
		others.push(msg);
	}
}

let md = `## ${version}\n\n`;

if (features.length) {
	md += `### Features\n`;
	md += features.map((c) => `- ${c}`).join('\n') + '\n\n';
}

if (fixes.length) {
	md += `### Fixes\n`;
	md += fixes.map((c) => `- ${c}`).join('\n') + '\n\n';
}

if (others.length) {
	md += `### Other Changes\n`;
	md += others.map((c) => `- ${c}`).join('\n') + '\n\n';
}

const changelogDir = path.resolve('changelogs');
if (!fs.existsSync(changelogDir)) {
	fs.mkdirSync(changelogDir);
}

const filePath = path.join(changelogDir, `${version}.md`);
fs.writeFileSync(filePath, md, 'utf8');

console.log(`Changelog written to ${filePath}`);

try {
	execSync(`git add ${filePath}`, { stdio: 'inherit' });
	execSync(`git commit -m "Add changelog for ${version}"`, { stdio: 'inherit' });
	execSync(`git push`, { stdio: 'inherit' });

	console.log('Changelog committed and pushed.');
} catch (err) {
	console.error('Git error:', err);
	process.exit(1);
}
