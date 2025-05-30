/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType, LANGUAGE_KIND } from '../common';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';

class Language extends Base {
	public kind!: LANGUAGE_KIND;

	public static bindings: BindingType[] = [['kind', 'kind', undefined, BINDING.NUMBER]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(language: Language, additionnalBinding: BindingType[] = []): void {
		super.copy(language, Language.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Language.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Language.getBindings(additionnalBinding));
	}
}

export { Language };
