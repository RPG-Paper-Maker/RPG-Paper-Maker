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

class Heroes extends Serializable {
	public list!: Model.Hero[];

	public static readonly bindings: BindingType[] = [['list', 'heroes', undefined, BINDING.LIST, Model.Hero]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_HEROES);
	}

	getByID(id: number): Model.Hero {
		return this.list.find((hero) => hero.id === id)!;
	}

	translateDefaults(): void {
		this.list[0].updateMainName(t('lucas'));
		this.list[1].updateMainName(t('kate'));
		this.list[2].updateMainName(t('bibi'));
		this.list[3].updateMainName(t('shana'));
		this.list[4].updateMainName(t('charles'));
		this.list[5].updateMainName(t('fortune'));
		this.list[6].updateMainName(t('caitlyn'));
		this.list[7].updateMainName(t('lily'));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Heroes.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Heroes.getBindings(additionnalBinding));
	}
}

export { Heroes };
