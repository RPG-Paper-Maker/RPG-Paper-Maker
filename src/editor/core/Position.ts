/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Model } from '../Editor';
import { Position3D } from './Position3D';
import { Portion, Project } from '.';
import { Constants, Mathf } from '../common';

class Position extends Position3D {
	public layer: number;
	public centerX: number;
	public centerZ: number;
	public angleY: number;
	public angleX: number;
	public angleZ: number;
	public scaleX: number;
	public scaleY: number;
	public scaleZ: number;

	constructor(
		x: number = 0,
		y: number = 0,
		yPixels: number = 0,
		z: number = 0,
		layer: number = 0,
		centerX: number = 50,
		centerZ: number = 50,
		angleY: number = 0,
		angleX: number = 0,
		angleZ: number = 0,
		scaleX: number = 1,
		scaleY: number = 1,
		scaleZ: number = 1
	) {
		super(x, y, z, yPixels);

		this.layer = layer;
		this.centerX = centerX;
		this.centerZ = centerZ;
		this.angleY = angleY;
		this.angleX = angleX;
		this.angleZ = angleZ;
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.scaleZ = scaleZ;
	}

	static createFromArray(array: number[]): Position {
		return new Position(
			array[0],
			array[1],
			array[3],
			array[2],
			array[4],
			array[5],
			array[6],
			array[7],
			array[8],
			array[9],
			array[10],
			array[11],
			array[12]
		);
	}

	static createFromVector3(position: THREE.Vector3, rotation?: THREE.Euler, scale?: THREE.Vector3): Position {
		return new Position(
			Math.floor(position.x / Project.SQUARE_SIZE),
			Math.floor(position.y / Project.SQUARE_SIZE),
			((Math.round(position.y) % Project.SQUARE_SIZE) / Project.SQUARE_SIZE) * 100,
			Math.floor(position.z / Project.SQUARE_SIZE),
			0,
			(Math.round(position.x % Project.SQUARE_SIZE) / Project.SQUARE_SIZE) * 100,
			(Math.round(position.z % Project.SQUARE_SIZE) / Project.SQUARE_SIZE) * 100,
			rotation ? Mathf.forceDecimals(Mathf.radiansToDegrees(rotation.y)) : undefined,
			rotation ? Mathf.forceDecimals(Mathf.radiansToDegrees(rotation.x)) : undefined,
			rotation ? Mathf.forceDecimals(Mathf.radiansToDegrees(rotation.z)) : undefined,
			scale ? Mathf.forceDecimals(scale.x) : undefined,
			scale ? Mathf.forceDecimals(scale.y) : undefined,
			scale ? Mathf.forceDecimals(scale.z) : undefined
		);
	}

	getTotalX(): number {
		return this.x * Project.SQUARE_SIZE + this.getPixelsCenterX();
	}

	getTotalY(): number {
		return this.y * Project.SQUARE_SIZE + this.getTotalYPixels();
	}

	getTotalZ(): number {
		return this.z * Project.SQUARE_SIZE + this.getPixelsCenterZ();
	}

	getTotalYPixels(): number {
		return Math.round((this.yPixels * Project.SQUARE_SIZE) / 100);
	}

	getPixelsCenterX(): number {
		return Math.floor((this.centerX * Project.SQUARE_SIZE) / 100);
	}

	getPixelsCenterZ(): number {
		return Math.floor((this.centerZ * Project.SQUARE_SIZE) / 100);
	}

	getGlobalPortion(): Portion {
		return new Portion(
			Math.floor(this.x / Constants.PORTION_SIZE),
			Math.floor(this.y / Constants.PORTION_SIZE),
			Math.floor(this.z / Constants.PORTION_SIZE)
		);
	}

	isInMap(map: Model.Map, allowBorders = false, isCursor = false) {
		return (
			this.x >= 0 &&
			(this.x < map.length + (isCursor ? 1 : 0) ||
				(allowBorders && this.x >= map.length && this.angleY === 90 && this.centerX === 0)) &&
			this.y >= -map.depth &&
			this.y < map.height &&
			this.z >= 0 &&
			(this.z < map.width + (isCursor ? 1 : 0) ||
				(allowBorders && this.z >= map.width && this.angleY === 0 && this.centerZ === 0))
		);
	}

	applyCoords(x: number, y: number, yPixels: number, z: number): Position {
		this.x = x;
		this.y = y;
		this.yPixels = yPixels;
		this.z = z;
		return this;
	}

	updateYPixels(pixels: number) {
		this.yPixels = (Math.max(Math.min(pixels, Project.SQUARE_SIZE - 1), 0) / Project.SQUARE_SIZE) * 100;
	}

	isHorizontal() {
		return this.angleY === 0;
	}

	setHorizontal() {
		this.centerX = 50;
		this.centerZ = 0;
		this.angleY = 0;
	}

	setVertical() {
		this.centerX = 0;
		this.centerZ = 50;
		this.angleY = 90;
	}

	getSquareLeft() {
		const position = this.clone();
		position.x--;
		return position;
	}

	getSquareRight() {
		const position = this.clone();
		position.x++;
		return position;
	}

	getSquareTop() {
		const position = this.clone();
		position.z--;
		return position;
	}

	getSquareBot() {
		const position = this.clone();
		position.z++;
		return position;
	}

	getLeft() {
		const position = this.clone();
		if (position.isHorizontal()) {
			position.x--;
		} else {
			position.z++;
		}
		return position;
	}

	getRight() {
		const position = this.clone();
		if (position.isHorizontal()) {
			position.x++;
		} else {
			position.z--;
		}
		return position;
	}

	getTopLeft() {
		const position = this.clone();
		if (position.isHorizontal()) {
			position.z--;
			position.setVertical();
		} else {
			position.x--;
			position.z++;
			position.setHorizontal();
		}
		return position;
	}

	getTopRight() {
		const position = this.clone();
		if (position.isHorizontal()) {
			position.x++;
			position.z--;
			position.setVertical();
		} else {
			position.x--;
			position.setHorizontal();
		}
		return position;
	}

	getBotLeft() {
		const position = this.clone();
		if (position.isHorizontal()) {
			position.setVertical();
		} else {
			position.z++;
			position.setHorizontal();
		}
		return position;
	}

	getBotRight() {
		const position = this.clone();
		position.copy(position);
		if (position.isHorizontal()) {
			position.x++;
			position.setVertical();
		} else {
			position.setHorizontal();
		}
		return position;
	}

	getPositionsRectangle(position: Position) {
		const positions = [];
		for (let x = Math.min(this.x, position.x), endX = Math.max(this.x, position.x); x <= endX; x++) {
			for (let z = Math.min(this.z, position.z), endZ = Math.max(this.z, position.z); z <= endZ; z++) {
				const p = this.clone();
				p.x = x;
				p.z = z;
				positions.push(p);
			}
		}
		return positions;
	}

	toStringCoords() {
		const yPixels = this.getTotalYPixels();
		return `[X = ${this.x}, Y = ${this.y}${yPixels === 0 ? '' : ` (+${yPixels}px)`}, Z = ${this.z}]`;
	}

	toString() {
		return `${this.toStringCoords()}\nLayer = ${this.layer}\nAngles = [${this.angleX}, ${this.angleY}, ${
			this.angleZ
		}]\nScales = [${this.scaleX}, ${this.scaleY}, ${
			this.scaleZ
		}]\nCenter = [X = ${this.getPixelsCenterX()}px, Z = ${this.getPixelsCenterZ()}px]`;
	}

	toVector3(center: boolean = true): THREE.Vector3 {
		return new THREE.Vector3(
			this.x * Project.SQUARE_SIZE + (center ? this.getPixelsCenterX() : 0),
			this.y * Project.SQUARE_SIZE + this.getTotalYPixels(),
			this.z * Project.SQUARE_SIZE + (center ? this.getPixelsCenterZ() : 0)
		);
	}

	toRotationEuler(): THREE.Euler {
		return new THREE.Euler(
			Mathf.degreesToRadians(this.angleX),
			Mathf.degreesToRadians(this.angleY),
			Mathf.degreesToRadians(this.angleZ)
		);
	}

	toScaleVector(): THREE.Vector3 {
		return new THREE.Vector3(this.scaleX, this.scaleY, this.scaleZ);
	}

	toKey(): string {
		return [
			this.x,
			this.y,
			this.yPixels,
			this.z,
			this.layer,
			this.centerX,
			this.centerZ,
			this.angleY,
			this.angleX,
			this.angleZ,
			this.scaleX,
			this.scaleY,
			this.scaleZ,
		].join('+');
	}

	equals(position: Position): boolean {
		return (
			super.equals(position) &&
			this.layer === position.layer &&
			this.centerX === position.centerX &&
			this.centerZ === position.centerZ &&
			this.angleY === position.angleY &&
			this.angleX === position.angleX &&
			this.angleZ === position.angleZ &&
			this.scaleX === position.scaleX &&
			this.scaleY === position.scaleY &&
			this.scaleZ === position.scaleZ
		);
	}

	fromKey(key: string) {
		const values = key.split('+');
		this.x = Number(values[0]);
		this.y = Number(values[1]);
		this.yPixels = Number(values[2]);
		this.z = Number(values[3]);
		this.layer = Number(values[4]);
		this.centerX = Number(values[5]);
		this.centerZ = Number(values[6]);
		this.angleY = Number(values[7]);
		this.angleX = Number(values[8]);
		this.angleZ = Number(values[9]);
		this.scaleX = Number(values[10]);
		this.scaleY = Number(values[11]);
		this.scaleZ = Number(values[12]);
	}

	copy(position: Position) {
		this.x = position.x;
		this.y = position.y;
		this.yPixels = position.yPixels;
		this.z = position.z;
		this.layer = position.layer;
		this.centerX = position.centerX;
		this.centerZ = position.centerZ;
		this.angleY = position.angleY;
		this.angleX = position.angleX;
		this.angleZ = position.angleZ;
		this.scaleX = position.scaleX;
		this.scaleY = position.scaleY;
		this.scaleZ = position.scaleZ;
	}

	clone() {
		const position = new Position();
		position.copy(this);
		return position;
	}

	read(json: any[]) {
		super.read(json);
		this.layer = json[4];
		if (json.length > 5) {
			this.centerX = json[5];
			this.centerZ = json[6];
			this.angleY = json[7];
			if (json.length > 8) {
				this.angleX = json[8];
				this.angleZ = json[9];
				if (json.length > 10) {
					this.scaleX = json[10];
					this.scaleY = json[11];
					this.scaleZ = json[12];
				}
			}
		}
	}

	write(json: any[]) {
		super.write(json);
		json.push(this.layer);
		if (
			this.centerX !== 50.0 ||
			this.centerZ !== 50.0 ||
			this.angleY !== 0.0 ||
			this.angleX !== 0.0 ||
			this.angleZ !== 0.0 ||
			this.scaleX !== 1.0 ||
			this.scaleY !== 1.0 ||
			this.scaleZ !== 1.0
		) {
			json.push(this.centerX);
			json.push(this.centerZ);
			json.push(this.angleY);
			if (
				this.angleX !== 0.0 ||
				this.angleZ !== 0.0 ||
				this.scaleX !== 1.0 ||
				this.scaleY !== 1.0 ||
				this.scaleZ !== 1.0
			) {
				json.push(this.angleX);
				json.push(this.angleZ);
				if (this.scaleX !== 1.0 || this.scaleY !== 1.0 || this.scaleZ !== 1.0) {
					json.push(this.scaleX);
					json.push(this.scaleY);
					json.push(this.scaleZ);
				}
			}
		}
	}
}

export { Position };
