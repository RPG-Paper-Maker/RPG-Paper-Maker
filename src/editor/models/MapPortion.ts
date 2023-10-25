/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene } from '../Editor';
import { Paths } from '../common/Paths';
import { Portion } from '../core/Portion';
import { Project } from '../core/Project';
import { Floor, Sprite } from '../mapElements';
import { BINDING, Base, BindingType } from './Base';

class MapPortion extends Base {
	public globalPortion: Portion;
	public floors: Map<string, Floor> = new Map();
	public sprites: Map<string, Sprite> = new Map();

	public static readonly bindings: BindingType[] = [
		['floors', 'floors', null, BINDING.MAP_POSITION, Floor],
		['sprites', 'sprites', null, BINDING.MAP_POSITION, Sprite],
	];

	constructor(globalPortion: Portion) {
		super();
		this.globalPortion = globalPortion;
	}

	static getBindings(additionnalBinding: BindingType[]) {
		return [...MapPortion.bindings, ...additionnalBinding];
	}

	getFileName(): string {
		return this.globalPortion.getFileName();
	}

	getPath(temp: boolean = false): string {
		if (!Project.current || !Scene.Map.current) {
			return '';
		}
		let path = Scene.Map.current.getPath();
		if (temp) {
			path = Paths.join(path, Paths.TEMP);
		}
		return Paths.join(path, this.getFileName());
	}

	async load() {
		await super.load(true); // Try to read temp files by default
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, MapPortion.getBindings(additionnalBinding));
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, MapPortion.getBindings(additionnalBinding));
		json.autotiles = [];
		json.moun = [];
		json.walls = [];
		json.objs3d = [];
		json.objs = [
			{
				k: [7, 0, 0, 7, 0],
				v: { canBeTriggeredAnotherObject: false, hId: 2, id: 1, name: 'Hero', ooepf: false },
			},
		];
	}
}

export { MapPortion };
