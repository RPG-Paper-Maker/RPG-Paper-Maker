/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Constants, Paths } from '../common';
import { LocalFile } from '../core/LocalFile';
import { Project } from '../core/Project';
import { Asset } from './Asset';

class Font extends Asset {
	static getFolder(isBR: boolean, dlc: string): string {
		return Paths.join(
			isBR
				? Project.current?.systems?.PATH_BR
				: dlc
					? Paths.join(Project.current?.systems?.PATH_DLCS, dlc)
					: Project.current?.getPath(),
			this.getLocalFolder(),
		);
	}

	static getLocalFolder(): string {
		return Paths.FONTS;
	}

	static createFont(id: number, name: string, isBR: boolean, dlc: string): Font {
		const font = new Font();
		font.id = id;
		font.name = name;
		font.isBR = isBR;
		font.dlc = dlc;
		return font;
	}

	getPath(local = false): string {
		return this.id === -1 || !this.name
			? ''
			: Paths.join(local ? Font.getLocalFolder() : Font.getFolder(this.isBR, this.dlc), this.name);
	}

	async getFontFace(name: string, deployed: boolean): Promise<string> {
		return `@font-face {
			font-family: "${name}";
			src: url("${deployed ? `../${this.getPath(true)}` : this.isBR || Constants.IS_DESKTOP ? this.getPath() : ((await LocalFile.readFile(this.getPath())) ?? '')}");
		}`;
	}
}

export { Font };
