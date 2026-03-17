/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import * as THREE from 'three';
import { MapElement, Model, Scene } from '../Editor';
import { BINDING, ELEMENT_MAP_KIND, JSONType, MOUNTAIN_SIDE, Utils } from '../common';
import { CustomGeometry } from '../core/CustomGeometry';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Base } from './Base';
import { Mountains } from './Mountains';

const { t } = i18next;

class Mountain extends Base {
	public static X_LEFT_OFFSET = 0;
	public static X_MID_OFFSET = 1;
	public static X_RIGHT_OFFSET = 2;
	public static X_MIX_OFFSET = 3;
	public static Y_TOP_OFFSET = 0;
	public static Y_MID_OFFSET = 1;
	public static Y_BOT_OFFSET = 2;
	public static Y_MIX_OFFSET = 3;
	public static Y_MID_TOP_OFFSET = 4;
	public static Y_MID_MID_OFFSET = 5;
	public static Y_MID_BOT_OFFSET = 6;

	public mountainID!: number;
	public widthSquaresBot!: number;
	public widthPixelsBot!: number;
	public widthSquaresTop!: number;
	public widthPixelsTop!: number;
	public widthSquaresLeft!: number;
	public widthPixelsLeft!: number;
	public widthSquaresRight!: number;
	public widthPixelsRight!: number;
	public heightSquares!: number;
	public heightPixels!: number;
	public top!: boolean;
	public bot!: boolean;
	public left!: boolean;
	public right!: boolean;
	public angle!: number;

	public static readonly bindings: BindingType[] = [
		['mountainID', 'sid', -1, BINDING.NUMBER],
		['widthSquaresBot', 'wsb', 0, BINDING.NUMBER],
		['widthPixelsBot', 'wpb', 0, BINDING.NUMBER],
		['widthSquaresTop', 'wst', 0, BINDING.NUMBER],
		['widthPixelsTop', 'wpt', 0, BINDING.NUMBER],
		['widthSquaresLeft', 'wsl', 0, BINDING.NUMBER],
		['widthPixelsLeft', 'wpl', 0, BINDING.NUMBER],
		['widthSquaresRight', 'wsr', 0, BINDING.NUMBER],
		['widthPixelsRight', 'wpr', 0, BINDING.NUMBER],
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

	static fromJSON(json: JSONType): MapElement.Mountain {
		const mountain = new MapElement.Mountain();
		if (json) {
			mountain.read(json);
		}
		return mountain;
	}

	static create(
		mountainID: number,
		widthSquaresBot: number,
		widthPixelsBot: number,
		widthSquaresTop: number,
		widthPixelsTop: number,
		widthSquaresLeft: number,
		widthPixelsLeft: number,
		widthSquaresRight: number,
		widthPixelsRight: number,
		heightSquares: number,
		heightPixels: number,
	): MapElement.Mountain {
		const mountain = new MapElement.Mountain();
		mountain.mountainID = mountainID;
		mountain.widthSquaresBot = widthSquaresBot;
		mountain.widthPixelsBot = widthPixelsBot;
		mountain.widthSquaresTop = widthSquaresTop;
		mountain.widthPixelsTop = widthPixelsTop;
		mountain.widthSquaresLeft = widthSquaresLeft;
		mountain.widthPixelsLeft = widthPixelsLeft;
		mountain.widthSquaresRight = widthSquaresRight;
		mountain.widthPixelsRight = widthPixelsRight;
		mountain.heightSquares = heightSquares;
		mountain.heightPixels = heightPixels;
		return mountain;
	}

	equals(mapElement: MapElement.Base): boolean {
		if (mapElement.kind === this.kind) {
			const mountain = mapElement as MapElement.Mountain;
			return (
				mountain.mountainID === this.mountainID &&
				mountain.widthSquaresBot === this.widthSquaresBot &&
				mountain.widthPixelsBot === this.widthPixelsBot &&
				mountain.widthSquaresTop === this.widthSquaresTop &&
				mountain.widthPixelsTop === this.widthPixelsTop &&
				mountain.widthSquaresLeft === this.widthSquaresLeft &&
				mountain.widthPixelsLeft === this.widthPixelsLeft &&
				mountain.widthSquaresRight === this.widthSquaresRight &&
				mountain.widthPixelsRight === this.widthPixelsRight &&
				mountain.heightSquares === this.heightSquares &&
				mountain.heightPixels === this.heightPixels
			);
		} else {
			return false;
		}
	}

	toString(): string {
		return `${t('mountain')} ID: ${Utils.formatNumberID(this.mountainID)}`;
	}

	getTotalSquaresWidth(): number {
		return (
			Math.max(this.widthSquaresBot, this.widthSquaresTop, this.widthSquaresLeft, this.widthSquaresRight) +
			(this.getMaxWidthOnlyPixels() > 0 ? 1 : 0)
		);
	}

	getTotalSquaresHeight(yPixels: number): number {
		return this.heightSquares + (this.getHeightOnlyPixels() + yPixels > 0 ? 1 : 0);
	}

	getWidthOnlyPixelsForSide(side: MOUNTAIN_SIDE): number {
		switch (side) {
			case MOUNTAIN_SIDE.BOT:
				return Math.round((this.widthPixelsBot * Project.SQUARE_SIZE) / 100);
			case MOUNTAIN_SIDE.TOP:
				return Math.round((this.widthPixelsTop * Project.SQUARE_SIZE) / 100);
			case MOUNTAIN_SIDE.LEFT:
				return Math.round((this.widthPixelsLeft * Project.SQUARE_SIZE) / 100);
			case MOUNTAIN_SIDE.RIGHT:
				return Math.round((this.widthPixelsRight * Project.SQUARE_SIZE) / 100);
		}
	}

	getMaxWidthOnlyPixels(): number {
		return Math.max(
			this.getWidthOnlyPixelsForSide(MOUNTAIN_SIDE.BOT),
			this.getWidthOnlyPixelsForSide(MOUNTAIN_SIDE.TOP),
			this.getWidthOnlyPixelsForSide(MOUNTAIN_SIDE.LEFT),
			this.getWidthOnlyPixelsForSide(MOUNTAIN_SIDE.RIGHT),
		);
	}

	getHeightOnlyPixels(): number {
		return Math.round((this.heightPixels * Project.SQUARE_SIZE) / 100);
	}

	getWidthTotalPixelsForSide(side: MOUNTAIN_SIDE): number {
		switch (side) {
			case MOUNTAIN_SIDE.BOT:
				return this.widthSquaresBot * Project.SQUARE_SIZE + this.getWidthOnlyPixelsForSide(MOUNTAIN_SIDE.BOT);
			case MOUNTAIN_SIDE.TOP:
				return this.widthSquaresTop * Project.SQUARE_SIZE + this.getWidthOnlyPixelsForSide(MOUNTAIN_SIDE.TOP);
			case MOUNTAIN_SIDE.LEFT:
				return this.widthSquaresLeft * Project.SQUARE_SIZE + this.getWidthOnlyPixelsForSide(MOUNTAIN_SIDE.LEFT);
			case MOUNTAIN_SIDE.RIGHT:
				return this.widthSquaresRight * Project.SQUARE_SIZE + this.getWidthOnlyPixelsForSide(MOUNTAIN_SIDE.RIGHT);
		}
	}

	getHeightTotalPixels(): number {
		return this.heightSquares * Project.SQUARE_SIZE + this.getHeightOnlyPixels();
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
		count: number,
	): number {
		let xKind = Mountain.X_LEFT_OFFSET;
		const nbSteps = Math.ceil(faceHeight / Project.SQUARE_SIZE);
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
		if (faceHeight === Project.SQUARE_SIZE) {
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
				vecFrontA.distanceTo(vecFrontB),
			);
		} else if (faceHeight <= 2 * Project.SQUARE_SIZE) {
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
				vecFrontA.distanceTo(vecFrontB),
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
				vecCenterA.distanceTo(vecCenterB),
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
				vecFrontA.distanceTo(vecFrontB),
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
					vecStepLeftA.distanceTo(vecStepRightA),
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
				vecStepLeftB.distanceTo(vecStepRightB),
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
		xCornerOffsetBot: number,
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
			false,
		);

		// Draw corner if this face has a slope (right-end cap) or the adjacent face does (left-end cap)
		if (wp > 0 || xLeft > xLeftBot) {
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
				true,
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
		isCorner: boolean,
	): number {
		// Textures coordinates
		let x = (xKind * Project.SQUARE_SIZE) / width;
		let y =
			((isCorner ? Math.min(yKind + 4, Mountain.Y_MID_BOT_OFFSET) : yKind) * Project.SQUARE_SIZE +
				(yKind === Mountain.Y_BOT_OFFSET ? Project.SQUARE_SIZE - faceHeight : 0)) /
			height;
		let h = faceHeight / height;
		const coefX = MapElement.Base.COEF_TEX / width;
		const coefY = MapElement.Base.COEF_TEX / height;
		x += coefX;
		y += coefY;
		w -= coefX * 2;
		h -= coefY * 2;

		// Textures and vertices
		let texA: THREE.Vector2;
		let texB: THREE.Vector2;
		let texC: THREE.Vector2;
		let texD: THREE.Vector2;
		if (isCorner) {
			texA = new THREE.Vector2(
				(Mountain.X_MID_OFFSET * Project.SQUARE_SIZE + (Project.SQUARE_SIZE - xCornerOffsetTop) / 2) / width +
					coefX,
				y,
			);
			texB = new THREE.Vector2(
				((Mountain.X_MID_OFFSET + 1) * Project.SQUARE_SIZE - (Project.SQUARE_SIZE - xCornerOffsetTop) / 2) /
					width -
					coefX,
				y,
			);
			texC = new THREE.Vector2(
				((Mountain.X_MID_OFFSET + 1) * Project.SQUARE_SIZE - (Project.SQUARE_SIZE - xCornerOffsetBot) / 2) /
					width -
					coefX,
				y + h,
			);
			texD = new THREE.Vector2(
				(Mountain.X_MID_OFFSET * Project.SQUARE_SIZE + (Project.SQUARE_SIZE - xCornerOffsetBot) / 2) / width +
					coefX,
				y + h,
			);
		} else {
			// Triangle form for corners
			texA = new THREE.Vector2(x, y);
			texB = new THREE.Vector2(x + w, y);
			texC = new THREE.Vector2(x + w, y + h);
			texD = new THREE.Vector2(x, y + h);
		}
		const vecA = new THREE.Vector3(xLeftTop, yTop, zBackLeft);
		const vecB = new THREE.Vector3(xRightTop, yTop, zBackRight);
		const vecC = new THREE.Vector3(xRightBot, yBot, zFrontRight);
		const vecD = new THREE.Vector3(xLeftBot, yBot, zFrontLeft);

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
			position,
		);
		return count;
	}

	buildFaceVectors(
		wp: number,
		wpAdjacent: number,
		hp: number,
		localPosition: THREE.Vector3,
	): {
		xLeft: number;
		xRight: number;
		yTop: number;
		yBot: number;
		zFront: number;
		zBack: number;
		vecFrontA: THREE.Vector3;
		vecBackA: THREE.Vector3;
		vecFrontB: THREE.Vector3;
		vecBackB: THREE.Vector3;
	} {
		const xLeft = localPosition.x;
		const xRight = localPosition.x + Project.SQUARE_SIZE;
		const yTop = localPosition.y + hp;
		const yBot = localPosition.y;
		const zFront = localPosition.z + Project.SQUARE_SIZE + wp;
		const zBack = zFront - wp;
		const vecFrontA = new THREE.Vector3(xLeft - wpAdjacent, yBot, zBack);
		const vecBackA = new THREE.Vector3(xLeft, yTop, zBack);
		const vecFrontB = new THREE.Vector3(xLeft, yBot, zFront);
		const vecBackB = new THREE.Vector3(xLeft, yTop, zBack);
		return { xLeft, xRight, yTop, yBot, zFront, zBack, vecFrontA, vecBackA, vecFrontB, vecBackB };
	}

	updateGeometry(geometry: CustomGeometry, position: Position, count: number): number {
		// General configurations
		const hp = this.getHeightTotalPixels();
		const width = 4 * Project.SQUARE_SIZE;
		const height = 7 * Project.SQUARE_SIZE;
		const w = Project.SQUARE_SIZE / width;
		const localPosition = position.toVector3(false);
		const center = new THREE.Vector3(
			localPosition.x + Project.SQUARE_SIZE / 2,
			localPosition.y + Project.SQUARE_SIZE / 2,
			localPosition.z + Project.SQUARE_SIZE / 2,
		);

		// Bot
		if (!this.bot) {
			const wpBot = this.getWidthTotalPixelsForSide(MOUNTAIN_SIDE.BOT);
			const faceHeightBot = Math.sqrt(wpBot * wpBot + hp * hp);
			const fBot = this.buildFaceVectors(wpBot, this.getWidthTotalPixelsForSide(MOUNTAIN_SIDE.LEFT), hp, localPosition);
			count = this.drawEntireFaces(
				position,
				this.left,
				this.right,
				0,
				center,
				width,
				height,
				w,
				faceHeightBot,
				wpBot,
				fBot.xLeft,
				fBot.xRight,
				fBot.yTop,
				fBot.yBot,
				fBot.zFront,
				fBot.zBack,
				fBot.vecFrontA,
				fBot.vecBackA,
				fBot.vecFrontB,
				fBot.vecBackB,
				geometry,
				count,
			);
		}
		// Top
		if (!this.top) {
			const wpTop = this.getWidthTotalPixelsForSide(MOUNTAIN_SIDE.TOP);
			const faceHeightTop = Math.sqrt(wpTop * wpTop + hp * hp);
			const fTop = this.buildFaceVectors(wpTop, this.getWidthTotalPixelsForSide(MOUNTAIN_SIDE.RIGHT), hp, localPosition);
			count = this.drawEntireFaces(
				position,
				this.right,
				this.left,
				180,
				center,
				width,
				height,
				w,
				faceHeightTop,
				wpTop,
				fTop.xLeft,
				fTop.xRight,
				fTop.yTop,
				fTop.yBot,
				fTop.zFront,
				fTop.zBack,
				fTop.vecFrontA,
				fTop.vecBackA,
				fTop.vecFrontB,
				fTop.vecBackB,
				geometry,
				count,
			);
		}
		// Left
		if (!this.left) {
			const wpLeft = this.getWidthTotalPixelsForSide(MOUNTAIN_SIDE.LEFT);
			const faceHeightLeft = Math.sqrt(wpLeft * wpLeft + hp * hp);
			const fLeft = this.buildFaceVectors(wpLeft, this.getWidthTotalPixelsForSide(MOUNTAIN_SIDE.TOP), hp, localPosition);
			count = this.drawEntireFaces(
				position,
				this.top,
				this.bot,
				-90,
				center,
				width,
				height,
				w,
				faceHeightLeft,
				wpLeft,
				fLeft.xLeft,
				fLeft.xRight,
				fLeft.yTop,
				fLeft.yBot,
				fLeft.zFront,
				fLeft.zBack,
				fLeft.vecFrontA,
				fLeft.vecBackA,
				fLeft.vecFrontB,
				fLeft.vecBackB,
				geometry,
				count,
			);
		}
		// Right
		if (!this.right) {
			const wpRight = this.getWidthTotalPixelsForSide(MOUNTAIN_SIDE.RIGHT);
			const faceHeightRight = Math.sqrt(wpRight * wpRight + hp * hp);
			const fRight = this.buildFaceVectors(wpRight, this.getWidthTotalPixelsForSide(MOUNTAIN_SIDE.BOT), hp, localPosition);
			count = this.drawEntireFaces(
				position,
				this.bot,
				this.top,
				90,
				center,
				width,
				height,
				w,
				faceHeightRight,
				wpRight,
				fRight.xLeft,
				fRight.xRight,
				fRight.yTop,
				fRight.yBot,
				fRight.zFront,
				fRight.zBack,
				fRight.vecFrontA,
				fRight.vecBackA,
				fRight.vecFrontB,
				fRight.vecBackB,
				geometry,
				count,
			);
		}
		return count;
	}

	getMountainHere(map: Scene.Map, position: Position) {
		const mountain = Mountains.getMountainHere(map, position);
		return mountain && mountain.equals(this);
	}

	update(map: Scene.Map, position: Position): boolean {
		const previousLeft = this.left;
		const previousRight = this.right;
		const previousTop = this.top;
		const previousBot = this.bot;
		this.left = !!this.getMountainHere(map, position.getSquareLeft());
		this.right = !!this.getMountainHere(map, position.getSquareRight());
		this.top = !!this.getMountainHere(map, position.getSquareTop());
		this.bot = !!this.getMountainHere(map, position.getSquareBot());
		return (
			this.left !== previousLeft ||
			this.right !== previousRight ||
			this.top !== previousTop ||
			this.bot !== previousBot
		);
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		const legacyWs = json.ws ?? 0;
		const legacyWp = json.wp ?? 0;
		if (json.wsb === undefined && json.wst === undefined && json.wsl === undefined && json.wsr === undefined) {
			json.wsb = legacyWs;
			json.wst = legacyWs;
			json.wsl = legacyWs;
			json.wsr = legacyWs;
		}
		if (json.wpb === undefined && json.wpt === undefined && json.wpl === undefined && json.wpr === undefined) {
			json.wpb = legacyWp;
			json.wpt = legacyWp;
			json.wpl = legacyWp;
			json.wpr = legacyWp;
		}
		super.read(json, Mountain.getBindings(additionnalBinding));
		this.angle = MapElement.Mountains.calculateAngle(
			this.getWidthTotalPixelsForSide(MOUNTAIN_SIDE.BOT),
			this.getHeightTotalPixels(),
		);
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Mountain.getBindings(additionnalBinding));
	}
}

export { Mountain };
