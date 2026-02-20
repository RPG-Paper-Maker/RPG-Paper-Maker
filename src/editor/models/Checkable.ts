/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType } from '../common';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';

class Checkable extends Base {
	public static type = 'Checkable';

	public checked!: boolean;

	public static bindings: BindingType[] = [['checked', 'checked', true, BINDING.BOOLEAN]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static createCheckable(id: number, name: string, checked: boolean): Checkable {
		const checkable = new Checkable();
		checkable.id = id;
		checkable.name = name;
		checkable.checked = checked;
		return checkable;
	}

	applyDefault(additionnalBinding: BindingType[] = []) {
		super.applyDefault(Checkable.getBindings(additionnalBinding));
	}

	copy(checkable: Checkable, additionnalBinding: BindingType[] = []): void {
		super.copy(checkable, Checkable.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Checkable.getBindings(additionnalBinding));
	}

	readSimple(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.readSimple(json, additionnalBinding);
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Checkable.getBindings(additionnalBinding));
	}

	writeSimple(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.writeSimple(json, additionnalBinding);
	}
}

export { Checkable };
