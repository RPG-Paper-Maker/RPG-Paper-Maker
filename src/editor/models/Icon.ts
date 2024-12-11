/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType } from '../common';
import { Localization } from './Localization';

class Icon extends Localization {
	public pictureID!: number;
	public pictureIndexX!: number;
	public pictureIndexY!: number;

	public static bindings: BindingType[] = [
		['pictureID', 'pid', undefined, BINDING.NUMBER],
		['pictureIndexX', 'pictureIndexX', 0, BINDING.NUMBER],
		['pictureIndexY', 'pictureIndexY', 0, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	copy(icon: Icon, additionnalBinding: BindingType[]): void {
		super.copy(icon, Icon.getBindings(additionnalBinding));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Icon.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Icon.getBindings(additionnalBinding));
	}
}

export { Icon };
