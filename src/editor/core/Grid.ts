/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BufferGeometry, LineBasicMaterial, LineSegments, Vector3 } from 'three';
import { Project } from '.';
import { Scene } from '../Editor';

class Grid {
	public line!: LineSegments;

	createLine(map: Scene.Map) {
		const material = new LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.2,
		});
		const geometry = new BufferGeometry();
		this.line = new LineSegments(geometry, material);
		this.line.renderOrder = 5;
		map.scene.add(this.line);
	}

	initialize(map: Scene.Map) {
		const points = [];
		for (let i = 0, l = map.model.length; i <= l; i++) {
			points.push(new Vector3(i * Project.SQUARE_SIZE, 0, 0));
			points.push(new Vector3(i * Project.SQUARE_SIZE, 0, map.model.width * Project.SQUARE_SIZE));
		}
		for (let i = 0, l = map.model.width; i <= l; i++) {
			points.push(new Vector3(0, 0, i * Project.SQUARE_SIZE));
			points.push(new Vector3(map.model.length * Project.SQUARE_SIZE, 0, i * Project.SQUARE_SIZE));
		}
		this.createLine(map);
		this.line.geometry = new BufferGeometry().setFromPoints(points);
	}

	updateDetectionGrid(map: Scene.Map, left: number, right: number, top: number, bot: number) {
		if (!this.line) {
			this.createLine(map);
		}
		const points = [];
		for (let i = -left, l = right + 1; i <= l; i++) {
			points.push(new Vector3(i * Project.SQUARE_SIZE, 0, -top * Project.SQUARE_SIZE));
			points.push(new Vector3(i * Project.SQUARE_SIZE, 0, (bot + 1) * Project.SQUARE_SIZE));
		}
		for (let i = -top, l = bot + 1; i <= l; i++) {
			points.push(new Vector3(-left * Project.SQUARE_SIZE, 0, i * Project.SQUARE_SIZE));
			points.push(new Vector3((right + 1) * Project.SQUARE_SIZE, 0, i * Project.SQUARE_SIZE));
		}
		this.line.geometry = new BufferGeometry().setFromPoints(points);
	}
}

export { Grid };
