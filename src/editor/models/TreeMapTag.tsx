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
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { Base } from './Base';
import { FcFolder, FcFile } from 'react-icons/fc';

class TreeMapTag extends Base {
	public static readonly JSON_SAVED = 's';
	public static readonly JSON_CAMERA_DISTANCE = 'cd';
	public static readonly JSON_CAMERA_HORIZONTAL_ANGLE = 'cha';
	public static readonly JSON_CAMERA_VERTICAL_ANGLE = 'cva';
	public static readonly JSON_CURSOR_POSITION = 'cp';
	public static readonly DEFAULT_SAVED = true;
	public static readonly DEFAULT_CAMERA_DISTANCE = undefined;
	public static readonly DEFAULT_CAMERA_HORIZONTAL_ANGLE = undefined;
	public static readonly DEFAULT_CAMERA_VERTICAL_ANGLE = undefined;
	public static readonly DEFAULT_CURSOR_POSITION = undefined;

	public saved = TreeMapTag.DEFAULT_SAVED;
	public cameraDistance?: number;
	public cameraHorizontalAngle?: number;
	public cameraVerticalAngle?: number;
	public cursorPosition?: Position;

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
				await LocalFile.copyFile(pathFileTemp, pathFile);
				await LocalFile.removeFile(pathFileTemp);
			}
			this.saved = true;
		}
	}

	read(json: Record<string, any>) {
		super.read(json);
		this.saved = Utils.defaultValue(json[TreeMapTag.JSON_SAVED], TreeMapTag.DEFAULT_SAVED);
		this.cameraDistance = Utils.defaultValue(
			json[TreeMapTag.JSON_CAMERA_DISTANCE],
			TreeMapTag.DEFAULT_CAMERA_DISTANCE
		);
		this.cameraHorizontalAngle = Utils.defaultValue(
			json[TreeMapTag.JSON_CAMERA_HORIZONTAL_ANGLE],
			TreeMapTag.DEFAULT_CAMERA_HORIZONTAL_ANGLE
		);
		this.cameraVerticalAngle = Utils.defaultValue(
			json[TreeMapTag.JSON_CAMERA_VERTICAL_ANGLE],
			TreeMapTag.DEFAULT_CAMERA_VERTICAL_ANGLE
		);
		if (json[TreeMapTag.JSON_CURSOR_POSITION]) {
			this.cursorPosition = new Position();
			this.cursorPosition.read(json[TreeMapTag.JSON_CURSOR_POSITION]);
		}
	}

	write(json: Record<string, any>) {
		super.write(json);
		Utils.writeDefaultValue(json, TreeMapTag.JSON_SAVED, this.saved, TreeMapTag.DEFAULT_SAVED);
		Utils.writeDefaultValue(
			json,
			TreeMapTag.JSON_CAMERA_DISTANCE,
			this.cameraDistance,
			TreeMapTag.DEFAULT_CAMERA_DISTANCE
		);
		Utils.writeDefaultValue(
			json,
			TreeMapTag.JSON_CAMERA_HORIZONTAL_ANGLE,
			this.cameraHorizontalAngle,
			TreeMapTag.DEFAULT_CAMERA_HORIZONTAL_ANGLE
		);
		Utils.writeDefaultValue(
			json,
			TreeMapTag.JSON_CAMERA_VERTICAL_ANGLE,
			this.cameraVerticalAngle,
			TreeMapTag.DEFAULT_CAMERA_VERTICAL_ANGLE
		);
		if (this.cursorPosition) {
			const jsonObject: any[] = [];
			this.cursorPosition.write(jsonObject);
			json[TreeMapTag.JSON_CURSOR_POSITION] = jsonObject;
		}
	}
}

export { TreeMapTag };
