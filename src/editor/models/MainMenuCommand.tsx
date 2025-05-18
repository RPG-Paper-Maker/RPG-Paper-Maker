/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, BindingType, JSONType, MAIN_MENU_COMMAND_KIND } from '../common';
import DialogMainMenuCommand from '../components/dialogs/models/DialogMainMenuCommand';
import { DIALOG_OPTIONS } from './Base';
import { Localization } from './Localization';

class MainMenuCommand extends Localization {
	public kind!: MAIN_MENU_COMMAND_KIND;
	public script!: string;

	public static bindings: BindingType[] = [
		['kind', 'kind', MAIN_MENU_COMMAND_KIND.INVENTORY, BINDING.NUMBER],
		['script', 'script', '', BINDING.STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	applyDefault(): void {
		super.applyDefault(MainMenuCommand.getBindings([]));
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogMainMenuCommand {...options} />;
	}

	copy(mainMenuCommand: MainMenuCommand): void {
		super.copy(mainMenuCommand, MainMenuCommand.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, MainMenuCommand.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, MainMenuCommand.getBindings(additionnalBinding));
	}
}

export { MainMenuCommand };
