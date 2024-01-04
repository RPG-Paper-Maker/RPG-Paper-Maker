/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Position } from '../core';

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

	static radiansToDegrees(radians: number): number {
		return radians * (180 / Math.PI);
	}

	static degreesToRadians(degrees: number): number {
		return degrees * (Math.PI / 180);
	}

	static forceDecimals(num: number, decimals = 4): number {
		return parseFloat(num.toFixed(decimals));
	}

	static forceInteger(num: number): number {
		return Math.floor(num);
	}

	static traceLine(previous: Position | null, current: Position) {
		if (previous === null) {
			return [current];
		}
		const positions: Position[] = [];
		let x1 = previous.x;
		const x2 = current.x;
		const y = current.y;
		const yPlus = current.yPixels;
		let z1 = previous.z;
		const z2 = current.z;
		const l = current.layer;
		let dx = x2 - x1;
		let dz = z2 - z1;
		const test = true;
		if (dx !== 0) {
			if (dx > 0) {
				if (dz !== 0) {
					if (dz > 0) {
						if (dx >= dz) {
							let e = dx;
							dx = 2 * e;
							dz = dz * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								x1++;
								if (x1 === x2) {
									break;
								}
								e -= dz;
								if (e < 0) {
									z1++;
									e += dx;
								}
							}
						} else {
							let e = dz;
							dz = 2 * e;
							dx = dx * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								z1++;
								if (z1 === z2) {
									break;
								}
								e -= dx;
								if (e < 0) {
									x1++;
									e += dz;
								}
							}
						}
					} else {
						if (dx >= -dz) {
							let e = dx;
							dx = 2 * e;
							dz = dz * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								x1++;
								if (x1 === x2) {
									break;
								}
								e += dz;
								if (e < 0) {
									z1--;
									e += dx;
								}
							}
						} else {
							let e = dz;
							dz = 2 * e;
							dx = dx * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								z1--;
								if (z1 === z2) {
									break;
								}
								e += dx;
								if (e > 0) {
									x1++;
									e += dz;
								}
							}
						}
					}
				} else {
					while (x1 !== x2) {
						positions.push(new Position(x1, y, yPlus, z1, l));
						x1++;
					}
				}
			} else {
				dz = z2 - z1;
				if (dz !== 0) {
					if (dz > 0) {
						if (-dx >= dz) {
							let e = dx;
							dx = 2 * e;
							dz = dz * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								x1--;
								if (x1 === x2) {
									break;
								}
								e += dz;
								if (e >= 0) {
									z1++;
									e += dx;
								}
							}
						} else {
							let e = dz;
							dz = 2 * e;
							dx = dx * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								z1++;
								if (z1 === z2) {
									break;
								}
								e += dx;
								if (e <= 0) {
									x1--;
									e += dz;
								}
							}
						}
					} else {
						if (dx <= dz) {
							let e = dx;
							dx = 2 * e;
							dz = dz * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								x1--;
								if (x1 === x2) break;
								e -= dz;
								if (e >= 0) {
									z1--;
									e += dx;
								}
							}
						} else {
							let e = dz;
							dz = 2 * e;
							dx = dx * 2;

							while (test) {
								positions.push(new Position(x1, y, yPlus, z1, l));
								z1--;
								if (z1 === z2) break;
								e -= dx;
								if (e >= 0) {
									x1--;
									e += dz;
								}
							}
						}
					}
				} else {
					while (x1 !== x2) {
						positions.push(new Position(x1, y, yPlus, z1, l));
						x1--;
					}
				}
			}
		} else {
			dz = z2 - z1;
			if (dz !== 0) {
				if (dz > 0) {
					while (z1 !== z2) {
						positions.push(new Position(x1, y, yPlus, z1, l));
						z1++;
					}
				} else {
					while (z1 !== z2) {
						positions.push(new Position(x1, y, yPlus, z1, l));
						z1--;
					}
				}
			}
		}
		positions.push(current);
		return positions;
	}
}

export { Mathf };
