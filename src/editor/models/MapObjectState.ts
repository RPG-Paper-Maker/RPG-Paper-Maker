/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from './Base';
import { BINDING, BindingType, DYNAMIC_VALUE_KIND, ELEMENT_MAP_KIND, JSONType, OBJECT_MOVING_KIND } from '../common';
import { Project, Rectangle } from '../core';
import { DynamicValue } from '../core/DynamicValue';
import { EventCommand } from './EventCommand';

class MapObjectState extends Base {
	public graphicsKind!: ELEMENT_MAP_KIND;
	public graphicsID!: number;
	public indexX!: number;
	public indexY!: number;
	public rectTileset!: Rectangle;
	public objectMovingKind!: OBJECT_MOVING_KIND;
	public eventCommandRoute: any;
	public speedID!: number;
	public frequencyID!: number;
	public moveAnimation!: boolean;
	public stopAnimation!: boolean;
	public climbAnimation!: boolean;
	public directionFix!: boolean;
	public through!: boolean;
	public setWithCamera!: boolean;
	public pixelOffset!: boolean;
	public keepPosition!: boolean;
	public itemDetection!: any;
	public eventCommandDetection!: any;
	public centerX!: DynamicValue;
	public centerZ!: DynamicValue;
	public angleX!: DynamicValue;
	public angleY!: DynamicValue;
	public angleZ!: DynamicValue;
	public scaleX!: DynamicValue;
	public scaleY!: DynamicValue;
	public scaleZ!: DynamicValue;

	public static bindings: BindingType[] = [
		['graphicsKind', 'gk', undefined, BINDING.NUMBER],
		['graphicsID', 'gid', undefined, BINDING.NUMBER],
		['indexX', 'x', undefined, BINDING.NUMBER],
		['indexY', 'y', undefined, BINDING.NUMBER],
		['rectTileset', 'rt', undefined, BINDING.RECTANGLE],
		['objectMovingKind', 'omk', OBJECT_MOVING_KIND.FIX, BINDING.NUMBER],
		['eventCommandRoute', 'ecr', null, BINDING.OBJECT, EventCommand],
		['speedID', 's', 1, BINDING.NUMBER],
		['frequencyID', 'f', 1, BINDING.NUMBER],
		['moveAnimation', 'move', undefined, BINDING.BOOLEAN],
		['stopAnimation', 'stop', undefined, BINDING.BOOLEAN],
		['climbAnimation', 'climb', undefined, BINDING.BOOLEAN],
		['directionFix', 'dir', undefined, BINDING.BOOLEAN],
		['through', 'through', undefined, BINDING.BOOLEAN],
		['setWithCamera', 'cam', undefined, BINDING.BOOLEAN],
		['pixelOffset', 'pix', undefined, BINDING.BOOLEAN],
		['keepPosition', 'pos', undefined, BINDING.BOOLEAN],
		['eventCommandDetection', 'ecd', null, BINDING.OBJECT, EventCommand],
		['centerX', 'cx', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 50), BINDING.DYNAMIC_VALUE],
		['centerZ', 'cz', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 50), BINDING.DYNAMIC_VALUE],
		['angleX', 'ax', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0), BINDING.DYNAMIC_VALUE],
		['angleY', 'ay', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0), BINDING.DYNAMIC_VALUE],
		['angleZ', 'az', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0), BINDING.DYNAMIC_VALUE],
		['scaleX', 'sx', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0), BINDING.DYNAMIC_VALUE],
		['scaleY', 'sy', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0), BINDING.DYNAMIC_VALUE],
		['scaleZ', 'sz', DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0), BINDING.DYNAMIC_VALUE],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static create(id: number, name: string) {
		const object = new MapObjectState();
		object.id = id;
		object.name = name;
		return object;
	}

	getCommonState() {
		return Base.getByID(Project.current!.commonEvents.states, this.id);
	}

	copy(state: MapObjectState): void {
		super.copy(state);
	}

	clone(): MapObjectState {
		const state = new MapObjectState();
		state.copy(this);
		return state;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapObjectState.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		console.log(this);
		super.write(json, MapObjectState.getBindings(additionnalBinding));
	}
}

export { MapObjectState };
