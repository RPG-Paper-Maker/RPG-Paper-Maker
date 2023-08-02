/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Base } from './Base';
import { FcFolder, FcFile } from 'react-icons/fc';

class TreeMapTag extends Base {
	isFolder() {
		return this.id < 0;
	}

	getIcon() {
		return this.isFolder() ? <FcFolder /> : <FcFile />;
	}
}

export { TreeMapTag };
