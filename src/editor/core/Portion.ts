/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Constants } from '../common';
import { PortionBase } from './PortionBase';
import { Project } from './Project';

class Portion extends PortionBase {
	static getFileName(i: number, j: number, k: number): string {
		return i + '_' + j + '_' + k + '.json';
	}

	static createFromArray(array: number[]): Portion {
		return new Portion(array[0], array[1], array[2]);
	}

	static createFromVector3(position: THREE.Vector3): Portion {
		return new Portion(
			Math.floor(position.x / Project.SQUARE_SIZE / Constants.PORTION_SIZE),
			Math.floor(position.y / Project.SQUARE_SIZE / Constants.PORTION_SIZE),
			Math.floor(position.z / Project.SQUARE_SIZE / Constants.PORTION_SIZE)
		);
	}

	getFileName(): string {
		return Portion.getFileName(this.x, this.y, this.z);
	}

	toKey(): string {
		return super.toKey();
	}

	static fromKey(key: string): Portion {
		const portion = new Portion();
		portion.readFromKey(key);
		return portion;
	}

	readFromKey(key: string): void {
		const values = key.split('+');
		this.x = Number(values[0]);
		this.y = Number(values[1]);
		this.z = Number(values[3]);
	}

	equals(portion: Portion): boolean {
		return this.x === portion.x && this.y === portion.y && this.z === portion.z;
	}

	read(json: number[]) {
		this.x = json[0];
		this.y = json[1];
		this.z = json[2];
	}

	write(json: number[]) {
		json.push(this.x);
		json.push(this.y);
		json.push(this.z);
	}
}

export { Portion };
