/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants } from '../common/Constants';
import { Project } from '../models';

class Portion {
	public x: number;
	public y: number;
	public z: number;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	static getFileName(i: number, j: number, k: number): string {
		return i + '_' + j + '_' + k + '.json';
	}

	static createFromArray(array: number[]): Portion {
		return new Portion(array[0], array[1], array[2]);
	}

	static createFromVector3(position: THREE.Vector3): Portion {
		return new Portion(
			Math.floor(position.x / Project.getSquareSize() / Constants.PORTION_SIZE),
			Math.floor(position.y / Project.getSquareSize() / Constants.PORTION_SIZE),
			Math.floor(position.z / Project.getSquareSize() / Constants.PORTION_SIZE)
		);
	}

	getFileName(): string {
		return Portion.getFileName(this.x, this.y, this.z);
	}

	equals(portion: Portion): boolean {
		return this.x === portion.x && this.y === portion.y && this.z === portion.z;
	}

	read(json: any[]) {
		this.x = json[0];
		this.y = json[1];
		this.z = json[2];
	}

	write(json: any[]) {
		json.push(this.x);
		json.push(this.y);
		json.push(this.z);
	}
}

export { Portion };
