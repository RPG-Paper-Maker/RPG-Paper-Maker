/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, PictureKind } from '../common/Enum';
import { Paths } from '../common/Paths';
import { BindingType } from '../common/Types';
import { CollisionSquare } from '../core/CollisionSquare';
import { Picture2D } from '../core/Picture2D';
import { Project } from '../core/Project';
import { Base } from './Base';

class Picture extends Base {
	public kind!: PictureKind;
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

	constructor(kind: PictureKind) {
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

	static pictureKindToString(kind: PictureKind): string {
		switch (kind) {
			case PictureKind.Bars:
				return 'bar';
			case PictureKind.Icons:
				return 'icon';
			case PictureKind.Autotiles:
				return 'autotile';
			case PictureKind.Characters:
				return 'character';
			case PictureKind.Mountains:
				return 'mountain';
			case PictureKind.Tilesets:
				return 'tileset';
			case PictureKind.Walls:
				return 'wall';
			case PictureKind.Battlers:
				return 'battler';
			case PictureKind.Facesets:
				return 'faceset';
			case PictureKind.WindowSkins:
				return 'window skin';
			case PictureKind.TitleScreen:
				return 'title screen';
			case PictureKind.Objects3D:
				return 'object 3D';
			case PictureKind.Pictures:
				return 'picture';
			case PictureKind.Animations:
				return 'animation';
			case PictureKind.Skyboxes:
				return 'skybox';
			case PictureKind.Particles:
				return 'particles';
		}
		return '';
	}

	static getFolder(kind: PictureKind, isBR: boolean, dlc: string): string {
		return (
			(isBR
				? Project.current!.systems.PATH_BR
				: dlc
				? `${Project.current!.systems.PATH_DLCS}/${dlc}`
				: Paths.ROOT_DIRECTORY_LOCAL) + this.getLocalFolder(kind)
		);
	}

	static getLocalFolder(kind: PictureKind): string {
		switch (kind) {
			case PictureKind.Bars:
				return Paths.BARS;
			case PictureKind.Icons:
				return Paths.ICONS;
			case PictureKind.Autotiles:
				return Paths.AUTOTILES;
			case PictureKind.Characters:
				return Paths.CHARACTERS;
			case PictureKind.Mountains:
				return Paths.MOUNTAINS;
			case PictureKind.Tilesets:
				return Paths.TILESETS;
			case PictureKind.Walls:
				return Paths.WALLS;
			case PictureKind.Battlers:
				return Paths.BATTLERS;
			case PictureKind.Facesets:
				return Paths.FACESETS;
			case PictureKind.WindowSkins:
				return Paths.WINDOW_SKINS;
			case PictureKind.TitleScreen:
				return Paths.TITLE_SCREEN;
			case PictureKind.Objects3D:
				return Paths.OBJECTS_3D;
			case PictureKind.Pictures:
				return Paths.HUD_PICTURES;
			case PictureKind.Animations:
				return Paths.ANIMATIONS;
			case PictureKind.Skyboxes:
				return Paths.SKYBOXES;
			case PictureKind.Particles:
				return Paths.PARTICLES;
			case PictureKind.GameOver:
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
