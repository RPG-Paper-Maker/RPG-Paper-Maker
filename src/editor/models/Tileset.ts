/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

class Tileset extends Base {
	public pictureID!: number;
	public battleMap!: DynamicValue;
	public autotiles!: number[];
	public walls!: number[];
	public mountains!: number[];
	public objects!: number[];

	public static bindings: BindingType[] = [
		['pictureID', 'pic', undefined, BINDING.NUMBER],
		['battleMap', 'bm', DynamicValue.create(DYNAMIC_VALUE_KIND.DATABASE, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		['autotiles', 'auto', undefined, BINDING.NUMBER],
		['walls', 'walls', undefined, BINDING.NUMBER],
		['mountains', 'moun', undefined, BINDING.NUMBER],
		['objects', 'objs', undefined, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(tileset: Tileset): void {
		super.copy(tileset);
		this.pictureID = tileset.pictureID;
		this.battleMap = tileset.battleMap.clone();
		this.autotiles = [...tileset.autotiles];
		this.walls = [...tileset.walls];
		this.mountains = [...tileset.mountains];
		this.objects = [...tileset.objects];
	}

	clone(): Tileset {
		const tileset = new Tileset();
		tileset.copy(this);
		return tileset;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Tileset.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Tileset.getBindings(additionnalBinding));
	}
}

export { Tileset };
