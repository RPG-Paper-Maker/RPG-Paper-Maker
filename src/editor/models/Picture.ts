/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from './Base';
import { BINDING, BindingType, Paths, PICTURE_KIND } from '../common';
import { CollisionSquare, Picture2D, Project } from '../core';

class Picture extends Base {
	public kind!: PICTURE_KIND;
	public isBR!: boolean;
	public dlc!: string;
	public jsonCollisions!: Record<string, any>[];
	public collisionsRepeat!: boolean;
	public collisions!: CollisionSquare[];
	public picture!: Picture2D;
	public width!: number;
	public height!: number;
	public isStopAnimation!: boolean;
	public isClimbAnimation!: boolean;
	public borderLeft!: number;
	public borderRight!: number;

	constructor(kind: PICTURE_KIND) {
		super();
		this.kind = kind;
	}

	public static readonly bindings: BindingType[] = [
		['isBR', 'br', undefined, BINDING.BOOLEAN],
		['dlc', 'd', '', BINDING.STRING],
		['jsonCollisions', 'col', [], BINDING.LIST, CollisionSquare],
		['collisionsRepeat', 'rcol', false, BINDING.BOOLEAN],
		['isStopAnimation', 'isStopAnimation', false, BINDING.BOOLEAN],
		['isClimbAnimation', 'ica', false, BINDING.BOOLEAN],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Picture.bindings, ...additionnalBinding];
	}

	static getFolder(kind: PICTURE_KIND, isBR: boolean, dlc: string): string {
		return (
			(isBR
				? Project.current!.systems.PATH_BR
				: dlc
				? `${Project.current!.systems.PATH_DLCS}/${dlc}`
				: Paths.ROOT_DIRECTORY_LOCAL) + this.getLocalFolder(kind)
		);
	}

	static getLocalFolder(kind: PICTURE_KIND): string {
		switch (kind) {
			case PICTURE_KIND.BARS:
				return Paths.BARS;
			case PICTURE_KIND.ICONS:
				return Paths.ICONS;
			case PICTURE_KIND.AUTOTILES:
				return Paths.AUTOTILES;
			case PICTURE_KIND.CHARACTERS:
				return Paths.CHARACTERS;
			case PICTURE_KIND.MOUNTAINS:
				return Paths.MOUNTAINS;
			case PICTURE_KIND.TILESETS:
				return Paths.TILESETS;
			case PICTURE_KIND.WALLS:
				return Paths.WALLS;
			case PICTURE_KIND.BATTLERS:
				return Paths.BATTLERS;
			case PICTURE_KIND.FACESETS:
				return Paths.FACESETS;
			case PICTURE_KIND.WINDOW_SKINS:
				return Paths.WINDOW_SKINS;
			case PICTURE_KIND.TITLE_SCREENS:
				return Paths.TITLE_SCREEN;
			case PICTURE_KIND.OBJECTS_3D:
				return Paths.OBJECTS_3D;
			case PICTURE_KIND.PICTURES:
				return Paths.HUD_PICTURES;
			case PICTURE_KIND.ANIMATIONS:
				return Paths.ANIMATIONS;
			case PICTURE_KIND.SKYBOXES:
				return Paths.SKYBOXES;
			case PICTURE_KIND.PARTICLES:
				return Paths.PARTICLES;
			case PICTURE_KIND.GAME_OVERS:
				return Paths.GAME_OVER;
		}
		return '';
	}

	getPath(): string {
		return this.id === -1 || !this.name ? '' : Picture.getFolder(this.kind, this.isBR, this.dlc) + '/' + this.name;
	}

	async loadPicture() {
		this.picture = await Picture2D.loadImage(this.getPath());
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Picture.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Picture.getBindings(additionnalBinding));
	}
}

export { Picture };
