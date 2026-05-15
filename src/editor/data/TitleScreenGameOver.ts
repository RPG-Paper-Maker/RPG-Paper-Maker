/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { BINDING, JSONType, Paths, SONG_KIND } from '../common';
import { Project } from '../core/Project';
import { BindingType, Serializable } from '../core/Serializable';
import { Checkable, GameOverCommand, PlaySong, TitleCommand } from '../models';

const { t } = i18next;

class TitleScreenGameOver extends Serializable {
	public isTitleBackgroundImage!: boolean;
	public isTitleBackgroundVideo!: boolean;
	public titleBackgroundImageID!: number;
	public titleBackgroundVideoID!: number;
	public titleVideoLoop!: boolean;
	public titleVideoLoopMs!: number;
	public titleMusic!: PlaySong;
	public titleCommands!: TitleCommand[];
	public titleSettings!: Checkable[];
	public isGameOverBackgroundImage!: boolean;
	public isGameOverBackgroundVideo!: boolean;
	public gameOverBackgroundImageID!: number;
	public gameOverBackgroundVideoID!: number;
	public gameOverMusic!: PlaySong;
	public gameOverCommands!: GameOverCommand[];

	public static readonly bindings: BindingType[] = [
		['isTitleBackgroundImage', 'itbi', true, BINDING.BOOLEAN],
		['isTitleBackgroundVideo', 'itbv', false, BINDING.BOOLEAN],
		['titleBackgroundImageID', 'tb', 1, BINDING.NUMBER],
		['titleBackgroundVideoID', 'tbv', 1, BINDING.NUMBER],
		['titleVideoLoop', 'tvl', true, BINDING.BOOLEAN],
		['titleVideoLoopMs', 'tvlms', 0, BINDING.NUMBER],
		['titleMusic', 'tm', undefined, BINDING.OBJECT, PlaySong],
		['titleCommands', 'tc', [], BINDING.LIST, TitleCommand],
		['titleSettings', 'ts', undefined, BINDING.LIST, Checkable],
		['isGameOverBackgroundImage', 'isGameOverBackgroundImage', true, BINDING.BOOLEAN],
		['isGameOverBackgroundVideo', 'isGameOverBackgroundVideo', false, BINDING.BOOLEAN],
		['gameOverBackgroundImageID', 'gameOverBackgroundImage', 1, BINDING.NUMBER],
		['gameOverBackgroundVideoID', 'gameOverBackgroundVideo', 1, BINDING.NUMBER],
		['gameOverMusic', 'gameOverMusic', undefined, BINDING.OBJECT, PlaySong],
		['gameOverCommands', 'gameOverCommands', [], BINDING.LIST, GameOverCommand],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...TitleScreenGameOver.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_TITLE_SCREEN_GAME_OVER);
	}

	translateDefaults(): void {
		this.titleCommands[0].updateMainName(t('new.game'));
		this.titleCommands[1].updateMainName(t('load.game'));
		this.titleCommands[2].updateMainName(t('settings'));
		this.titleCommands[3].updateMainName(t('exit'));
		this.gameOverCommands[0].updateMainName(t('continue'));
		this.gameOverCommands[1].updateMainName(t('title.screen'));
		this.gameOverCommands[2].updateMainName(t('exit'));
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
