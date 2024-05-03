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
	public graphicsIndexX!: number;
	public graphicsIndexY!: number;
	public rectTileset?: Rectangle;
	public objectMovingKind!: OBJECT_MOVING_KIND;
	public eventCommandRoute!: EventCommand | null;
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
	public eventCommandDetection!: EventCommand | null;
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
		['graphicsIndexX', 'x', undefined, BINDING.NUMBER],
		['graphicsIndexY', 'y', undefined, BINDING.NUMBER],
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
		[
			'centerX',
			'cx',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 50),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'centerZ',
			'cz',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 50),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'angleX',
			'ax',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'angleY',
			'ay',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'angleZ',
			'az',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'scaleX',
			'sx',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'scaleY',
			'sy',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
		[
			'scaleZ',
			'sz',
			DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0),
			BINDING.DYNAMIC_VALUE,
			DynamicValue,
		],
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

	applyDefault(additionnalBinding: BindingType[] = []) {
		super.applyDefault(MapObjectState.getBindings(additionnalBinding));
	}

	getCommonState(): Base | null {
		return Base.getByID(Project.current!.commonEvents.states, this.id);
	}

	getName(): string {
		return this.getCommonState()?.name || '???';
	}

	copy(state: MapObjectState): void {
		super.copy(state);
		this.graphicsKind = state.graphicsKind;
		this.graphicsID = state.graphicsID;
		this.graphicsIndexX = state.graphicsIndexX;
		this.graphicsIndexY = state.graphicsIndexY;
		this.rectTileset = state.rectTileset?.clone();
		this.objectMovingKind = state.objectMovingKind;
		this.eventCommandRoute = state.eventCommandRoute === null ? null : state.eventCommandRoute.clone();
		this.speedID = state.speedID;
		this.frequencyID = state.frequencyID;
		this.moveAnimation = state.moveAnimation;
		this.stopAnimation = state.stopAnimation;
		this.climbAnimation = state.climbAnimation;
		this.directionFix = state.directionFix;
		this.through = state.through;
		this.setWithCamera = state.setWithCamera;
		this.pixelOffset = state.pixelOffset;
		this.keepPosition = state.keepPosition;
		this.eventCommandDetection = state.eventCommandDetection === null ? null : state.eventCommandDetection.clone();
		this.centerX = state.centerX.clone();
		this.centerZ = state.centerZ.clone();
		this.angleX = state.angleX.clone();
		this.angleY = state.angleY.clone();
		this.angleZ = state.angleZ.clone();
		this.scaleX = state.scaleX.clone();
		this.scaleY = state.scaleY.clone();
		this.scaleZ = state.scaleZ.clone();
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
		super.write(json, MapObjectState.getBindings(additionnalBinding));
	}
}

export { MapObjectState };
