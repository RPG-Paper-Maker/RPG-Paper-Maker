/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../common/Utils';
import { Base } from './Base';

class SpecialElement extends Base {
	public static readonly JSON_PICTURE_ID = 'pic';
	public static readonly DEFAULT_PICTURE_ID = -1;

	public pictureID!: number;

	read(json: Record<string, any>) {
		this.pictureID = Utils.defaultValue(json.pic, -1);
	}
}

export { SpecialElement };
