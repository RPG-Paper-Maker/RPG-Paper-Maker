/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

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
import { Constants } from '../common';

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

	static createFromVector3(position: THREE.Vector3): Position {
		return new Position(
			Math.floor(position.x / Project.SQUARE_SIZE),
			Math.floor(position.y / Project.SQUARE_SIZE),
			Math.floor(position.z / Project.SQUARE_SIZE)
		);
	}

	getTotalY(): number {
		return this.y * Project.SQUARE_SIZE + this.getTotalYPixels();
	}

	getTotalYPixels(): number {
		return Math.floor((this.yPixels * Project.SQUARE_SIZE) / 100);
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

	isInMap(map: Model.Map, allowBorders = false) {
		return (
			this.x >= 0 &&
			this.x < map.length + (allowBorders ? 1 : 0) &&
			this.y >= -map.depth &&
			this.y < map.height &&
			this.z >= 0 &&
			this.z < map.width + (allowBorders ? 1 : 0)
		);
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

	toStringCoords() {
		const yPixels = this.getTotalYPixels();
		return `X = ${this.x}\nY = ${this.y}${yPixels === 0 ? '' : ` (+${yPixels}px)`}\nZ = ${this.z}`;
	}

	toString() {
		return `${this.toStringCoords()}\nLayer = ${this.layer}\nAngles = [${this.angleX}, ${this.angleY}, ${
			this.angleZ
		}]\nScales = [${this.scaleX}, ${this.scaleY}, ${
			this.scaleZ
		}]\nCenter X = ${this.getPixelsCenterX()}px\nCenter Z = ${this.getPixelsCenterZ()}px`;
	}

	toVector3(center: boolean = true): THREE.Vector3 {
		return new THREE.Vector3(
			this.x * Project.SQUARE_SIZE + (center ? this.getPixelsCenterX() : 0),
			this.y * Project.SQUARE_SIZE + this.getTotalYPixels(),
			this.z * Project.SQUARE_SIZE + (center ? this.getPixelsCenterZ() : 0)
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
		this.x = parseInt(values[0], 10);
		this.y = parseInt(values[1], 10);
		this.yPixels = parseInt(values[2], 10);
		this.z = parseInt(values[3], 10);
		this.layer = parseInt(values[4], 10);
		this.centerX = parseInt(values[5], 10);
		this.centerZ = parseInt(values[6], 10);
		this.angleY = parseInt(values[7], 10);
		this.angleX = parseInt(values[8], 10);
		this.angleZ = parseInt(values[9], 10);
		this.scaleX = parseInt(values[10], 10);
		this.scaleY = parseInt(values[11], 10);
		this.scaleZ = parseInt(values[12], 10);
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
