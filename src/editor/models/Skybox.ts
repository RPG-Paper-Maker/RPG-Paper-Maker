/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
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
