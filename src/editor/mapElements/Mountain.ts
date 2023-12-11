/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { MapElement, Model } from '../Editor';
import { BINDING, BindingType, Constants, ELEMENT_MAP_KIND, Utils } from '../common';
import { CustomGeometry, Portion, Position, Project, TextureBundle } from '../core';
import { Base } from './Base';
import { Mountains } from './Mountains';

class Mountain extends Base {
	public static X_LEFT_OFFSET = 0;
	public static X_MID_OFFSET = 1;
	public static X_RIGHT_OFFSET = 2;
	public static X_MIX_OFFSET = 3;
	public static Y_TOP_OFFSET = 0;
	public static Y_MID_OFFSET = 1;
	public static Y_BOT_OFFSET = 2;
	public static Y_MIX_OFFSET = 3;

	public mountainID!: number;
	public widthSquares!: number;
	public widthPixels!: number;
	public heightSquares!: number;
	public heightPixels!: number;
	public top!: boolean;
	public bot!: boolean;
	public left!: boolean;
	public right!: boolean;
	public angle!: number;

	public static readonly bindings: BindingType[] = [
		['mountainID', 'sid', -1, BINDING.NUMBER],
		['widthSquares', 'ws', 0, BINDING.NUMBER],
		['widthPixels', 'wp', 0, BINDING.NUMBER],
		['heightSquares', 'hs', 1, BINDING.NUMBER],
		['heightPixels', 'hp', 0, BINDING.NUMBER],
		['top', 't', false, BINDING.BOOLEAN],
		['bot', 'b', false, BINDING.BOOLEAN],
		['left', 'l', false, BINDING.BOOLEAN],
		['right', 'r', false, BINDING.BOOLEAN],
	];

	constructor() {
		super();
		this.kind = ELEMENT_MAP_KIND.MOUNTAIN;
	}

	static getBindings(additionnalBinding: BindingType[]): BindingType[] {
		return [...Mountain.bindings, ...additionnalBinding];
	}

	static fromJSON(json: Record<string, any>): MapElement.Mountain {
		const mountain = new MapElement.Mountain();
		if (json) {
			mountain.read(json);
		}
		return mountain;
	}

	static create(
		mountainID: number,
		widthSquares: number,
		widthPixels: number,
		heightSquares: number,
		heightPixels: number
	): MapElement.Mountain {
		const mountain = new MapElement.Mountain();
		mountain.mountainID = mountainID;
		mountain.widthSquares = widthSquares;
		mountain.widthPixels = widthPixels;
		mountain.heightSquares = heightSquares;
		mountain.heightPixels = heightPixels;
		return mountain;
	}

	equals(mapElement: MapElement.Base): boolean {
		if (mapElement.kind === this.kind) {
			const mountain = mapElement as MapElement.Mountain;
			return (
				mountain.mountainID === this.mountainID &&
				mountain.widthSquares === this.widthSquares &&
				mountain.widthPixels === this.widthPixels &&
				mountain.heightSquares === this.heightSquares &&
				mountain.heightPixels === this.heightPixels
			);
		} else {
			return false;
		}
	}

	toString(): string {
		return `MOUNTAIN | ID: ${Utils.formatNumberID(
			this.mountainID
		)} | W:${this.getWidthTotalPixels()}px | H:${this.getHeightTotalPixels()}px`;
	}

	getTotalSquaresWidth(): number {
		return this.widthSquares + (this.getWidthOnlyPixels() > 0 ? 1 : 0);
	}

	getTotalSquaresHeight(yPixels: number): number {
		return this.heightSquares + (this.getHeightOnlyPixels() + yPixels > 0 ? 1 : 0);
	}

	getWidthOnlyPixels(): number {
		return Math.round((this.widthPixels * Project.getSquareSize()) / 100);
	}

	getHeightOnlyPixels(): number {
		return Math.round((this.heightPixels * Project.getSquareSize()) / 100);
	}

	getWidthTotalPixels(): number {
		return this.widthSquares * Project.getSquareSize() + this.getWidthOnlyPixels();
	}

	getHeightTotalPixels(): number {
		return this.heightSquares * Project.getSquareSize() + this.getHeightOnlyPixels();
	}

	getModel(): Model.Mountain {
		return Project.current!.specialElements.getMountainByID(this.mountainID);
	}

	drawEntireFaces(
		position: Position,
		left: boolean,
		right: boolean,
		angle: number,
		center: THREE.Vector3,
		width: number,
		height: number,
		w: number,
		faceHeight: number,
		wp: number,
		xLeft: number,
		xRight: number,
		yTop: number,
		yBot: number,
		zFront: number,
		zBack: number,
		vecFrontA: THREE.Vector3,
		vecBackA: THREE.Vector3,
		vecFrontB: THREE.Vector3,
		vecBackB: THREE.Vector3,
		geometry: CustomGeometry,
		count: number
	): number {
		let xKind = Mountain.X_LEFT_OFFSET;
		const nbSteps = Math.ceil(faceHeight / Project.getSquareSize());
		const vecCenterA = vecFrontA.clone().addScaledVector(vecBackA.clone().sub(vecFrontA), 0.5);
		const vecCenterB = vecFrontB.clone().addScaledVector(vecBackB.clone().sub(vecFrontB), 0.5);

		// Define x offset according to left / right stuff
		if (!left && right) {
			xKind = Mountain.X_LEFT_OFFSET;
		} else if (left && right) {
			xKind = Mountain.X_MID_OFFSET;
		} else if (left && !right) {
			xKind = Mountain.X_RIGHT_OFFSET;
		} else if (!left && !right) {
			xKind = Mountain.X_MIX_OFFSET;
		}

		// Draw all faces
		if (faceHeight === Project.getSquareSize()) {
			// 1 Mix sprite
			// Mix
			count = this.drawSideCorner(
				position,
				xKind,
				Mountain.Y_MIX_OFFSET,
				angle,
				center,
				width,
				height,
				w,
				faceHeight,
				wp,
				xLeft,
				xRight,
				vecBackA.x,
				vecBackB.x,
				vecFrontA.x,
				vecBackB.x,
				yTop,
				yBot,
				zFront,
				zBack,
				vecFrontA.z,
				vecFrontB.z,
				vecBackA.z,
				vecBackB.z,
				geometry,
				count,
				0,
				vecFrontA.distanceTo(vecFrontB)
			);
		} else if (faceHeight <= 2 * Project.getSquareSize()) {
			// 2 B / T sprites
			// Bottom
			count = this.drawSideCorner(
				position,
				xKind,
				Mountain.Y_BOT_OFFSET,
				angle,
				center,
				width,
				height,
				w,
				Math.floor(faceHeight / 2),
				wp,
				xLeft,
				xRight,
				vecCenterA.x,
				vecCenterB.x,
				vecFrontA.x,
				vecFrontB.x,
				vecCenterB.y,
				yBot,
				zFront,
				vecCenterB.z,
				vecFrontA.z,
				vecFrontB.z,
				vecCenterA.z,
				vecCenterB.z,
				geometry,
				count,
				vecCenterA.distanceTo(vecCenterB),
				vecFrontA.distanceTo(vecFrontB)
			);

			// Top
			count = this.drawSideCorner(
				position,
				xKind,
				Mountain.Y_TOP_OFFSET,
				angle,
				center,
				width,
				height,
				w,
				Math.ceil(faceHeight / 2),
				wp,
				xLeft,
				xRight,
				vecBackA.x,
				vecBackB.x,
				vecCenterA.x,
				vecCenterB.x,
				yTop,
				vecCenterB.y,
				vecCenterB.z,
				zBack,
				vecCenterA.z,
				vecCenterB.z,
				vecBackA.z,
				vecBackB.z,
				geometry,
				count,
				0,
				vecCenterA.distanceTo(vecCenterB)
			);
		} else {
			// 3 B / M / T sprites
			// Bottom
			let vecStepLeftB = vecFrontA.clone().addScaledVector(vecBackA.clone().sub(vecFrontA), 1 / nbSteps);
			let vecStepRightB = vecFrontB.clone().addScaledVector(vecBackB.clone().sub(vecFrontB), 1 / nbSteps);
			count = this.drawSideCorner(
				position,
				xKind,
				Mountain.Y_BOT_OFFSET,
				angle,
				center,
				width,
				height,
				w,
				Math.floor(faceHeight / nbSteps),
				wp,
				xLeft,
				xRight,
				vecStepLeftB.x,
				vecStepRightB.x,
				vecFrontA.x,
				vecFrontB.x,
				vecStepRightB.y,
				yBot,
				zFront,
				vecStepRightB.z,
				vecFrontA.z,
				vecFrontB.z,
				vecStepLeftB.z,
				vecStepRightB.z,
				geometry,
				count,
				vecStepLeftB.distanceTo(vecStepRightB),
				vecFrontA.distanceTo(vecFrontB)
			);

			// Middle: add as many as middle blocks as possible
			for (let i = 2; i <= nbSteps - 1; i++) {
				const vecStepLeftA = vecStepLeftB;
				const vecStepRightA = vecStepRightB;
				vecStepLeftB = vecFrontA.clone().addScaledVector(vecBackA.clone().sub(vecFrontA), i / nbSteps);
				vecStepRightB = vecFrontB.clone().addScaledVector(vecBackB.clone().sub(vecFrontB), i / nbSteps);
				count = this.drawSideCorner(
					position,
					xKind,
					Mountain.Y_MID_OFFSET,
					angle,
					center,
					width,
					height,
					w,
					Math.floor(faceHeight / nbSteps),
					wp,
					xLeft,
					xRight,
					vecStepLeftB.x,
					vecStepRightB.x,
					vecStepLeftA.x,
					vecStepRightA.x,
					vecStepRightB.y,
					vecStepRightA.y,
					vecStepRightA.z,
					vecStepRightB.z,
					vecStepLeftA.z,
					vecStepRightA.z,
					vecStepLeftB.z,
					vecStepRightB.z,
					geometry,
					count,
					vecStepLeftB.distanceTo(vecStepRightB),
					vecStepLeftA.distanceTo(vecStepRightA)
				);
			}

			// Top
			count = this.drawSideCorner(
				position,
				xKind,
				Mountain.Y_TOP_OFFSET,
				angle,
				center,
				width,
				height,
				w,
				Math.ceil(faceHeight / nbSteps),
				wp,
				xLeft,
				xRight,
				vecBackA.x,
				vecBackB.x,
				vecStepLeftB.x,
				vecStepRightB.x,
				yTop,
				vecStepRightB.y,
				vecStepRightB.z,
				zBack,
				vecStepLeftB.z,
				vecStepRightB.z,
				vecBackA.z,
				vecBackB.z,
				geometry,
				count,
				0,
				vecStepLeftB.distanceTo(vecStepRightB)
			);
		}
		return count;
	}

	drawSideCorner(
		position: Position,
		xKind: number,
		yKind: number,
		angle: number,
		center: THREE.Vector3,
		width: number,
		height: number,
		w: number,
		faceHeight: number,
		wp: number,
		xLeft: number,
		xRight: number,
		xLeftTop: number,
		xRightTop: number,
		xLeftBot: number,
		xRightBot: number,
		yTop: number,
		yBot: number,
		zFront: number,
		zBack: number,
		zFrontLeft: number,
		zFrontRight: number,
		zBackLeft: number,
		zBackRight: number,
		geometry: CustomGeometry,
		count: number,
		xCornerOffsetTop: number,
		xCornerOffsetBot: number
	): number {
		count = this.drawFace(
			position,
			xKind,
			yKind,
			angle,
			center,
			width,
			height,
			w,
			faceHeight,
			xLeft,
			xRight,
			xLeft,
			xRight,
			yTop,
			yBot,
			zFront,
			zFront,
			zBack,
			zBack,
			geometry,
			count,
			0,
			0,
			false
		);

		// Draw corner only if there is a border width
		if (wp > 0) {
			count = this.drawFace(
				position,
				xKind,
				yKind,
				angle,
				center,
				width,
				height,
				w,
				faceHeight,
				xLeftTop,
				xRightTop,
				xLeftBot,
				xRightBot,
				yTop,
				yBot,
				zFrontLeft,
				zFrontRight,
				zBackLeft,
				zBackRight,
				geometry,
				count,
				xCornerOffsetTop,
				xCornerOffsetBot,
				true
			);
		}
		return count;
	}

	drawFace(
		position: Position,
		xKind: number,
		yKind: number,
		angle: number,
		center: THREE.Vector3,
		width: number,
		height: number,
		w: number,
		faceHeight: number,
		xLeftTop: number,
		xRightTop: number,
		xLeftBot: number,
		xRightBot: number,
		yTop: number,
		yBot: number,
		zFrontLeft: number,
		zFrontRight: number,
		zBackLeft: number,
		zBackRight: number,
		geometry: CustomGeometry,
		count: number,
		xCornerOffsetTop: number,
		xCornerOffsetBot: number,
		isCorner: boolean
	): number {
		// Textures coordinates
		let x = (xKind * Project.getSquareSize()) / width;
		let y =
			(yKind * Project.getSquareSize() +
				(yKind === Mountain.Y_BOT_OFFSET ? Project.getSquareSize() - faceHeight : 0)) /
			height;
		let h = faceHeight / height;
		const coefX = MapElement.Base.COEF_TEX / width;
		const coefY = MapElement.Base.COEF_TEX / height;
		x += coefX;
		y += coefY;
		w -= coefX * 2;
		h -= coefY * 2;

		// Textures and vertices
		let texA: THREE.Vector2, texB: THREE.Vector2, texC: THREE.Vector2, texD: THREE.Vector2;
		if (isCorner) {
			texA = new THREE.Vector2(
				(xKind * Project.getSquareSize() + (Project.getSquareSize() - xCornerOffsetTop) / 2) / width + coefX,
				y
			);
			texB = new THREE.Vector2(
				((xKind + 1) * Project.getSquareSize() - (Project.getSquareSize() - xCornerOffsetTop) / 2) / width -
					coefX,
				y
			);
			texC = new THREE.Vector2(
				((xKind + 1) * Project.getSquareSize() - (Project.getSquareSize() - xCornerOffsetBot) / 2) / width -
					coefX,
				y + h
			);
			texD = new THREE.Vector2(
				(xKind * Project.getSquareSize() + (Project.getSquareSize() - xCornerOffsetBot) / 2) / width + coefX,
				y + h
			);
		} else {
			// Triangle form for corners
			texA = new THREE.Vector2(x, y);
			texB = new THREE.Vector2(x + w, y);
			texC = new THREE.Vector2(x + w, y + h);
			texD = new THREE.Vector2(x, y + h);
		}
		let vecA = new THREE.Vector3(xLeftTop, yTop, zBackLeft);
		let vecB = new THREE.Vector3(xRightTop, yTop, zBackRight);
		let vecC = new THREE.Vector3(xRightBot, yBot, zFrontRight);
		let vecD = new THREE.Vector3(xLeftBot, yBot, zFrontLeft);

		// Rotate and draw sprite side
		MapElement.Base.rotateQuad(vecA, vecB, vecC, vecD, center, angle, MapElement.Base.Y_AXIS);
		count = MapElement.Sprite.addStaticSpriteToGeometry(
			geometry,
			vecA,
			vecB,
			vecC,
			vecD,
			texA,
			texB,
			texC,
			texD,
			count,
			position
		);
		return count;
	}

	drawFakeTopFloor(
		localPosition: THREE.Vector3,
		position: Position,
		yTop: number,
		geometry: CustomGeometry,
		width: number,
		height: number,
		count: number
	) {
		const vecA = new THREE.Vector3(localPosition.x, yTop, localPosition.z);
		const vecB = new THREE.Vector3(localPosition.x + Project.getSquareSize(), yTop, localPosition.z);
		const vecC = new THREE.Vector3(
			localPosition.x + Project.getSquareSize(),
			yTop,
			localPosition.z + Project.getSquareSize()
		);
		const vecD = new THREE.Vector3(localPosition.x, yTop, localPosition.z + Project.getSquareSize());
		geometry.pushQuadVertices(vecA, vecB, vecC, vecD);
		geometry.pushQuadIndices(count, position);
		count += 4;
		const coefX = Base.COEF_TEX / width;
		const coefY = Base.COEF_TEX / height;
		let texX = 0;
		let texY = (4 * Project.getSquareSize()) / height;
		let texW = Project.getSquareSize() / width;
		let texH = Project.getSquareSize() / height;
		texX += coefX;
		texY += coefY;
		texW -= coefX * 2;
		texH -= coefY * 2;
		const texA = new THREE.Vector2();
		const texB = new THREE.Vector2();
		const texC = new THREE.Vector2();
		const texD = new THREE.Vector2();
		CustomGeometry.uvsQuadToTex(texA, texB, texC, texD, texX, texY, texW, texH);
		geometry.pushQuadUVs(texA, texB, texC, texD);
		return count;
	}

	updateGeometry(geometry: CustomGeometry, position: Position, count: number): number {
		// General configurations
		const wp = this.getWidthTotalPixels();
		const hp = this.getHeightTotalPixels();
		const width = 4 * Project.getSquareSize();
		const height = 5 * Project.getSquareSize();
		const faceHeight = Math.sqrt(wp * wp + hp * hp);
		const w = Project.getSquareSize() / width;
		const localPosition = position.toVector3(false);
		const center = new THREE.Vector3(
			localPosition.x + Project.getSquareSize() / 2,
			localPosition.y + Project.getSquareSize() / 2,
			localPosition.z + Project.getSquareSize() / 2
		);
		const xLeft = localPosition.x;
		const xRight = localPosition.x + Project.getSquareSize();
		const yTop = localPosition.y + hp;
		const yBot = localPosition.y;
		const zFront = localPosition.z + Project.getSquareSize() + wp;
		const zBack = zFront - wp;
		const vecFrontB = new THREE.Vector3(xLeft, yBot, zFront);
		const vecBackB = new THREE.Vector3(xLeft, yTop, zBack);
		const vecFrontA = new THREE.Vector3(xLeft - wp, yBot, zBack);
		const vecBackA = new THREE.Vector3(xLeft, yTop, zBack);

		// Bot
		if (!this.bot) {
			count = this.drawEntireFaces(
				position,
				this.left,
				this.right,
				0,
				center,
				width,
				height,
				w,
				faceHeight,
				wp,
				xLeft,
				xRight,
				yTop,
				yBot,
				zFront,
				zBack,
				vecFrontA,
				vecBackA,
				vecFrontB,
				vecBackB,
				geometry,
				count
			);
		}
		// Top
		if (!this.top) {
			count = this.drawEntireFaces(
				position,
				this.right,
				this.left,
				180,
				center,
				width,
				height,
				w,
				faceHeight,
				wp,
				xLeft,
				xRight,
				yTop,
				yBot,
				zFront,
				zBack,
				vecFrontA,
				vecBackA,
				vecFrontB,
				vecBackB,
				geometry,
				count
			);
		}
		// Left
		if (!this.left) {
			count = this.drawEntireFaces(
				position,
				this.top,
				this.bot,
				-90,
				center,
				width,
				height,
				w,
				faceHeight,
				wp,
				xLeft,
				xRight,
				yTop,
				yBot,
				zFront,
				zBack,
				vecFrontA,
				vecBackA,
				vecFrontB,
				vecBackB,
				geometry,
				count
			);
		}
		// Right
		if (!this.right) {
			count = this.drawEntireFaces(
				position,
				this.bot,
				this.top,
				90,
				center,
				width,
				height,
				w,
				faceHeight,
				wp,
				xLeft,
				xRight,
				yTop,
				yBot,
				zFront,
				zBack,
				vecFrontA,
				vecBackA,
				vecFrontB,
				vecBackB,
				geometry,
				count
			);
		}
		// Fake transparent top floor for intersect raycasting purposes
		count = this.drawFakeTopFloor(localPosition, position, yTop, geometry, width, height, count);

		return count;
	}

	update(position: Position, portion: Portion): boolean {
		const previousLeft = this.left;
		const previousRight = this.right;
		const previousTop = this.top;
		const previousBot = this.bot;
		this.left = !!Mountains.getMountainHere(position.getSquareLeft(), portion);
		this.right = !!Mountains.getMountainHere(position.getSquareRight(), portion);
		this.top = !!Mountains.getMountainHere(position.getSquareTop(), portion);
		this.bot = !!Mountains.getMountainHere(position.getSquareBot(), portion);
		return (
			this.left !== previousLeft ||
			this.right !== previousRight ||
			this.top !== previousTop ||
			this.bot !== previousBot
		);
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, Mountain.getBindings(additionnalBinding));

		// Calculate angle
		const width = this.getWidthTotalPixels();
		this.angle = width === 0 ? 90 : (Math.atan(this.getHeightTotalPixels() / width) * 180) / Math.PI;
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Mountain.getBindings(additionnalBinding));
	}
}

export { Mountain };
