/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, GAME_OVER_COMMAND_KIND, JSONType } from '../common';
import { Localization } from './Localization';

class GameOverCommand extends Localization {
	public kind!: GAME_OVER_COMMAND_KIND;
	public script!: string;

	public static bindings: BindingType[] = [
		['kind', 'k', GAME_OVER_COMMAND_KIND.CONTINUE, BINDING.NUMBER],
		['script', 's', '', BINDING.STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(gameOverCommand: GameOverCommand): void {
		super.copy(gameOverCommand, GameOverCommand.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, GameOverCommand.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, GameOverCommand.getBindings(additionnalBinding));
	}
}

export { GameOverCommand };
