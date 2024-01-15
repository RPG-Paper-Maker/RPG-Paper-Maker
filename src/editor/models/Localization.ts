/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType } from '../common';
import { Serializable } from '../core';

class Localization extends Serializable {
	public names!: Map<number, string>;

	public static readonly bindings: BindingType[] = [['names', 'names', undefined, BINDING.MAP]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Localization.bindings, ...additionnalBinding];
	}

	static create(name: string): Localization {
		const localization = new Localization();
		localization.names = new Map();
		localization.names.set(1, name);
		return localization;
	}

	name(): string {
		return this.names.get(1)!;
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Localization.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Localization.getBindings(additionnalBinding));
	}
}

export { Localization };
