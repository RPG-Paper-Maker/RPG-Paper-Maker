/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Portion } from './Portion';
import { Project } from './Project';

class Position3D extends Portion {
	public yPixels: number;

	constructor(x: number = 0, y: number = 0, z: number = 0, yPixels: number = 0) {
		super(x, y, z);
		this.yPixels = yPixels;
	}

	static getPercentOfPixels(pixels: number) {
		return (pixels / Project.SQUARE_SIZE) * 100;
	}

	addY(y: number, yPixels: number) {
		const sumPixels = this.yPixels + yPixels;
		this.yPixels = sumPixels % 100;
		this.y += y + Math.floor(sumPixels / 100);
	}

	equals(position: Position3D): boolean {
		return super.equals(position) && this.yPixels === position.yPixels;
	}

	read(json: any[]) {
		this.x = json[0];
		this.y = json[1];
		this.yPixels = json[2];
		this.z = json[3];
	}

	write(json: any[]) {
		json.push(this.x);
		json.push(this.y);
		json.push(this.yPixels);
		json.push(this.z);
	}
}

export { Position3D };
