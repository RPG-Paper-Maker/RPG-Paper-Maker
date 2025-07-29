/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import DialogMapObjectProperty from '../components/dialogs/models/DialogMapObjectProperty';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';

class MapObjectProperty extends Base {
	public static type = 'MapObjectProperty';
	public initialValue!: DynamicValue;

	public static bindings: BindingType[] = [
		['initialValue', 'iv', DynamicValue.create(DYNAMIC_VALUE_KIND.NONE), BINDING.DYNAMIC_VALUE, DynamicValue],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogMapObjectProperty {...options} />;
	}

	toString(): string {
		return `${this.toStringNameID()} = ${this.initialValue.toString()}`;
	}

	copy(property: MapObjectProperty, additionnalBinding: BindingType[] = []): void {
		super.copy(property, MapObjectProperty.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapObjectProperty.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MapObjectProperty.getBindings(additionnalBinding));
	}
}

export { MapObjectProperty };
