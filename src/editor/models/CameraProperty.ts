/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';

class CameraProperty extends Base {
	public distance!: DynamicValue;
	public horizontalAngle!: DynamicValue;
	public verticalAngle!: DynamicValue;
	public targetOffsetX!: DynamicValue;
	public targetOffsetY!: DynamicValue;
	public targetOffsetZ!: DynamicValue;
	public isSquareTargetOffsetX!: boolean;
	public isSquareTargetOffsetY!: boolean;
	public isSquareTargetOffsetZ!: boolean;
	public fov!: DynamicValue;
	public near!: DynamicValue;
	public far!: DynamicValue;
	public orthographic!: boolean;

	public static bindings: BindingType[] = [
		[
			'distance',
			'd',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 300),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'horizontalAngle',
			'ha',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, -90),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'verticalAngle',
			'va',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 65),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'targetOffsetX',
			'tox',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'targetOffsetY',
			'toy',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'targetOffsetZ',
			'toz',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['isSquareTargetOffsetX', 'istox', true, BINDING.BOOLEAN],
		['isSquareTargetOffsetY', 'istoy', true, BINDING.BOOLEAN],
		['isSquareTargetOffsetZ', 'istoz', true, BINDING.BOOLEAN],
		['fov', 'fov', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 45), BINDING.DYNAMIC_VALUE, DynamicValue],
		['near', 'n', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		[
			'far',
			'f',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 100000),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['orthographic', 'o', false, BINDING.BOOLEAN],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(cameraProperty: CameraProperty): void {
		super.copy(cameraProperty, CameraProperty.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CameraProperty.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CameraProperty.getBindings(additionnalBinding));
	}
}

export { CameraProperty };
