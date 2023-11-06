/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { BINDING, BindingType, Constants, Paths } from '../common';
import { Project, Serializable } from '../core';

class System extends Serializable {
	public projectName!: string;
	public SQUARE_SIZE!: number;
	public PATH_BR!: string;
	public PATH_DLCS!: string;
	public autotilesFrames!: number;
	public autotilesFrameDuration!: number;

	public static readonly bindings: BindingType[] = [
		['projectName', 'pn', 'Project without name', BINDING.STRING],
		['SQUARE_SIZE', 'ss', undefined, BINDING.NUMBER],
		['PATH_BR', 'pathBR', undefined, BINDING.STRING],
		['autotilesFrames', 'autotilesFrames', 4, BINDING.NUMBER],
		['autotilesFrameDuration', 'autotilesFrameDuration', 150, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...System.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_SYSTEM);
	}

	getCoefSquareSize(): number {
		return this.SQUARE_SIZE / Constants.BASE_SQUARE_SIZE;
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, System.getBindings(additionnalBinding));
		this.PATH_BR = './BR/';
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, System.getBindings(additionnalBinding));
	}
}

export { System };
