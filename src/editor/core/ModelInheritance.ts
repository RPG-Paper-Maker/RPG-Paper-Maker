/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants, DYNAMIC_VALUE_KIND, INHERITANCE_ORIGIN, JSONType, STATE_OVERRIDE_GROUP } from '../common';
import type { CommonObject } from '../models/CommonObject';
import { MapObjectEvent } from '../models/MapObjectEvent';
import type { MapObjectParameter } from '../models/MapObjectParameter';
import type { MapObjectProperty } from '../models/MapObjectProperty';
import { MapObjectReaction } from '../models/MapObjectReaction';
import { MapObjectState } from '../models/MapObjectState';
import type { DynamicValue } from './DynamicValue';
import { Project } from './Project';

export const NO_SOURCE_MODEL_ID = -1;

export type ResolvedState = {
	state: MapObjectState;
	origin: INHERITANCE_ORIGIN;
	sourceModelID: number;
	overriddenGroups: STATE_OVERRIDE_GROUP[];
};

export type ResolvedProperty = {
	property: MapObjectProperty;
	origin: INHERITANCE_ORIGIN;
	sourceModelID: number;
};

export type ResolvedEvent = {
	event: MapObjectEvent;
	origin: INHERITANCE_ORIGIN;
	sourceModelID: number;
	reactionOrigins: Map<string, INHERITANCE_ORIGIN>;
	reactionSourceModelIDs: Map<string, number>;
};

export type ResolvedObject = {
	modelChain: CommonObject[];
	onlyOneEventPerFrame: boolean;
	states: ResolvedState[];
	properties: ResolvedProperty[];
	events: ResolvedEvent[];
};

class ModelInheritance {
	static getModel(id: number): CommonObject | null {
		if (id === -1) {
			return null;
		}
		return Project.current!.commonEvents.commonObjects.find((model) => model.id === id) ?? null;
	}

	static getModelChain(object: CommonObject): CommonObject[] {
		const chain: CommonObject[] = [];
		const visited = new Set<number>();
		let model = ModelInheritance.getModel(object.commonModelID);
		while (model && !visited.has(model.id)) {
			visited.add(model.id);
			chain.push(model);
			model = ModelInheritance.getModel(model.commonModelID);
		}
		return chain;
	}

	static resolveObject(object: CommonObject): ResolvedObject {
		const chain = ModelInheritance.getModelChain(object);
		return {
			modelChain: chain,
			onlyOneEventPerFrame: ModelInheritance.resolveOnlyOneEventPerFrame(object, chain),
			states: ModelInheritance.resolveWithChain(
				object,
				chain,
				ModelInheritance.getOwnStates,
				ModelInheritance.mergeStates,
			),
			properties: ModelInheritance.resolveWithChain(
				object,
				chain,
				ModelInheritance.getOwnProperties,
				ModelInheritance.mergeProperties,
			),
			events: ModelInheritance.resolveWithChain(
				object,
				chain,
				ModelInheritance.getOwnEvents,
				ModelInheritance.mergeEvents,
			),
		};
	}

	static resolveOnlyOneEventPerFrame(object: CommonObject, chain: CommonObject[]): boolean {
		const objects = [...chain].reverse().concat(object);
		let value = objects[0].onlyOneEventPerFrame;
		for (const current of objects.slice(1)) {
			if (current.onlyOneEventPerFrameOverride) {
				value = current.onlyOneEventPerFrame;
			}
		}
		return value;
	}

	static resolveStates(object: CommonObject): ResolvedState[] {
		return ModelInheritance.resolveWithChain(
			object,
			ModelInheritance.getModelChain(object),
			ModelInheritance.getOwnStates,
			ModelInheritance.mergeStates,
		);
	}

	static resolveFirstState(object: CommonObject): MapObjectState | null {
		return ModelInheritance.resolveStates(object)[0]?.state ?? null;
	}

	static resolveWithChain<T>(
		object: CommonObject,
		chain: CommonObject[],
		getOwn: (object: CommonObject) => T[],
		merge: (inherited: T[], object: CommonObject, parentID: number) => T[],
	): T[] {
		if (chain.length === 0) {
			return getOwn(object);
		}
		let resolved = getOwn(chain[chain.length - 1]);
		for (let i = chain.length - 2; i >= 0; i--) {
			resolved = merge(resolved, chain[i], chain[i + 1].id);
		}
		return merge(resolved, object, chain[0].id);
	}

	static getInheritedSourceID(origin: INHERITANCE_ORIGIN, sourceModelID: number, parentID: number): number {
		return origin === INHERITANCE_ORIGIN.INHERITED ? sourceModelID : parentID;
	}

	static getOwnStates(object: CommonObject): ResolvedState[] {
		return object.states.map((state) => ({
			state,
			origin: INHERITANCE_ORIGIN.OWN,
			sourceModelID: NO_SOURCE_MODEL_ID,
			overriddenGroups: [...state.overrides],
		}));
	}

	static mergeStates(inherited: ResolvedState[], object: CommonObject, parentID: number): ResolvedState[] {
		const states: ResolvedState[] = inherited.map((resolved) => ({
			state: resolved.state,
			origin: INHERITANCE_ORIGIN.INHERITED,
			sourceModelID: ModelInheritance.getInheritedSourceID(resolved.origin, resolved.sourceModelID, parentID),
			overriddenGroups: [],
		}));
		for (const state of object.states) {
			const index = states.findIndex((resolved) => resolved.state.id === state.id);
			if (index === -1) {
				states.push({
					state,
					origin: INHERITANCE_ORIGIN.OWN,
					sourceModelID: NO_SOURCE_MODEL_ID,
					overriddenGroups: [...state.overrides],
				});
			} else {
				const groups = Constants.ALL_STATE_OVERRIDE_GROUPS.filter((group) => state.isOverridden(group));
				let origin = INHERITANCE_ORIGIN.PARTIAL;
				if (groups.length === 0) {
					origin = INHERITANCE_ORIGIN.INHERITED;
				} else if (groups.length === Constants.ALL_STATE_OVERRIDE_GROUPS.length) {
					origin = INHERITANCE_ORIGIN.OVERRIDDEN;
				}
				states[index] = {
					state: ModelInheritance.mergeState(states[index].state, state),
					origin,
					sourceModelID: states[index].sourceModelID,
					overriddenGroups: groups,
				};
			}
		}
		return states;
	}

	static mergeState(inherited: MapObjectState, state: MapObjectState): MapObjectState {
		const inheritedJson: JSONType = {};
		inherited.write(inheritedJson);
		const ownJson: JSONType = {};
		state.write(ownJson);
		const groupKeys = new Set(Object.values(Constants.STATE_GROUP_KEYS).flat());
		const merged: JSONType = { ...inheritedJson };
		for (const [key, value] of Object.entries(ownJson)) {
			if (!groupKeys.has(key)) {
				merged[key] = value;
			}
		}
		for (const group of state.overrides) {
			for (const key of Constants.STATE_GROUP_KEYS[group]) {
				if (key in ownJson) {
					merged[key] = ownJson[key];
				} else {
					delete merged[key];
				}
			}
		}
		const mergedState = new MapObjectState();
		mergedState.read(merged);
		return mergedState;
	}

	static getOwnProperties(object: CommonObject): ResolvedProperty[] {
		return object.properties.map((property) => ({
			property,
			origin: INHERITANCE_ORIGIN.OWN,
			sourceModelID: NO_SOURCE_MODEL_ID,
		}));
	}

	static mergeProperties(inherited: ResolvedProperty[], object: CommonObject, parentID: number): ResolvedProperty[] {
		const properties: ResolvedProperty[] = inherited.map((resolved) => ({
			property: resolved.property,
			origin: INHERITANCE_ORIGIN.INHERITED,
			sourceModelID: ModelInheritance.getInheritedSourceID(resolved.origin, resolved.sourceModelID, parentID),
		}));
		for (const property of object.properties) {
			const index = properties.findIndex((resolved) => resolved.property.id === property.id);
			if (index === -1) {
				properties.push({ property, origin: INHERITANCE_ORIGIN.OWN, sourceModelID: NO_SOURCE_MODEL_ID });
			} else {
				properties[index] = {
					property,
					origin: INHERITANCE_ORIGIN.OVERRIDDEN,
					sourceModelID: properties[index].sourceModelID,
				};
			}
		}
		return properties;
	}

	static createOwnEvent(event: MapObjectEvent): ResolvedEvent {
		return {
			event,
			origin: INHERITANCE_ORIGIN.OWN,
			sourceModelID: NO_SOURCE_MODEL_ID,
			reactionOrigins: new Map(Array.from(event.reactions.keys(), (id) => [id, INHERITANCE_ORIGIN.OWN])),
			reactionSourceModelIDs: new Map(Array.from(event.reactions.keys(), (id) => [id, NO_SOURCE_MODEL_ID])),
		};
	}

	static getOwnEvents(object: CommonObject): ResolvedEvent[] {
		return object.events.map((event) => ModelInheritance.createOwnEvent(event));
	}

	static mergeEvents(inherited: ResolvedEvent[], object: CommonObject, parentID: number): ResolvedEvent[] {
		const events: ResolvedEvent[] = inherited.map((resolved) => {
			const reactionOrigins = new Map<string, INHERITANCE_ORIGIN>();
			const reactionSourceModelIDs = new Map<string, number>();
			for (const id of resolved.event.reactions.keys()) {
				reactionOrigins.set(id, INHERITANCE_ORIGIN.INHERITED);
				reactionSourceModelIDs.set(
					id,
					ModelInheritance.getInheritedSourceID(
						resolved.reactionOrigins.get(id) ?? INHERITANCE_ORIGIN.OWN,
						resolved.reactionSourceModelIDs.get(id) ?? NO_SOURCE_MODEL_ID,
						parentID,
					),
				);
			}
			return {
				event: ModelInheritance.cloneEventForInheritance(resolved.event),
				origin: INHERITANCE_ORIGIN.INHERITED,
				sourceModelID: ModelInheritance.getInheritedSourceID(resolved.origin, resolved.sourceModelID, parentID),
				reactionOrigins,
				reactionSourceModelIDs,
			};
		});
		for (const event of object.events) {
			const existing = events.find((resolved) => ModelInheritance.isEventMatching(resolved.event, event));
			if (!existing) {
				events.push(ModelInheritance.createOwnEvent(event));
				continue;
			}
			let applied = false;
			for (const [id, reaction] of event.reactions) {
				const hasInherited = existing.event.reactions.has(id);
				if (reaction.inherit && hasInherited) {
					continue;
				}
				existing.event.reactions.set(id, reaction);
				existing.reactionOrigins.set(id, hasInherited ? INHERITANCE_ORIGIN.OVERRIDDEN : INHERITANCE_ORIGIN.OWN);
				if (!hasInherited) {
					existing.reactionSourceModelIDs.set(id, NO_SOURCE_MODEL_ID);
				}
				applied = true;
			}
			if (applied && existing.origin === INHERITANCE_ORIGIN.INHERITED) {
				existing.origin = INHERITANCE_ORIGIN.OVERRIDDEN;
			}
		}
		return events;
	}

	static cloneEventForInheritance(source: MapObjectEvent): MapObjectEvent {
		const event = new MapObjectEvent();
		event.id = source.id;
		event.name = source.name;
		event.isSystem = source.isSystem;
		event.parameters = source.parameters;
		event.reactions = new Map(source.reactions);
		return event;
	}

	static isEventMatching(inherited: MapObjectEvent, event: MapObjectEvent): boolean {
		if (inherited.isSystem !== event.isSystem || inherited.id !== event.id) {
			return false;
		}
		return inherited.parameters.every((parameter) => {
			const other = event.parameters.find((p) => p.id === parameter.id);
			return (
				!!other &&
				!!ModelInheritance.getParameterValue(parameter)?.isSameDefinition(
					ModelInheritance.getParameterValue(other),
				)
			);
		});
	}

	static getParameterValue(parameter: MapObjectParameter): DynamicValue | null {
		return parameter.value.kind === DYNAMIC_VALUE_KIND.DEFAULT
			? (parameter.parameter?.defaultValue ?? null)
			: parameter.value;
	}

	static resolveModel(modelID: number): ResolvedObject | null {
		const model = ModelInheritance.getModel(modelID);
		return model ? ModelInheritance.resolveObject(model) : null;
	}

	static getModelName(modelID: number): string {
		return ModelInheritance.getModel(modelID)?.getName() ?? '';
	}

	static getParentSourceID(
		origin: INHERITANCE_ORIGIN | undefined,
		sourceModelID: number | undefined,
		parentID: number,
	): number {
		return ModelInheritance.getInheritedSourceID(
			origin ?? INHERITANCE_ORIGIN.OWN,
			sourceModelID ?? NO_SOURCE_MODEL_ID,
			parentID,
		);
	}

	static findParentState(state: MapObjectState, parent: ResolvedObject | null): ResolvedState | null {
		return parent?.states.find((resolved) => resolved.state.id === state.id) ?? null;
	}

	static findParentProperty(property: MapObjectProperty, parent: ResolvedObject | null): ResolvedProperty | null {
		return parent?.properties.find((resolved) => resolved.property.id === property.id) ?? null;
	}

	static findParentEvent(event: MapObjectEvent, parent: ResolvedObject | null): ResolvedEvent | null {
		return parent?.events.find((resolved) => ModelInheritance.isEventMatching(resolved.event, event)) ?? null;
	}

	static isSameJSON(a: MapObjectProperty, b: MapObjectProperty): boolean {
		const jsonA: JSONType = {};
		const jsonB: JSONType = {};
		a.write(jsonA);
		b.write(jsonB);
		return JSON.stringify(jsonA) === JSON.stringify(jsonB);
	}

	static isMirrorState(state: MapObjectState, parent: ResolvedObject | null): boolean {
		return !!ModelInheritance.findParentState(state, parent) && (state.overrides?.length ?? 0) === 0;
	}

	static isMirrorProperty(property: MapObjectProperty, parent: ResolvedObject | null): boolean {
		const parentProperty = ModelInheritance.findParentProperty(property, parent);
		return !!parentProperty && ModelInheritance.isSameJSON(property, parentProperty.property);
	}

	static isMirrorEvent(event: MapObjectEvent, parent: ResolvedObject | null): boolean {
		return (
			!!ModelInheritance.findParentEvent(event, parent) &&
			Array.from(event.reactions?.values() ?? []).every((reaction) => reaction.inherit)
		);
	}

	static getStateOrigin(state: MapObjectState, parent: ResolvedObject | null): INHERITANCE_ORIGIN {
		if (!ModelInheritance.findParentState(state, parent)) {
			return INHERITANCE_ORIGIN.OWN;
		}
		if (state.overrides.length === 0) {
			return INHERITANCE_ORIGIN.INHERITED;
		}
		return state.overrides.length === Constants.ALL_STATE_OVERRIDE_GROUPS.length
			? INHERITANCE_ORIGIN.OVERRIDDEN
			: INHERITANCE_ORIGIN.PARTIAL;
	}

	static getPropertyOrigin(property: MapObjectProperty, parent: ResolvedObject | null): INHERITANCE_ORIGIN {
		if (!ModelInheritance.findParentProperty(property, parent)) {
			return INHERITANCE_ORIGIN.OWN;
		}
		return ModelInheritance.isMirrorProperty(property, parent)
			? INHERITANCE_ORIGIN.INHERITED
			: INHERITANCE_ORIGIN.OVERRIDDEN;
	}

	static getEventOrigin(event: MapObjectEvent, parent: ResolvedObject | null): INHERITANCE_ORIGIN {
		if (!ModelInheritance.findParentEvent(event, parent)) {
			return INHERITANCE_ORIGIN.OWN;
		}
		return ModelInheritance.isMirrorEvent(event, parent)
			? INHERITANCE_ORIGIN.INHERITED
			: INHERITANCE_ORIGIN.OVERRIDDEN;
	}

	static getStateSourceID(state: MapObjectState, parent: ResolvedObject | null, parentID: number): number {
		const parentState = ModelInheritance.findParentState(state, parent);
		return ModelInheritance.getParentSourceID(parentState?.origin, parentState?.sourceModelID, parentID);
	}

	static getPropertySourceID(property: MapObjectProperty, parent: ResolvedObject | null, parentID: number): number {
		const parentProperty = ModelInheritance.findParentProperty(property, parent);
		return ModelInheritance.getParentSourceID(parentProperty?.origin, parentProperty?.sourceModelID, parentID);
	}

	static getEventSourceID(event: MapObjectEvent, parent: ResolvedObject | null, parentID: number): number {
		const parentEvent = ModelInheritance.findParentEvent(event, parent);
		return ModelInheritance.getParentSourceID(parentEvent?.origin, parentEvent?.sourceModelID, parentID);
	}

	static getParentReaction(
		event: MapObjectEvent,
		stateID: number,
		parent: ResolvedObject | null,
		parentID: number,
	): { reaction: MapObjectReaction; sourceModelID: number } | null {
		const parentEvent = ModelInheritance.findParentEvent(event, parent);
		const id = '' + stateID;
		const reaction = parentEvent?.event.reactions.get(id);
		if (!parentEvent || !reaction) {
			return null;
		}
		return {
			reaction,
			sourceModelID: ModelInheritance.getParentSourceID(
				parentEvent.reactionOrigins.get(id),
				parentEvent.reactionSourceModelIDs.get(id),
				parentID,
			),
		};
	}

	static syncStates(states: MapObjectState[], parent: ResolvedObject | null): MapObjectState[] {
		if (!parent) {
			return states;
		}
		const used = new Set<MapObjectState>();
		const result: MapObjectState[] = [];
		for (const resolved of parent.states) {
			const own = states.find((state) => !used.has(state) && state.id === resolved.state.id);
			if (own) {
				used.add(own);
				own.copy(ModelInheritance.mergeState(resolved.state, own));
				result.push(own);
			} else {
				const mirror = resolved.state.clone();
				mirror.overrides = [];
				result.push(mirror);
			}
		}
		return [...result, ...states.filter((state) => !used.has(state))];
	}

	static syncProperties(properties: MapObjectProperty[], parent: ResolvedObject | null): MapObjectProperty[] {
		if (!parent) {
			return properties;
		}
		const used = new Set<MapObjectProperty>();
		const result: MapObjectProperty[] = [];
		for (const resolved of parent.properties) {
			const own = properties.find((property) => !used.has(property) && property.id === resolved.property.id);
			if (own) {
				used.add(own);
				result.push(own);
			} else {
				result.push(resolved.property.clone());
			}
		}
		return [...result, ...properties.filter((property) => !used.has(property))];
	}

	static createReaction(blockingHero: boolean): MapObjectReaction {
		const reaction = new MapObjectReaction();
		reaction.commands = [];
		reaction.blockingHero = blockingHero;
		reaction.inherit = true;
		return reaction;
	}

	static syncEvents(events: MapObjectEvent[], parent: ResolvedObject | null, stateIDs: number[]): MapObjectEvent[] {
		if (!parent) {
			return events;
		}
		const used = new Set<MapObjectEvent>();
		let result: MapObjectEvent[] = [];
		for (const resolved of parent.events) {
			const own = events.find(
				(event) => !used.has(event) && ModelInheritance.isEventMatching(resolved.event, event),
			);
			if (own) {
				used.add(own);
				result.push(own);
			} else {
				const mirror = new MapObjectEvent();
				mirror.id = resolved.event.id;
				mirror.name = resolved.event.name;
				mirror.isSystem = resolved.event.isSystem;
				mirror.parameters = resolved.event.parameters.map((parameter) => parameter.clone());
				mirror.reactions = new Map();
				result.push(mirror);
			}
		}
		result = [...result, ...events.filter((event) => !used.has(event))];
		for (const event of result) {
			for (const stateID of stateIDs) {
				const id = '' + stateID;
				if (!event.reactions.has(id)) {
					const parentReaction = ModelInheritance.findParentEvent(event, parent)?.event.reactions.get(id);
					event.reactions.set(id, ModelInheritance.createReaction(parentReaction?.blockingHero ?? true));
				}
			}
		}
		return result;
	}

	static getOwnStatesForSave(states: MapObjectState[], parent: ResolvedObject | null): MapObjectState[] {
		return states.filter((state) => !ModelInheritance.isMirrorState(state, parent));
	}

	static getOwnPropertiesForSave(
		properties: MapObjectProperty[],
		parent: ResolvedObject | null,
	): MapObjectProperty[] {
		return properties.filter((property) => !ModelInheritance.isMirrorProperty(property, parent));
	}

	static getOwnEventsForSave(events: MapObjectEvent[], parent: ResolvedObject | null): MapObjectEvent[] {
		return events.filter((event) => !ModelInheritance.isMirrorEvent(event, parent));
	}
}

export { ModelInheritance };
