/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

class PortionBase {
	public x: number;
	public y: number;
	public z: number;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	toKey(): string {
		return [this.x, this.y, this.z].join('+');
	}

	readFromKey(key: string): void {
		const values = key.split('+');
		this.x = Number(values[0]);
		this.y = Number(values[1]);
		this.z = Number(values[3]);
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

export { PortionBase };
