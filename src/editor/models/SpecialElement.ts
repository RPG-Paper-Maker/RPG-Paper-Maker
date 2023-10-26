/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING } from '../common/Enum';
import { BindingType } from '../common/Types';
import { Base } from './Base';

class SpecialElement extends Base {
	public static readonly JSON_PICTURE_ID = 'pic';
	public static readonly DEFAULT_PICTURE_ID = -1;

	public pictureID!: number;

	public static readonly bindings: BindingType[] = [['pictureID', 'pic', -1, BINDING.NUMBER]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...SpecialElement.bindings, ...additionnalBinding];
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, SpecialElement.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, SpecialElement.getBindings(additionnalBinding));
	}
}

export { SpecialElement };
