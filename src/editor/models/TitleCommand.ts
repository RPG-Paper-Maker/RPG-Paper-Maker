/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType, TITLE_COMMAND_KIND } from '../common';
import { Localization } from './Localization';

class TitleCommand extends Localization {
	public kind!: TITLE_COMMAND_KIND;
	public script!: string;

	public static bindings: BindingType[] = [
		['kind', 'k', TITLE_COMMAND_KIND.NEW_GAME, BINDING.NUMBER],
		['script', 's', '', BINDING.STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(): void {
		super.applyDefault(TitleCommand.getBindings([]));
	}

	copy(titleCommand: TitleCommand): void {
		super.copy(titleCommand, TitleCommand.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, TitleCommand.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, TitleCommand.getBindings(additionnalBinding));
	}
}

export { TitleCommand };
