/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { BINDING, BindingType, JSONType, PICTURE_KIND } from '../common';
import { Project } from '../core';
import { Manager } from '../Editor';
import { Base } from './Base';

class Skybox extends Base {
	public front!: number;
	public back!: number;
	public top!: number;
	public bot!: number;
	public left!: number;
	public right!: number;

	public static bindings: BindingType[] = [
		['front', 'fid', 1, BINDING.NUMBER],
		['back', 'bid', 1, BINDING.NUMBER],
		['top', 'tid', 1, BINDING.NUMBER],
		['bot', 'boid', 1, BINDING.NUMBER],
		['left', 'lid', 1, BINDING.NUMBER],
		['right', 'rid', 1, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	createTextures(): THREE.MeshPhongMaterial[] {
		return [this.left, this.right, this.top, this.bot, this.front, this.back].map((side) => {
			const texture = Manager.GL.textureLoader.load(
				Project.current!.pictures.getByID(PICTURE_KIND.SKYBOXES, side).getPath()
			);
			texture.wrapS = THREE.RepeatWrapping;
			texture.repeat.x = -1;
			return Manager.GL.createMaterial({
				texture: texture,
				side: THREE.BackSide,
				shadows: false,
				flipY: true,
			});
		});
	}

	copy(skybox: Skybox, additionnalBinding: BindingType[] = []): void {
		super.copy(skybox, Skybox.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Skybox.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Skybox.getBindings(additionnalBinding));
	}
}

export { Skybox };
