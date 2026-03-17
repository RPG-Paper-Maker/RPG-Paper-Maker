/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

class Point {
	public x: number = 0;
	public y: number = 0;

	constructor(x = 0, y = 0) {
		this.set(x, y);
	}

	static fromKey(key: string): Point {
		const point = new Point();
		point.readFromKey(key);
		return point;
	}

	set(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	equals(point: Point) {
		return this.x === point.x && this.y === point.y;
	}

	toKey(): string {
		return `${this.x}+${this.y}`;
	}

	readFromKey(key: string): void {
		const values = key.split('+');
		this.x = Number(values[0]);
		this.y = Number(values[1]);
	}

	copy(point: Point) {
		this.x = point.x;
		this.y = point.y;
	}

	clone() {
		return new Point(this.x, this.y);
	}

	read(json: number[]) {
		this.x = json[0];
		this.y = json[1];
	}

	write(json: number[]) {
		json[0] = this.x;
		json[1] = this.y;
	}
}

export { Point };
