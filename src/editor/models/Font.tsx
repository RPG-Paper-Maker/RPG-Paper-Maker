/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Paths } from '../common';
import { LocalFile, Project } from '../core';
import { Asset } from './Asset';

class Font extends Asset {
	static getFolder(isBR: boolean, dlc: string): string {
		return (
			(isBR
				? Project.current?.systems?.PATH_BR
				: dlc
				? `${Project.current?.systems?.PATH_DLCS}/${dlc}`
				: `${Project.current?.getPath()}/`) + Paths.FONTS
		);
	}

	getPath(): string {
		return this.id === -1 || !this.name ? '' : Font.getFolder(this.isBR, this.dlc) + '/' + this.name;
	}

	async getFontFace(name: string): Promise<string> {
		return `@font-face {
			font-family: "${name}";
			src: url("${this.isBR ? this.getPath() : (await LocalFile.readFile(this.getPath())) ?? ''}");
		}`;
	}
}

export { Font };
