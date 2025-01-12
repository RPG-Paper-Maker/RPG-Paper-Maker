/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Base } from './Base';

class Detection extends Base {
	public fieldLeft!: number;
	public fieldRight!: number;
	public fieldTop!: number;
	public fieldBot!: number;
	// TODO

	public static bindings: BindingType[] = [
		['fieldLeft', 'fl', 2, BINDING.NUMBER],
		['fieldRight', 'fr', 2, BINDING.NUMBER],
		['fieldTop', 'ft', 2, BINDING.NUMBER],
		['fieldBot', 'fb', 2, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(detection: Detection, additionnalBinding: BindingType[] = []): void {
		super.copy(detection, Detection.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Detection.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Detection.getBindings(additionnalBinding));
	}
}

export { Detection };
