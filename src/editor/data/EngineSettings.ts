/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, Constants, JSONType, LOCAL_FORAGE, Paths } from '../common';
import { BindingType, Serializable } from '../core/Serializable';
import { Keyboard, ProjectPreview } from '../models';

class EngineSettings extends Serializable {
	public static current: EngineSettings;

	public lastEngineVersion!: string | null;
	public recentProjects!: ProjectPreview[];
	public currentLanguage!: string;
	public showTipsGridHeight!: boolean;
	public keyboardControls!: Keyboard[];
	public backupsActivated!: boolean;
	public backupsInterval!: number;
	public backupsMax!: number;
	public theme!: number;
	public updaterType!: number;
	public getUnstableVersions!: boolean;

	public static readonly bindings: BindingType[] = [
		['lastEngineVersion', 'lev', null, BINDING.STRING],
		['recentProjects', 'rp', [], BINDING.LIST, ProjectPreview],
		['currentLanguage', 'cl', undefined, BINDING.STRING],
		['showTipsGridHeight', 'stgh', true, BINDING.BOOLEAN],
		['keyboardControls', 'kc', [], BINDING.LIST, Keyboard],
		['backupsActivated', 'ba', true, BINDING.BOOLEAN],
		['backupsInterval', 'bi', 60, BINDING.NUMBER],
		['backupsMax', 'bm', 5, BINDING.NUMBER],
		['theme', 't', 0, BINDING.NUMBER],
		['updaterType', 'ut', 0, BINDING.NUMBER],
		['getUnstableVersions', 'guv', false, BINDING.BOOLEAN],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...EngineSettings.bindings, ...additionnalBinding];
	}

	applyDefault() {
		this.keyboardControls = [
			Keyboard.createKeyboard(1, 'move.cursor.up', 'CursorUp', [['ArrowUp'], ['w']]),
			Keyboard.createKeyboard(2, 'move.cursor.down', 'CursorDown', [['ArrowDown'], ['s']]),
			Keyboard.createKeyboard(3, 'move.cursor.left', 'CursorLeft', [['ArrowLeft'], ['a']]),
			Keyboard.createKeyboard(4, 'move.cursor.right', 'CursorRight', [['ArrowRight'], ['d']]),
		];
	}

	async applyKeyboardLayout() {
		const [up, down, left, right] = await detectMovementKeys();
		this.keyboardControls[0].shortcuts = [['ArrowUp'], [up]];
		this.keyboardControls[1].shortcuts = [['ArrowDown'], [down]];
		this.keyboardControls[2].shortcuts = [['ArrowLeft'], [left]];
		this.keyboardControls[3].shortcuts = [['ArrowRight'], [right]];
	}

	getPath(): string {
		return Paths.join(Constants.IS_DESKTOP ? Paths.DIST : LOCAL_FORAGE.ENGINE, Paths.FILE_ENGINE_SETTINGS);
	}

	getKeyboardCursorUp(): Keyboard {
		return this.keyboardControls[0];
	}

	getKeyboardCursorDown(): Keyboard {
		return this.keyboardControls[1];
	}

	getKeyboardCursorLeft(): Keyboard {
		return this.keyboardControls[2];
	}

	getKeyboardCursorRight(): Keyboard {
		return this.keyboardControls[3];
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, EngineSettings.getBindings(additionnalBinding));
		for (const keyboard of this.keyboardControls) {
			keyboard.isEngine = true;
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, EngineSettings.getBindings(additionnalBinding));
	}
}

// AZERTY locales: France, Belgium, Luxembourg, Monaco, Belgian Dutch
const AZERTY_LOCALES = ['fr-FR', 'fr-BE', 'fr-LU', 'fr-MC', 'nl-BE'];

export async function detectMovementKeys(): Promise<[string, string, string, string]> {
	const keyboard = (navigator as Navigator & { keyboard?: { getLayoutMap(): Promise<Map<string, string>> } }).keyboard;
	if (keyboard) {
		try {
			const map = await keyboard.getLayoutMap();
			return [
				(map.get('KeyW') ?? 'w').toLowerCase(),
				(map.get('KeyS') ?? 's').toLowerCase(),
				(map.get('KeyA') ?? 'a').toLowerCase(),
				(map.get('KeyD') ?? 'd').toLowerCase(),
			];
		} catch {
			// getLayoutMap failed, fall through to locale detection
		}
	}
	if (AZERTY_LOCALES.some((l) => (navigator.language ?? '').startsWith(l))) {
		return ['z', 's', 'q', 'd'];
	}
	return ['w', 's', 'a', 'd'];
}

export { EngineSettings };
