/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths } from '../common/Paths';
import { Utils } from '../common/Utils';
import { Project } from '../core/Project';
import { Serializable } from '../core/Serializable';

class Settings extends Serializable {
	public static readonly JSON_PROJECT_MENU_INDEX = 'pmi';
	public static readonly JSON_MAP_EDITOR_MENU_INDEX = 'memi';
	public static readonly DEFAULT_PROJECT_MENU_INDEX = 1;
	public static readonly DEFAULT_MAP_EDITOR_MENU_INDEX = 0;

	public projectMenuIndex!: number;
	public mapEditorMenuIndex!: number;

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SETTINGS);
	}

	read(json: any) {
		this.projectMenuIndex = Utils.defaultValue(
			json[Settings.JSON_PROJECT_MENU_INDEX],
			Settings.DEFAULT_PROJECT_MENU_INDEX
		);
		this.mapEditorMenuIndex = Utils.defaultValue(
			json[Settings.JSON_MAP_EDITOR_MENU_INDEX],
			Settings.DEFAULT_MAP_EDITOR_MENU_INDEX
		);
	}

	write(json: any) {
		Utils.writeDefaultValue(
			json,
			Settings.JSON_PROJECT_MENU_INDEX,
			this.projectMenuIndex,
			Settings.DEFAULT_PROJECT_MENU_INDEX
		);
		Utils.writeDefaultValue(
			json,
			Settings.JSON_MAP_EDITOR_MENU_INDEX,
			this.mapEditorMenuIndex,
			Settings.DEFAULT_MAP_EDITOR_MENU_INDEX
		);
	}
}

export { Settings };
