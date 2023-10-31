/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Scene } from '../Editor';
import { BINDING, ElementMapKind } from '../common/Enum';
import { Paths } from '../common/Paths';
import { BindingType } from '../common/Types';
import { Portion } from '../core/Portion';
import { Project } from '../core/Project';
import { Serializable } from '../core/Serializable';
import { Sprite, Floor, Autotile } from '../mapElements';

class MapPortion extends Serializable {
	public globalPortion: Portion;
	public lands: Map<string, Floor | Autotile> = new Map();
	public sprites: Map<string, Sprite> = new Map();

	public static readonly bindings: BindingType[] = [
		[
			'lands',
			'lands',
			null,
			BINDING.MAP_POSITION,
			(json: Record<string, any>) => (json.k === ElementMapKind.Floors ? Floor : Autotile),
		],
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
