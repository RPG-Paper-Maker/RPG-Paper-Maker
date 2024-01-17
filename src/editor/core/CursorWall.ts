/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Scene } from '../Editor';
import { Position, Project } from '.';
import { Constants } from '../common';

class CursorWall {
	public lines!: THREE.LineSegments;
	public material!: THREE.LineBasicMaterial;
	public isVisible = false;
	public positionStart: Position | null = null;
	public positionEnd: Position | null = null;
	public isMouseDown = false;

	initialize() {
		this.material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			opacity: 1,
		});
		const geometry = new THREE.BufferGeometry();
		this.lines = new THREE.LineSegments(geometry, this.material);
		this.lines.renderOrder = 3;
	}

	needsUpdate(position: Position) {
		if (this.isMouseDown) {
			return this.positionEnd === null || !this.positionEnd.equals(position);
		} else {
			return this.positionStart === null || !this.positionStart.equals(position);
		}
	}

	arePositionsAligned() {
		return !this.isMouseDown || this.isHorizontal() || this.isVertical();
	}

	isHorizontal() {
		return this.positionStart && this.positionEnd && this.positionStart.z === this.positionEnd.z;
	}

	isVertical() {
		return this.positionStart && this.positionEnd && this.positionStart.x === this.positionEnd.x;
	}

	getPositions() {
		const positions = [];
		if (
			this.arePositionsAligned() &&
			this.positionStart &&
			this.positionEnd &&
			!this.positionStart.equals(this.positionEnd)
		) {
			if (this.isHorizontal()) {
				const start = Math.min(this.positionStart.x, this.positionEnd.x);
				const end = Math.max(this.positionStart.x, this.positionEnd.x);
				for (let i = start; i < end; i++) {
					positions.push(
						new Position(
							i,
							this.positionStart.y,
							this.positionStart.yPixels,
							this.positionStart.z,
							this.positionStart.layer,
							50,
							0
						)
					);
				}
			} else {
				const start = Math.min(this.positionStart.z, this.positionEnd.z);
				const end = Math.max(this.positionStart.z, this.positionEnd.z);
				for (let i = start; i < end; i++) {
					positions.push(
						new Position(
							this.positionStart.x,
							this.positionStart.y,
							this.positionStart.yPixels,
							i,
							this.positionStart.layer,
							0,
							50,
							90
						)
					);
				}
			}
		}
		return positions;
	}

	onMouseDown(position: Position) {
		this.isMouseDown = true;
		if (Constants.isMobile) {
			this.positionStart = position;
		}
	}

	onMouseUp() {
		if (this.positionStart !== null && this.positionEnd !== null) {
			if (Scene.Map.isAdding()) {
				Scene.Map.current!.mapPortion.add(this.positionStart);
			} else if (Scene.Map.isRemoving()) {
				Scene.Map.current!.mapPortion.remove(this.positionStart);
			}
		}
		this.isMouseDown = false;
		this.positionEnd = null;
	}

	updatePositions(position: Position) {
		if (this.isMouseDown) {
			this.positionEnd = position.clone();
		} else {
			this.positionStart = position.clone();
		}
	}

	update(position: Position) {
		this.updatePositions(position);
		const points = [];
		const additionVector = new THREE.Vector3(0, Project.SQUARE_SIZE * 3, 0);
		if (this.positionStart) {
			const vStartA = this.positionStart.toVector3(false);
			const vStartB = vStartA.clone().add(additionVector);
			points.push(vStartA);
			points.push(vStartB);
		}
		if (this.positionEnd) {
			const vEndA = this.positionEnd.toVector3(false);
			const vEndB = vEndA.clone().add(additionVector);
			points.push(vEndA);
			points.push(vEndB);
		}
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		this.lines.geometry = geometry;
		this.material.color = new THREE.Color(this.arePositionsAligned() ? 0xffffff : 0xff0000);
		if (!this.isVisible) {
			Scene.Map.current?.scene.add(this.lines);
			this.isVisible = true;
		}
	}

	remove() {
		if (this.isVisible) {
			Scene.Map.current?.scene.remove(this.lines);
			this.isVisible = false;
		}
	}
}

export { CursorWall };
