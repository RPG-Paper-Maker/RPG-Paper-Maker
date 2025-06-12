/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, ITERATOR, JSONType } from '../common';
import DialogLocalization from '../components/dialogs/models/DialogLocalization';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';
import { MapObjectCommandType } from './MapObjectCommand';

class Localization extends Base {
	public names: Map<string, string> = new Map();

	public static readonly bindings: BindingType[] = [['names', 'names', undefined, BINDING.MAP]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Localization.bindings, ...additionnalBinding];
	}

	static create(id: number, name: string): Localization {
		const localization = new Localization();
		localization.id = id;
		localization.updateMainName(name);
		return localization;
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(Localization.getBindings(additionnalBinding));
		this.names = new Map();
		this.names.set('1', '');
	}

	initializeCommand(command: MapObjectCommandType[], iterator: ITERATOR) {
		const id = command[iterator.i++] as string;
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
		return this.names.get('1') ?? '';
	}

	updateMainName(name: string) {
		this.name = name;
		this.names.set('1', name);
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogLocalization {...options} />;
	}

	copy(localization: Localization, additionnalBinding: BindingType[] = []): void {
		super.copy(localization, Localization.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Localization.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Localization.getBindings(additionnalBinding));
	}
}

export { Localization };
