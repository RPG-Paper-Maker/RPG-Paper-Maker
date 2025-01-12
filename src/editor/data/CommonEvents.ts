/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING, BindingType, JSONType, Paths } from '../common';
import { Project, Serializable } from '../core';

class CommonEvents extends Serializable {
	public eventsSystem!: Model.CommonEvent[];
	public eventsUser!: Model.CommonEvent[];
	public states!: Model.Base[];
	public commonReactions!: Model.CommonReaction[];
	public commonObjects!: Model.CommonObject[];
	public defaultObject!: Model.CommonObject;
	public heroObject!: Model.CommonObject;

	public static readonly bindings: BindingType[] = [
		['eventsSystem', 'eventsSystem', undefined, BINDING.LIST, Model.CommonEvent],
		['eventsUser', 'eventsUser', undefined, BINDING.LIST, Model.CommonEvent],
		['states', 'states', undefined, BINDING.LIST, Model.Base],
		['commonReactions', 'commonReactors', undefined, BINDING.LIST, Model.CommonReaction],
		['commonObjects', 'commonObjects', undefined, BINDING.LIST, Model.CommonObject],
		['defaultObject', 'do', undefined, BINDING.OBJECT, Model.CommonObject],
		['heroObject', 'ho', undefined, BINDING.OBJECT, Model.CommonObject],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...CommonEvents.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_COMMON_EVENTS);
	}

	translateDefaults() {
		//this.eventsSystem
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, CommonEvents.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CommonEvents.getBindings(additionnalBinding));
	}
}

export { CommonEvents };
