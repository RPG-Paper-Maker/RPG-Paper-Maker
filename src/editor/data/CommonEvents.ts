/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { Model } from '../Editor';
import { BINDING, JSONType, Paths } from '../common';
import { Project } from '../core/Project';
import { BindingType, Serializable } from '../core/Serializable';

const { t } = i18next;

class CommonEvents extends Serializable {
	public static readonly SYSTEM_EVENTS: JSONType[] = [
		{ id: 1, name: 'Time', p: [
			{ id: 1, name: 'Interval', d: { k: 3, v: 0 } },
			{ id: 2, name: 'Repeat', d: { k: 10, v: true } },
		]},
		{ id: 2, name: 'Chronometer finished', p: [
			{ id: 1, name: 'ID', d: { k: 3, v: 0 } },
		]},
		{ id: 3, name: 'KeyPress', p: [
			{ id: 1, name: 'ID', d: { k: 1, v: null } },
			{ id: 2, name: 'Repeat', d: { k: 10, v: false } },
			{ id: 3, name: 'Immediate Repeat', d: { k: 10, v: false } },
		]},
		{ id: 4, name: 'KeyRelease', p: [
			{ id: 1, name: 'ID', d: { k: 1, v: null } },
		]},
		{ id: 5, name: 'MouseDown', p: [
			{ id: 1, name: 'x', d: { k: 3, v: 0 } },
			{ id: 2, name: 'y', d: { k: 3, v: 0 } },
			{ id: 3, name: 'Left', d: { k: 10, v: true } },
			{ id: 4, name: 'Repeat', d: { k: 10, v: false } },
		]},
		{ id: 6, name: 'MouseUp', p: [
			{ id: 1, name: 'x', d: { k: 3, v: 0 } },
			{ id: 2, name: 'y', d: { k: 3, v: 0 } },
			{ id: 3, name: 'Left', d: { k: 10, v: true } },
		]},
		{ id: 7, name: 'MouseMove', p: [
			{ id: 1, name: 'x', d: { k: 3, v: 0 } },
			{ id: 2, name: 'y', d: { k: 3, v: 0 } },
		]},
		{ id: 8, name: 'Closing main menu', p: [] },
	];

	public eventsSystem!: Model.CommonEvent[];
	public eventsUser!: Model.CommonEvent[];
	public states!: Model.Base[];
	public commonReactions!: Model.CommonReaction[];
	public commonObjects!: Model.CommonObject[];
	public defaultObject!: Model.CommonObject;
	public heroObject!: Model.CommonObject;

	public static readonly bindings: BindingType[] = [
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

	translateDefaults(): void {
		for (const [index, state] of this.states.entries()) {
			state.name = `${t('state')} ${index + 1}`;
		}
		this.defaultObject.name = t('default');
		this.heroObject.name = t('hero');
		this.commonReactions[0].name = t('increase');
		this.commonReactions[1].name = t('steel');
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		this.eventsSystem = CommonEvents.SYSTEM_EVENTS.map((eventJson) => {
			const event = new Model.CommonEvent();
			event.read(eventJson);
			return event;
		});
		super.read(json, CommonEvents.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, CommonEvents.getBindings(additionnalBinding));
	}
}

export { CommonEvents };
