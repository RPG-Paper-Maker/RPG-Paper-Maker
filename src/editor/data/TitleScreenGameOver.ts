/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType, Paths, SONG_KIND } from '../common';
import { Project, Serializable } from '../core';
import { Checkable, GameOverCommand, PlaySong, TitleCommand } from '../models';

class TitleScreenGameOver extends Serializable {
	public isTitleBackgroundImage!: boolean;
	public titleBackgroundImageID!: number;
	public titleBackgroundVideoID!: number;
	public titleMusic!: PlaySong;
	public titleCommands!: TitleCommand[];
	public titleSettings!: Checkable[];
	public isGameOverBackgroundImage!: boolean;
	public gameOverBackgroundImageID!: number;
	public gameOverBackgroundVideoID!: number;
	public gameOverMusic!: PlaySong;
	public gameOverCommands!: GameOverCommand[];

	public static readonly bindings: BindingType[] = [
		['isTitleBackgroundImage', 'itbi', true, BINDING.BOOLEAN],
		['titleBackgroundImageID', 'tb', 1, BINDING.NUMBER],
		['titleBackgroundVideoID', 'tbv', 1, BINDING.NUMBER],
		['titleMusic', 'tm', undefined, BINDING.OBJECT, PlaySong],
		['titleCommands', 'tc', [], BINDING.LIST, TitleCommand],
		['titleSettings', 'ts', undefined, BINDING.LIST, Checkable],
		['isGameOverBackgroundImage', 'isGameOverBackgroundImage', true, BINDING.BOOLEAN],
		['gameOverBackgroundImageID', 'gameOverBackgroundImage', 1, BINDING.BOOLEAN],
		['gameOverBackgroundVideoID', 'gameOverBackgroundVideo', 1, BINDING.BOOLEAN],
		['gameOverMusic', 'gameOverMusic', undefined, BINDING.OBJECT, PlaySong],
		['gameOverCommands', 'gameOverCommands', [], BINDING.LIST, GameOverCommand],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...TitleScreenGameOver.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_TITLE_SCREEN_GAME_OVER);
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, TitleScreenGameOver.getBindings(additionnalBinding));
		this.titleMusic.kind = SONG_KIND.MUSIC;
		this.gameOverMusic.kind = SONG_KIND.MUSIC;
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, TitleScreenGameOver.getBindings(additionnalBinding));
	}
}

export { TitleScreenGameOver };
