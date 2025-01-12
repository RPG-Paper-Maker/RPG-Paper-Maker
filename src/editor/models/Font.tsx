/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, JSONType, Paths } from '../common';
import { Project } from '../core';
import { Base } from './Base';

class Font extends Base {
	public isBR!: boolean;
	public dlc!: string;

	public static readonly bindings: BindingType[] = [
		['isBR', 'br', undefined, BINDING.BOOLEAN],
		['dlc', 'd', '', BINDING.STRING],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Font.bindings, ...additionnalBinding];
	}

	static getFolder(isBR: boolean, dlc: string): string {
		return (
			(isBR ? Project.current!.systems.PATH_BR : dlc ? `${Project.current!.systems.PATH_DLCS}/${dlc}` : '') +
			Paths.FONTS
		);
	}

	getPath(): string {
		return this.id === -1 || !this.name ? '' : Font.getFolder(this.isBR, this.dlc) + '/' + this.name;
	}

	getIcon() {
		return <img src='./Assets/bullet-br.png' alt='br bullet' width='16px' />;
	}

	copy(font: Font): void {
		super.copy(font, Font.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Font.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Font.getBindings(additionnalBinding));
	}
}

export { Font };
