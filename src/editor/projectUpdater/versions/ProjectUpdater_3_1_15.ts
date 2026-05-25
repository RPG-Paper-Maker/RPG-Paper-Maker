/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths } from '../../common';
import { readJSON, writeJSON } from '../../common/Platform';
import { Project } from '../../core/Project';

const FILE_LANGS = 'langs.json';

// Matches locales.json shorts order: index 0 = kind 1 (en), index 1 = kind 2 (fr), …
const SKIP_BY_LOCALE: Record<string, string> = {
	en: 'Skip',
	fr: 'Passer',
	de: 'Überspringen',
	br: 'Pular',
	es: 'Omitir',
	it: 'Salta',
	pl: 'Pomiń',
	ru: 'Пропустить',
	uk: 'Пропустити',
	jp: 'スキップ',
	cn: '跳过',
	ko: '건너뛰기',
};

const LOCALE_SHORTS = ['en', 'fr', 'de', 'br', 'es', 'it', 'pl', 'ru', 'uk', 'jp', 'cn', 'ko'];

class ProjectUpdater_3_1_15 {
	static async update() {
		const langsPath = Paths.join(Project.current!.getPath(), FILE_LANGS);
		const json = await readJSON(langsPath);
		if (!json || json.si) {
			return;
		}
		const langs = (json.langs as { id: number; kind?: number }[]) ?? [];
		const names: Record<string, string> = {};
		for (const lang of langs) {
			const short = lang.kind && lang.kind > 0 ? LOCALE_SHORTS[lang.kind - 1] : null;
			names[String(lang.id)] = (short && SKIP_BY_LOCALE[short]) || SKIP_BY_LOCALE['en'];
		}
		json.si = { names };
		await writeJSON(langsPath, json);
	}
}

export { ProjectUpdater_3_1_15 };
