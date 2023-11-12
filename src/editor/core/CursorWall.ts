/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Scene } from '../Editor';
import { Position, Project } from '.';

class CursorWall {
	public lines!: THREE.LineSegments;
	public isVisible = false;
	public position: Position | null = null;

	initialize() {
		const material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			opacity: 1,
		});
		const geometry = new THREE.BufferGeometry();
		this.lines = new THREE.LineSegments(geometry, material);
		this.lines.renderOrder = 3;
	}

	update(positionStart: Position, positionEnd?: Position) {
		const points = [];
		const additionVector = new THREE.Vector3(0, Project.getSquareSize() * 3, 0);
		const vStartA = positionStart.toVector3(false);
		const vStartB = vStartA.clone().add(additionVector);
		points.push(vStartA);
		points.push(vStartB);
		if (positionEnd) {
			const vEndA = positionEnd.toVector3(false);
			const vEndB = vEndA.clone().add(additionVector);
			points.push(vEndA);
			points.push(vEndB);
		}
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		this.lines.geometry = geometry;
		if (!this.isVisible) {
			Scene.Map.current?.scene.add(this.lines);
			this.isVisible = true;
		}
		this.position = positionStart;
	}

	remove() {
		if (this.isVisible) {
			Scene.Map.current?.scene.remove(this.lines);
			this.isVisible = false;
		}
	}
}

export { CursorWall };
