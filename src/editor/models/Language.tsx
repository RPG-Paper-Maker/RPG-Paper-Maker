/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, JSONType } from '../common';
import DialogLanguage from '../components/dialogs/models/DialogLanguage';
import { BindingType } from '../core/Serializable';
import { Base, DIALOG_OPTIONS } from './Base';

class Language extends Base {
	public kind!: number;

	public static bindings: BindingType[] = [['kind', 'kind', undefined, BINDING.NUMBER]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(Language.getBindings(additionnalBinding));
		this.kind = 0;
	}

	getDialog(options: DIALOG_OPTIONS) {
		return <DialogLanguage {...options} />;
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
