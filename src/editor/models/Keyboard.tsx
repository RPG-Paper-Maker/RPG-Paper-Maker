/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { BINDING, JSONType, Utils } from '../common';
import DialogKeyboard from '../components/dialogs/models/DialogKeyboard';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';
import { Localization } from './Localization';

const { t } = i18next;

class Keyboard extends Localization {
	public abbreviation!: string;
	public shortcuts!: string[][];
	public isEngine = false;

	public static bindings: BindingType[] = [
		['abbreviation', 'abr', undefined, BINDING.STRING],
		['shortcuts', 'sc', undefined, BINDING.LIST_STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return ['abbreviation', 'description', 'shortcut'];
	}

	static createKeyboard(id: number, name: string, abbreviation: string, shortcuts: string[][]) {
		const keyboard = new Keyboard();
		keyboard.id = id;
		keyboard.name = name;
		keyboard.names.set('1', name);
		keyboard.abbreviation = abbreviation;
		keyboard.shortcuts = shortcuts;
		return keyboard;
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(Keyboard.getBindings(additionnalBinding));
		this.abbreviation = '';
		this.shortcuts = [];
	}

	getDialog(options: DIALOG_OPTIONS) {
		return <DialogKeyboard {...options} />;
	}

	static toStringShortcuts(shortcuts: string[][]): string {
		return shortcuts
			.map((shortcut) => shortcut.join(' + '))
			.join(' | ')
			.toUpperCase();
	}

	toStrings(): string[] {
		return [
			`${Base.STRING_START}${this.id <= 0 ? '' : `${Utils.formatNumber(this.id, 4)}: `}${this.abbreviation}`,
			this.isEngine ? t(this.getName()) : this.getName(),
			Keyboard.toStringShortcuts(this.shortcuts),
		];
	}

	copy(keyboard: Keyboard): void {
		super.copy(keyboard);
		this.isEngine = keyboard.isEngine;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Keyboard.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Keyboard.getBindings(additionnalBinding));
	}
}

export { Keyboard };
