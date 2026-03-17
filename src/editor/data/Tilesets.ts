/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import i18next from 'i18next';
import { Model } from '../Editor';
import { BINDING, JSONType, Paths } from '../common';
import { Project } from '../core/Project';
import { BindingType, Serializable } from '../core/Serializable';

const { t } = i18next;

class Tilesets extends Serializable {
	public list!: Model.Tileset[];

	public static readonly bindings: BindingType[] = [['list', 'list', undefined, BINDING.LIST, Model.Tileset]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_TILESETS);
	}

	getTilesetByID(id: number): Model.Tileset {
		return this.list.find((tileset) => tileset.id === id)!;
	}

	translateDefaults(): void {
		this.list[0].name = t('plains.woods');
		this.list[1].name = t('haunted.plains.woods');
		this.list[2].name = t('snow.plains.woods');
		this.list[3].name = t('beach.desert');
		this.list[4].name = t('jungle');
		this.list[5].name = t('town');
		this.list[6].name = t('desert.town');
		this.list[7].name = t('snow.town');
		this.list[8].name = t('inside');
		this.list[9].name = t('school');
		this.list[10].name = t('shop');
		this.list[11].name = t('sewers');
		this.list[12].name = t('dungeon.mines');
		this.list[13].name = t('castle');
		this.list[14].name = t('volcano');
		this.list[15].name = t('spaceship');
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Tilesets.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Tilesets.getBindings(additionnalBinding));
	}
}

export { Tilesets };
