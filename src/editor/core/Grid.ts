/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { Project } from '.';
import { Scene } from '../Editor';

class Grid {
	public line!: THREE.LineSegments;

	initialize(map: Scene.Map) {
		const material = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.3,
		});
		const points = [];
		for (let i = 0, l = map.model.length; i <= l; i++) {
			points.push(new THREE.Vector3(i * Project.SQUARE_SIZE, 0, 0));
			points.push(new THREE.Vector3(i * Project.SQUARE_SIZE, 0, map.model.width * Project.SQUARE_SIZE));
		}
		for (let i = 0, l = map.model.width; i <= l; i++) {
			points.push(new THREE.Vector3(0, 0, i * Project.SQUARE_SIZE));
			points.push(new THREE.Vector3(map.model.length * Project.SQUARE_SIZE, 0, i * Project.SQUARE_SIZE));
		}
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		this.line = new THREE.LineSegments(geometry, material);
		this.line.renderOrder = 5;
		map.scene.add(this.line);
	}
}

export { Grid };
