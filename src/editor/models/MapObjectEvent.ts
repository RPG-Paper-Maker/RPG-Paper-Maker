/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, DYNAMIC_VALUE_KIND, JSONType } from '../common';
import { Project } from '../core';
import { DynamicValue } from '../core/DynamicValue';
import { Base } from './Base';
import { CommonEvent } from './CommonEvent';
import { MapObjectParameter } from './MapObjectParameter';
import { MapObjectReaction } from './MapObjectReaction';

class MapObjectEvent extends Base {
	public parameters!: MapObjectParameter[];
	public reactions!: Map<string, MapObjectReaction>;
	public isSystem!: boolean;

	public static bindings: BindingType[] = [
		['parameters', 'p', undefined, BINDING.LIST, MapObjectParameter],
		['reactions', 'r', undefined, BINDING.MAP, MapObjectReaction],
		['isSystem', 'sys', undefined, BINDING.BOOLEAN],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getDefaultParameters(
		eventID: number,
		isSystem: boolean,
		initialParameters: MapObjectParameter[]
	): MapObjectParameter[] {
		const events = isSystem ? Project.current!.commonEvents.eventsSystem : Project.current!.commonEvents.eventsUser;
		const event = Base.getByID(events, eventID) as CommonEvent;
		const parameters = [];
		for (const createParameter of event.parameters) {
			const value = DynamicValue.create(DYNAMIC_VALUE_KIND.DEFAULT);
			for (const parameter of initialParameters) {
				if (createParameter.id === parameter.id) {
					value.copy(parameter.value);
					break;
				}
			}
			parameters.push(
				MapObjectParameter.create(createParameter.id, createParameter.name, createParameter, value)
			);
		}
		return parameters;
	}

	updateParameters() {
		if (Project.current) {
			this.parameters = MapObjectEvent.getDefaultParameters(this.id, this.isSystem, this.parameters);
		}
	}

	getName(): string {
		const parameters = this.parameters.map((param) => param.toStringValueOrDefault());
		return `${
			Base.getByID(
				this.isSystem ? Project.current!.commonEvents.eventsSystem : Project.current!.commonEvents.eventsUser,
				this.id
			)?.name ?? ''
		}${parameters.length > 0 ? ` [${parameters.join(',')}]` : ''}`;
	}

	toString(): string {
		return `${Base.STRING_START}${this.getName()}`;
	}

	copy(event: MapObjectEvent): void {
		super.copy(event);
		this.parameters = event.parameters.map((parameter) => parameter.clone());
		this.reactions = new Map();
		for (const [i, reaction] of event.reactions.entries()) {
			this.reactions.set(i, reaction.clone());
		}
		this.isSystem = event.isSystem;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MapObjectEvent.getBindings(additionnalBinding));
		this.updateParameters();
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MapObjectEvent.getBindings(additionnalBinding));
	}
}

export { MapObjectEvent };
