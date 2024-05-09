/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from './Base';
import { BINDING, BindingType, JSONType } from '../common';

class Locale extends Base {
	public names!: Record<number, string>;

	public static bindings: BindingType[] = [['names', 'names', undefined, BINDING.STRING]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(locale: Locale): void {
		super.copy(locale);
		this.names = { ...locale.names };
	}

	clone(): Locale {
		const locale = new Locale();
		locale.copy(this);
		return locale;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Locale.getBindings(additionnalBinding));
		this.name = this.names[1] ?? '';
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Locale.getBindings(additionnalBinding));
	}
}

export { Locale };
