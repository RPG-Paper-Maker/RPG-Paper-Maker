/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Rectangle } from './Rectangle';

class TextureBundle {
	public list: any[][];
	public material: THREE.MeshPhongMaterial | null;
	public beginID!: number;
	public beginPoint!: number[];
	public endID!: number;
	public endPoint!: number[];
	public isAnimated!: boolean;

	constructor() {
		this.list = [];
		this.material = null;
	}

	setBegin(id: number, point: number[]) {
		this.beginID = id;
		this.beginPoint = point;
	}

	setEnd(id: number, point: number[]) {
		this.endID = id;
		this.endPoint = point;
	}

	isSup(rect: Rectangle | undefined, point: number[]): boolean {
		if (!rect) {
			return true;
		}
		if (rect.y > point[1]) {
			return true;
		} else if (rect.y === point[1]) {
			return rect.x >= point[0];
		}
		return false;
	}

	isInf(rect: Rectangle | undefined, point: number[]): boolean {
		if (!rect) {
			return true;
		}
		if (rect.y < point[1]) {
			return true;
		} else if (rect.y === point[1]) {
			return rect.x <= point[0];
		}
		return false;
	}

	isInTexture(id: number, rect?: Rectangle): boolean {
		if (id >= this.beginID && id <= this.endID) {
			if (id === this.beginID) {
				return id === this.endID
					? this.isSup(rect, this.beginPoint) && this.isInf(rect, this.endPoint)
					: this.isSup(rect, this.beginPoint);
			} else if (id < this.endID) {
				return true;
			} else {
				return this.isInf(rect, this.endPoint);
			}
		}
		return false;
	}

	addToList(id: number, point: number[]) {
		this.list.push([id, point]);
	}

	getOffset(id: number, rect?: Rectangle): number {
		let pair: any, point: number[];
		for (let i = 0, l = this.list.length; i < l; i++) {
			pair = this.list[i];
			point = pair[1];
			if (id === pair[0] && (!rect || (point[0] === rect.x && point[1] === rect.y))) {
				return i;
			}
		}
		return -1;
	}
}

export { TextureBundle };
