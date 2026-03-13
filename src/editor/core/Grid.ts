/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Scene } from '../Editor';
import { Project } from './Project';

class Grid {
	public line!: THREE.LineSegments;

	createLine(map: Scene.Map) {
		const material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.2,
		});
		const geometry = new THREE.BufferGeometry();
		this.line = new THREE.LineSegments(geometry, material);
		this.line.renderOrder = 5;
		map.scene.add(this.line);
	}

	initialize(map: Scene.Map) {
		const points = [];
		for (let i = 0, l = map.model.length; i <= l; i++) {
			points.push(new THREE.Vector3(i * Project.SQUARE_SIZE, 0, 0));
			points.push(new THREE.Vector3(i * Project.SQUARE_SIZE, 0, map.model.width * Project.SQUARE_SIZE));
		}
		for (let i = 0, l = map.model.width; i <= l; i++) {
			points.push(new THREE.Vector3(0, 0, i * Project.SQUARE_SIZE));
			points.push(new THREE.Vector3(map.model.length * Project.SQUARE_SIZE, 0, i * Project.SQUARE_SIZE));
		}
		this.createLine(map);
		this.line.geometry = new THREE.BufferGeometry().setFromPoints(points);
	}

	updateDetectionGrid(map: Scene.Map, left: number, right: number, top: number, bot: number) {
		if (!this.line) {
			this.createLine(map);
		}
		const points = [];
		for (let i = -left, l = right + 1; i <= l; i++) {
			points.push(new THREE.Vector3(i * Project.SQUARE_SIZE, 0, -top * Project.SQUARE_SIZE));
			points.push(new THREE.Vector3(i * Project.SQUARE_SIZE, 0, (bot + 1) * Project.SQUARE_SIZE));
		}
		for (let i = -top, l = bot + 1; i <= l; i++) {
			points.push(new THREE.Vector3(-left * Project.SQUARE_SIZE, 0, i * Project.SQUARE_SIZE));
			points.push(new THREE.Vector3((right + 1) * Project.SQUARE_SIZE, 0, i * Project.SQUARE_SIZE));
		}
		this.line.geometry = new THREE.BufferGeometry().setFromPoints(points);
	}
}

export { Grid };
