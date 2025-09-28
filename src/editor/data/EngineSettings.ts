/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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

	public recentProjects!: ProjectPreview[];
	public currentLanguage!: string;
	public showTipsGridHeight!: boolean;
	public keyboardControls!: Keyboard[];
	public backupsActivated!: boolean;
	public backupsInterval!: number;
	public backupsMax!: number;

	public static readonly bindings: BindingType[] = [
		['recentProjects', 'rp', [], BINDING.LIST, ProjectPreview],
		['currentLanguage', 'cl', undefined, BINDING.STRING],
		['showTipsGridHeight', 'stgh', true, BINDING.BOOLEAN],
		['keyboardControls', 'kc', [], BINDING.LIST, Keyboard],
		['backupsActivated', 'ba', [], BINDING.BOOLEAN],
		['backupsInterval', 'bi', [], BINDING.NUMBER],
		['backupsMax', 'bm', [], BINDING.NUMBER],
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

	getPath(): string {
		return Paths.join(Constants.IS_DESKTOP ? window.__dirname : LOCAL_FORAGE.ENGINE, Paths.FILE_ENGINE_SETTINGS);
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

export { EngineSettings };
