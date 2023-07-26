/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

class Mathf {
	static clamp(value: number, min: number, max: number): number {
		return value <= min ? min : value >= max ? max : value;
	}

	static cos(v: number): number {
		return parseFloat(Math.cos(v).toFixed(10));
	}

	static sin(v: number): number {
		return parseFloat(Math.sin(v).toFixed(10));
	}

	static mod(x: number, m: number): number {
		const r = x % m;
		return r < 0 ? r + m : r;
	}
}

export { Mathf };
