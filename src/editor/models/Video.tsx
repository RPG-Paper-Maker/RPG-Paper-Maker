/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths } from '../common';
import { Project } from '../core/Project';
import { Asset } from './Asset';

class Video extends Asset {
	static getFolder(isBR: boolean, dlc: string): string {
		return (
			(isBR
				? Project.current?.systems?.PATH_BR
				: dlc
				? `${Project.current?.systems?.PATH_DLCS}/${dlc}`
				: `${Project.current?.getPath()}/`) + this.getLocalFolder()
		);
	}

	static getLocalFolder(): string {
		return Paths.VIDEOS;
	}

	getPath(): string {
		return this.id === -1 ? '' : `${Video.getFolder(this.isBR, this.dlc)}/${this.name}`;
	}
}

export { Video };
