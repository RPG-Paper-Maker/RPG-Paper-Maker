/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, Constants, JSONType, Paths, PICTURE_KIND } from '../common';
import { CollisionSquare } from '../core/CollisionSquare';
import { LocalFile } from '../core/LocalFile';
import { Picture2D } from '../core/Picture2D';
import { Point } from '../core/Point';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Asset } from './Asset';

class Picture extends Asset {
	public kind!: PICTURE_KIND;
	public collisionsRepeat!: boolean;
	public collisions!: Map<string, CollisionSquare>;
	public picture!: Picture2D;
	public width!: number;
	public height!: number;
	public isStopAnimation!: boolean;
	public isClimbAnimation!: boolean;

	constructor(kind: PICTURE_KIND) {
		super();
		this.kind = kind;
	}

	public static readonly bindings: BindingType[] = [
		['collisionsRepeat', 'rcol', false, BINDING.BOOLEAN],
		['isStopAnimation', 'isStopAnimation', false, BINDING.BOOLEAN],
		['isClimbAnimation', 'ica', false, BINDING.BOOLEAN],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Picture.bindings, ...additionnalBinding];
	}

	static getFolder(kind: PICTURE_KIND, isBR: boolean, dlc: string): string {
		return Paths.join(
			isBR
				? Project.current?.systems?.PATH_BR
				: dlc
					? Paths.join(Project.current?.systems?.PATH_DLCS, dlc)
					: Project.current?.getPath(),
			this.getLocalFolder(kind),
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

	static createPicture(kind: PICTURE_KIND, id: number, name: string, isBR: boolean, dlc: string): Picture {
		const picture = new Picture(kind);
		picture.applyDefault();
		picture.id = id;
		picture.name = name;
		picture.isBR = isBR;
		picture.dlc = dlc;
		return picture;
	}

	applyDefault(): void {
		super.applyDefault(Picture.getBindings([]));
		this.collisions = new Map();
	}

	getRows(): number {
		return 4 + (this.isStopAnimation ? 4 : 0) + (this.isClimbAnimation ? 4 : 0);
	}

	getPath(local = false): string {
		return this.id === -1 || !this.name
			? ''
			: Paths.join(
					local ? Picture.getLocalFolder(this.kind) : Picture.getFolder(this.kind, this.isBR, this.dlc),
					this.name,
				);
	}

	async getPathOrBase64(): Promise<string> {
		return this.isBR || Constants.IS_DESKTOP ? this.getPath() : ((await LocalFile.readFile(this.getPath())) ?? '');
	}

	async loadPicture() {
		this.picture = await Picture2D.loadImage(this.getPath());
	}

	copy(picture: Picture, additionnalBinding: BindingType[] = []): void {
		super.copy(picture, Picture.getBindings(additionnalBinding));
		this.kind = picture.kind;
		this.collisions = new Map<string, CollisionSquare>(
			[...picture.collisions.entries()].map(([point, collision]) => [point, collision.clone()]),
		);
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Picture.getBindings(additionnalBinding));
		this.collisions = new Map();
		if (json.col) {
			for (const obj of json.col as JSONType[]) {
				const point = new Point();
				point.read(obj.k as number[]);
				const collision = new CollisionSquare();
				collision.read(obj.v as JSONType);
				this.collisions.set(point.toKey(), collision);
			}
		}
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Picture.getBindings(additionnalBinding));
		if (this.collisions.size > 0) {
			const tab: JSONType[] = [];
			for (const [key, collision] of this.collisions.entries()) {
				const obj: JSONType = {};
				obj.k = [];
				const point = Point.fromKey(key);
				point.write(obj.k as number[]);
				obj.v = {};
				collision.write(obj.v as JSONType);
				tab.push(obj);
			}
			json.col = tab;
		}
	}
}

export { Picture };
