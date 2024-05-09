/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Locale } from './Locale';

class Keyboard extends Locale {
	public abbreviation!: string;
	public shortcuts!: number[][];

	public static bindings: BindingType[] = [
		['abbreviation', 'abr', undefined, BINDING.STRING],
		['shortcuts', 'sc', undefined, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(keyboard: Keyboard): void {
		super.copy(keyboard);
		this.abbreviation = keyboard.abbreviation;
		this.shortcuts = keyboard.shortcuts.map((shortcut) => [...shortcut]);
	}

	clone(): Keyboard {
		const keyboard = new Keyboard();
		keyboard.copy(this);
		return keyboard;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Keyboard.getBindings(additionnalBinding));
		console.log(this);
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Keyboard.getBindings(additionnalBinding));
	}
}

export { Keyboard };
