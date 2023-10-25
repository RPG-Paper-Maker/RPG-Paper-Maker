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
import { LocalFile } from '../core/LocalFile';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { FcFolder, FcFile } from 'react-icons/fc';
import { Base } from './Base';
import { BindingType } from '../common/Types';
import { BINDING } from '../common/Enum';

// @ts-expect-error
class TreeMapTag extends Base {
	public saved!: boolean;
	public cameraDistance?: number;
	public cameraHorizontalAngle?: number;
	public cameraVerticalAngle?: number;
	public cursorPosition?: Position;

	public static readonly bindings: BindingType[] = [
		['saved', 's', true, BINDING.BOOLEAN],
		['cameraDistance', 'cd', undefined, BINDING.NUMBER],
		['cameraHorizontalAngle', 'cha', undefined, BINDING.NUMBER],
		['cameraVerticalAngle', 'cva', undefined, BINDING.NUMBER],
		['cursorPosition', 'cp', undefined, BINDING.POSITION],
	];

	public static create(id: number, name: string, saved: boolean) {
		const tag = new TreeMapTag();
		tag.id = id;
		tag.name = name;
		tag.saved = saved;
		return tag;
	}

	static getBindings(additionnalBinding: BindingType[]) {
		return [...TreeMapTag.bindings, ...additionnalBinding];
	}

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

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, TreeMapTag.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, TreeMapTag.getBindings(additionnalBinding));
	}
}

export { TreeMapTag };
