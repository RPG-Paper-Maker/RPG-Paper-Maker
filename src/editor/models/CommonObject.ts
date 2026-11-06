/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, DYNAMIC_VALUE_KIND, JSONType, Utils } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { ModelInheritance } from '../core/ModelInheritance';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';
import { MapObjectEvent } from './MapObjectEvent';
import { MapObjectParameter } from './MapObjectParameter';
import { MapObjectProperty } from './MapObjectProperty';
import { MapObjectReaction } from './MapObjectReaction';
import { MapObjectState } from './MapObjectState';

class CommonObject extends Base {
	public static type = 'CommonObject';
	public states!: MapObjectState[];
	public properties!: MapObjectProperty[];
	public events!: MapObjectEvent[];
	public onlyOneEventPerFrame!: boolean;
	public onlyOneEventPerFrameOverride = false;
	public commonModelID!: number;

	public static bindings: BindingType[] = [
		['states', 'states', [], BINDING.LIST, MapObjectState],
		['properties', 'p', [], BINDING.LIST, MapObjectProperty],
		['events', 'events', [], BINDING.LIST, MapObjectEvent],
		['onlyOneEventPerFrame', 'ooepf', undefined, BINDING.BOOLEAN],
		['commonModelID', 'hId', undefined, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static createStartupObject() {
		const object = new CommonObject();
		object.commonModelID = -1;
		object.onlyOneEventPerFrame = false;
		object.properties = [];
		const firstState = Project.current!.commonEvents.states[0];
		const state = new MapObjectState();
		state.applyDefault();
		state.id = firstState.id;
		state.name = firstState.name;
		object.states = [state];
		const eventTime = Project.current!.commonEvents.eventsSystem[0];
		const event = new MapObjectEvent();
		event.id = 1;
		event.name = eventTime.name;
		event.parameters = [
			MapObjectParameter.create(
				1,
				eventTime.parameters[0].name,
				eventTime.parameters[0],
				DynamicValue.create(DYNAMIC_VALUE_KIND.DEFAULT),
			),
			MapObjectParameter.create(
				2,
				eventTime.parameters[1].name,
				eventTime.parameters[1],
				DynamicValue.create(DYNAMIC_VALUE_KIND.SWITCH, false),
			),
		];
		const reaction = new MapObjectReaction();
		reaction.commands = [];
		reaction.blockingHero = true;
		event.reactions = new Map();
		event.reactions.set('1', reaction);
		event.isSystem = true;
		object.events = [event];
		return object;
	}

	static generateName(id: number) {
		return `OBJ:${Utils.formatNumberID(id)}`;
	}

	applyDefault(): void {
		super.applyDefault(CommonObject.getBindings([]));
		this.copy(Project.current!.commonEvents.defaultObject);
		this.name = '';
		this.resetInheritanceFlags();
	}

	resetInheritanceFlags() {
		this.onlyOneEventPerFrameOverride = false;
		for (const state of this.states) {
			state.overrides = [];
		}
		for (const event of this.events) {
			for (const reaction of event.reactions.values()) {
				reaction.inherit = true;
			}
		}
	}

	getFirstState(): MapObjectState | null {
		return this.states[0] ?? null;
	}

	getResolvedFirstState(): MapObjectState | null {
		return ModelInheritance.resolveFirstState(this);
	}

	copy(object: CommonObject, additionnalBinding: BindingType[] = []): void {
		super.copy(object, CommonObject.getBindings(additionnalBinding));
		this.onlyOneEventPerFrameOverride = object.onlyOneEventPerFrameOverride;
	}

	static fromJSON(json: JSONType): CommonObject {
		const object = new CommonObject();
		object.read(json);
		return object;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CommonObject.getBindings(additionnalBinding));
		this.onlyOneEventPerFrameOverride = json.ooepfOv === true;
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CommonObject.getBindings(additionnalBinding));
		if (this.onlyOneEventPerFrameOverride) {
			json.ooepfOv = true;
		}
	}
}

export { CommonObject };
