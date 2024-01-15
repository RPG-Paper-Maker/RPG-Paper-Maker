/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING, BindingType, Constants, Paths } from '../common';
import { Position, Project, Serializable } from '../core';

class System extends Serializable {
	public projectName!: Model.Localization;
	public SQUARE_SIZE!: number;
	public PORTIONS_RAY!: number;
	public PATH_BR!: string;
	public PATH_DLCS!: string;
	public FRAMES!: number;
	public autotilesFrames!: number;
	public autotilesFrameDuration!: number;
	public heroMapID!: number;
	public heroMapPosition!: Position;
	public json: any; // TEMP, will be removed later

	public static readonly bindings: BindingType[] = [
		['projectName', 'pn', 'Project without name', BINDING.OBJECT, Model.Localization],
		['SQUARE_SIZE', 'ss', undefined, BINDING.NUMBER],
		['PORTIONS_RAY', 'portionRayIngame', 3, BINDING.NUMBER],
		['PATH_BR', 'pathBR', undefined, BINDING.STRING],
		['autotilesFrames', 'autotilesFrames', 4, BINDING.NUMBER],
		['autotilesFrameDuration', 'autotilesFrameDuration', 150, BINDING.NUMBER],
		['heroMapID', 'idMapHero', 1, BINDING.NUMBER],
		['heroMapPosition', 'hmp', new Position(7, 0, 0, 7), BINDING.POSITION],
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
		this.json = json;
		this.PATH_BR = './BR/';
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		Object.assign(json, this.json);
		super.write(json, System.getBindings(additionnalBinding));
	}
}

export { System };
