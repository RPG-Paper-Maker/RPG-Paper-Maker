/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano
*/

import { ReactNode } from 'react';
import { BINDING, DYNAMIC_VALUE_KIND, JSONType, MAP_OBJECT_LIGHT_KIND } from '../common';
import DialogMapObjectLight from '../components/dialogs/models/DialogMapObjectLight';
import { DynamicValue } from '../core/DynamicValue';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';

class MapObjectLight extends Base {
	public static type = 'MapObjectLight';
	public kind!: DynamicValue;
	public color!: DynamicValue;
	public groundColor!: DynamicValue;
	public intensity!: DynamicValue;
	public intensityOffset!: DynamicValue;
	public intensityTime!: DynamicValue;
	public x!: DynamicValue;
	public y!: DynamicValue;
	public z!: DynamicValue;
	public distance!: DynamicValue;
	public angle!: DynamicValue;
	public penumbra!: DynamicValue;
	public targetX!: DynamicValue;
	public targetY!: DynamicValue;
	public targetZ!: DynamicValue;

	public static bindings: BindingType[] = [
		[
			'kind',
			'k',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, MAP_OBJECT_LIGHT_KIND.POINT),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['color', 'c', DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, '#ffffff'), BINDING.DYNAMIC_VALUE, DynamicValue],
		[
			'groundColor',
			'gc',
			DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, '#444444'),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'intensity',
			'i',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 5),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'intensityOffset',
			'io',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['intensityTime', 'it', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0), BINDING.DYNAMIC_VALUE, DynamicValue],
		['x', 'x', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0), BINDING.DYNAMIC_VALUE, DynamicValue],
		['y', 'y', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 1), BINDING.DYNAMIC_VALUE, DynamicValue],
		['z', 'z', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0), BINDING.DYNAMIC_VALUE, DynamicValue],
		[
			'distance',
			'd',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 2),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		['angle', 'a', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 45), BINDING.DYNAMIC_VALUE, DynamicValue],
		[
			'penumbra',
			'p',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'targetX',
			'tx',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'targetY',
			'ty',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'targetZ',
			'tz',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, -16),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
	];

	applyDefault() {
		super.applyDefault(MapObjectLight.bindings);
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogMapObjectLight {...options} />;
	}

	toString(): string {
		return (
			Base.STRING_START +
			(this.id <= 0
				? ''
				: (Base.getByID(Base.MAP_OBJECT_LIGHT_SOURCE_OPTIONS, this.kind.getFixNumberValue())?.name ?? ''))
		);
	}

	copy(light: MapObjectLight) {
		super.copy(light, MapObjectLight.bindings);
	}

	read(json: JSONType) {
		const kinds: [string, DYNAMIC_VALUE_KIND][] = [
			['k', DYNAMIC_VALUE_KIND.NUMBER],
			['c', DYNAMIC_VALUE_KIND.TEXT],
			['gc', DYNAMIC_VALUE_KIND.TEXT],
			['i', DYNAMIC_VALUE_KIND.NUMBER_DECIMAL],
			['io', DYNAMIC_VALUE_KIND.NUMBER_DECIMAL],
			['it', DYNAMIC_VALUE_KIND.NUMBER],
			['x', DYNAMIC_VALUE_KIND.NUMBER_DECIMAL],
			['y', DYNAMIC_VALUE_KIND.NUMBER_DECIMAL],
			['z', DYNAMIC_VALUE_KIND.NUMBER_DECIMAL],
			['d', DYNAMIC_VALUE_KIND.NUMBER_DECIMAL],
			['a', DYNAMIC_VALUE_KIND.NUMBER],
			['p', DYNAMIC_VALUE_KIND.NUMBER_DECIMAL],
			['tx', DYNAMIC_VALUE_KIND.NUMBER_DECIMAL],
			['ty', DYNAMIC_VALUE_KIND.NUMBER_DECIMAL],
			['tz', DYNAMIC_VALUE_KIND.NUMBER_DECIMAL],
		];
		for (const [key, kind] of kinds) {
			if (typeof json[key] === 'number' || typeof json[key] === 'string') {
				json[key] = { k: kind, v: json[key] };
			}
		}
		super.read(json, MapObjectLight.bindings);
	}

	write(json: JSONType) {
		super.write(json, MapObjectLight.bindings);
	}
}

function getMapObjectLightIntensity(light: MapObjectLight, elapsedTime: number): number {
	const intensityTime = light.intensityTime.getFixNumberValue();
	const intensityOffset = light.intensityOffset.getFixNumberValue();
	const intensity = light.intensity.getFixNumberValue();
	if (intensityTime <= 0 || intensityOffset === 0) {
		return intensity;
	}
	const factor = (1 - Math.cos((Math.PI * elapsedTime) / intensityTime)) / 2;
	return Math.max(0, intensity * (1 + (intensityOffset / 100) * factor));
}

export { getMapObjectLightIntensity, MAP_OBJECT_LIGHT_KIND, MapObjectLight };
