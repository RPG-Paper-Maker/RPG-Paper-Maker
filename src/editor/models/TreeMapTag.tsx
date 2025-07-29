/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JSX } from 'react';
import { FcFile, FcFolder } from 'react-icons/fc';
import { BINDING, JSONType, Paths } from '../common';
import { copyFile, getFiles, removeFile } from '../common/Platform';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Model } from '../Editor';
import { Base } from './Base';

class TreeMapTag extends Base {
	public static type = 'TreeMapTag';
	public saved!: boolean;
	public cameraDistance?: number;
	public cameraHorizontalAngle?: number;
	public cameraVerticalAngle?: number;
	public cursorPosition?: Position;
	public path?: string;

	public static readonly bindings: BindingType[] = [
		['saved', 's', true, BINDING.BOOLEAN],
		['cameraDistance', 'cd', undefined, BINDING.NUMBER],
		['cameraHorizontalAngle', 'cha', undefined, BINDING.NUMBER],
		['cameraVerticalAngle', 'cva', undefined, BINDING.NUMBER],
		['cursorPosition', 'cp', undefined, BINDING.POSITION, undefined, undefined, Position],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...TreeMapTag.bindings, ...additionnalBinding];
	}

	public static create(id: number, name: string, saved = true, path?: string): TreeMapTag {
		const tag = new TreeMapTag();
		tag.id = id;
		tag.name = name;
		tag.saved = saved;
		tag.path = path;
		return tag;
	}

	canExpand(): boolean {
		return this.isFolder();
	}

	getIcon(): JSX.Element {
		return this.isFolder() ? <FcFolder /> : <FcFile />;
	}

	toString(): string {
		return `${this.name}${this.saved ? '' : ' *'}`;
	}

	async saveFiles() {
		if (Project.current && !this.isFolder()) {
			const path = Paths.join(Project.current.getPathMaps(), Model.Map.generateMapName(this.id));
			const pathTemp = Paths.join(path, Paths.TEMP);
			const fileNames = await getFiles(pathTemp);
			for (const fileName of fileNames) {
				const pathFileTemp = Paths.join(pathTemp, fileName);
				const pathFile = Paths.join(path, fileName);
				await copyFile(pathFileTemp, pathFile);
				await removeFile(pathFileTemp);
			}
		}
		this.saved = true;
	}

	copy(tag: TreeMapTag): void {
		super.copy(tag);
		this.saved = tag.saved;
		this.cameraDistance = tag.cameraDistance;
		this.cameraHorizontalAngle = tag.cameraHorizontalAngle;
		this.cameraVerticalAngle = tag.cameraVerticalAngle;
		this.cursorPosition = tag.cursorPosition?.clone() ?? undefined;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, TreeMapTag.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, TreeMapTag.getBindings(additionnalBinding));
	}
}

export { TreeMapTag };
