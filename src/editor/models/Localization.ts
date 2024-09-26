/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, ITERATOR, JSONType } from '../common';
import { Base } from './Base';
import { MapObjectCommandType } from './MapObjectCommand';

class Localization extends Base {
	public names: Map<number, string> = new Map();

	public static readonly bindings: BindingType[] = [['names', 'names', undefined, BINDING.MAP]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Localization.bindings, ...additionnalBinding];
	}

	static create(id: number, name: string): Localization {
		const localization = new Localization();
		localization.id = id;
		localization.name = name;
		localization.names = new Map();
		localization.names.set(1, name);
		return localization;
	}

	initializeCommand(command: MapObjectCommandType[], iterator: ITERATOR) {
		const id = command[iterator.i++] as number;
		const name = command[iterator.i++] as string;
		this.names.set(id, name);
	}

	getCommand(command: MapObjectCommandType[]) {
		for (const [id, name] of this.names) {
			command.push(id);
			command.push(name);
		}
	}

	getName(): string {
		return this.names.get(1) ?? '';
	}

	copy(localization: Localization): void {
		super.copy(localization);
		this.names = new Map(localization.names);
	}

	clone(): Localization {
		const localization = new Localization();
		localization.copy(this);
		return localization;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Localization.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Localization.getBindings(additionnalBinding));
	}
}

export { Localization };
