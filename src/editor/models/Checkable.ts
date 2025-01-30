/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Base } from './Base';

class Checkable extends Base {
	public checked!: boolean;

	public static bindings: BindingType[] = [['checked', 'checked', true, BINDING.BOOLEAN]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static createCheckable(id: number, name: string, checked: boolean): Checkable {
		let checkable = new Checkable();
		checkable.id = id;
		checkable.name = name;
		checkable.checked = checked;
		return checkable;
	}

	copy(checkable: Checkable): void {
		super.copy(checkable, Checkable.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Checkable.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Checkable.getBindings(additionnalBinding));
	}
}

export { Checkable };
