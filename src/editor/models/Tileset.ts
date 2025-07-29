/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';

class Tileset extends Base {
	public static type = 'Tileset';
	public pictureID!: number;
	public battleMap!: DynamicValue;

	public static bindings: BindingType[] = [
		['pictureID', 'pic', undefined, BINDING.NUMBER],
		['battleMap', 'bm', DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(Tileset.getBindings(additionnalBinding));
	}

	copy(tileset: Tileset): void {
		super.copy(tileset);
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Tileset.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Tileset.getBindings(additionnalBinding));
	}
}

export { Tileset };
