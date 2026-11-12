/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, JSONType, TITLE_COMMAND_KIND } from '../common';
import DialogTitleCommand from '../components/dialogs/models/DialogTitleCommand';
import { BindingType } from '../core/Serializable';
import { DIALOG_OPTIONS } from './Base';
import { Localization } from './Localization';

class TitleCommand extends Localization {
	public static type = 'TitleCommand';
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

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogTitleCommand {...options} />;
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
