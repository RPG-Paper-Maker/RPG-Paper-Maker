/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from './Base';
import { BINDING, BindingType, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';

class MapObjectProperty extends Base {
	public initialValue!: DynamicValue;

	public static bindings: BindingType[] = [['initialValue', 'iv', undefined, BINDING.OBJECT, DynamicValue]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(property: MapObjectProperty): void {
		super.copy(property);
		this.initialValue = property.initialValue.clone();
	}

	clone(): MapObjectProperty {
		const property = new MapObjectProperty();
		property.copy(this);
		return property;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapObjectProperty.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MapObjectProperty.getBindings(additionnalBinding));
	}
}

export { MapObjectProperty };
