/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { Paths } from '../common/Paths';
import { Utils } from '../common/Utils';
import { LocalFile } from '../core/LocalFile';
import { Project } from '../core/Project';
import { Base } from './Base';
import { FcFolder, FcFile } from 'react-icons/fc';

class TreeMapTag extends Base {
	public static readonly JSON_SAVED = 's';
	public static readonly DEFAULT_SAVED = true;

	public saved: boolean = TreeMapTag.DEFAULT_SAVED;

	isFolder() {
		return this.id < 0;
	}

	getIcon() {
		return this.isFolder() ? <FcFolder /> : <FcFile />;
	}

	toString(): string {
		return `${super.toString()}${this.saved ? '' : ' *'}`;
	}

	async saveFiles() {
		if (Project.current) {
			const path = Paths.join(Project.current.getPathMaps(), Model.Map.generateMapName(this.id));
			const pathTemp = Paths.join(path, Paths.TEMP);
			const fileNames = await LocalFile.getFiles(pathTemp);
			for (const fileName of fileNames) {
				const pathFileTemp = Paths.join(pathTemp, fileName);
				const pathFile = Paths.join(path, fileName);
				LocalFile.copyFile(pathFileTemp, pathFile);
				LocalFile.removeFile(pathFileTemp);
			}
			this.saved = true;
		}
	}

	read(json: Record<string, any>) {
		super.read(json);
		this.saved = Utils.defaultValue(json[TreeMapTag.JSON_SAVED], TreeMapTag.DEFAULT_SAVED);
	}

	write(json: Record<string, any>) {
		super.write(json);
		Utils.writeDefaultValue(json, TreeMapTag.JSON_SAVED, this.saved, TreeMapTag.DEFAULT_SAVED);
	}
}

export { TreeMapTag };
