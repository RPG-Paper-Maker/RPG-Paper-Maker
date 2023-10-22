/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../common/Utils';
import { SpecialElement } from './SpecialElement';

class Autotile extends SpecialElement {
	public isAnimated!: boolean;

	read(json: Record<string, any>) {
		super.read(json);
		this.isAnimated = Utils.defaultValue(json.isAnimated, false);
	}
}

export { Autotile };
