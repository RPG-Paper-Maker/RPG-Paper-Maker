/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import * as THREE from 'three';
import { BINDING, JSONType, PICTURE_KIND } from '../common';
import DialogSkybox from '../components/dialogs/models/DialogSkybox';
import { Project } from '../core/Project';
import { BindingType } from '../core/Serializable';
import { Manager } from '../Editor';
import { Base, DIALOG_OPTIONS } from './Base';

class Skybox extends Base {
	public static type = 'Skybox';
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

	applyDefault() {
		super.applyDefault(Skybox.getBindings([]));
	}

	async createTextures(): Promise<THREE.MeshPhongMaterial[]> {
		const textures = [] as THREE.MeshPhongMaterial[];
		const sides = [this.left, this.right, this.top, this.bot, this.front, this.back];
		for (const side of sides) {
			const picture = Project.current!.pictures.getByID(PICTURE_KIND.SKYBOXES, side);
			const texture = picture
				? Manager.GL.textureLoader.load(await picture.getPathOrBase64())
				: new THREE.Texture();
			texture.wrapS = THREE.RepeatWrapping;
			texture.repeat.x = -1;
			textures.push(
				Manager.GL.createMaterial({
					texture,
					side: THREE.BackSide,
					shadows: false,
					flipY: true,
				}),
			);
		}
		return textures;
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogSkybox {...options} />;
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
