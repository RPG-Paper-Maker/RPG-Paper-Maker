/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { JSONType, Paths } from '../common';
import { readPublicFile } from '../common/Platform';

export const LANGUAGES_NAMES: string[] = [];
export const LANGUAGES_SHORTS: string[] = [];

i18next
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {},
		fallbackLng: 'en',
		interpolation: {
			escapeValue: false,
		},
	})
	.catch(console.error);

export const loadLocales = async () => {
	const content = JSON.parse(await readPublicFile(Paths.join(Paths.LOCALES, Paths.FILE_LOCALES))) as JSONType;
	const names = content.names as string[];
	const shorts = content.shorts as string[];
	for (let i = 0, l = names.length; i < l; i++) {
		const name = names[i];
		const short = shorts[i];
		LANGUAGES_NAMES.push(name);
		LANGUAGES_SHORTS.push(short);
		const json = JSON.parse(await readPublicFile(Paths.join(Paths.LOCALES, `${short}.json`)));
		i18next.addResourceBundle(short, 'translation', json);
	}
};

export default i18next;
