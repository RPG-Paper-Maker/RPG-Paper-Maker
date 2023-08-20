/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Anchor2D } from './Anchor2D';

class Rectangle {
	public x: number = 0;
	public y: number = 0;
	public width: number = 1;
	public height: number = 1;
	public anchor: Anchor2D;

	constructor(x = 0, y = 0, width = 1, height = 1) {
		this.setCoords(x, y, width, height);
		const anchorX = Anchor2D.MIDDLE_BOTTOM.x;
		const anchorY = Anchor2D.MIDDLE_BOTTOM.y;
		this.anchor = new Anchor2D(anchorX, anchorY);
	}

	move(x: number, y: number) {
		this.x = x + this.width * this.anchor.x;
		this.y = y + this.height * this.anchor.y;
	}

	resize(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	set(x: number, y: number, width: number, height: number) {
		this.move(x, y);
		this.resize(width, height);
	}

	setCoords(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	setAnchor(x: number, y: number) {
		this.anchor.set({ x, y });
	}

	presetAnchor(anchorPreset: { x: number; y: number }) {
		this.anchor.set(anchorPreset);
	}

	isInside(x: number, y: number): boolean {
		return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
	}

	equals(rect: Rectangle) {
		return this.x === rect.x && this.y === rect.y && this.width === rect.width && this.height === rect.height;
	}

	read(json: any) {
		this.x = json[0];
		this.y = json[1];
		if (json.length === 2) {
			this.width = 1;
			this.height = 1;
		} else {
			this.width = json[2];
			this.height = json[3];
		}
	}

	write(json: any[]) {
		json[0] = this.x;
		json[1] = this.y;
		json[2] = this.width;
		json[3] = this.height;
	}
}

export { Rectangle };
