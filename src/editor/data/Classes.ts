/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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

class Classes extends Serializable {
	public list!: Model.Class[];

	public static readonly bindings: BindingType[] = [['list', 'classes', undefined, BINDING.LIST, Model.Class]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_CLASSES);
	}

	getByID(id: number): Model.Class {
		return this.list.find((classe) => classe.id === id)!;
	}

	translateDefaults(): void {
		this.list[0].updateMainName(t('knight'));
		this.list[1].updateMainName(t('warrior'));
		this.list[2].updateMainName(t('lancer'));
		this.list[3].updateMainName(t('thief'));
		this.list[4].updateMainName(t('white.mage'));
		this.list[5].updateMainName(t('black.mage'));
		this.list[6].updateMainName(t('gunner'));
		this.list[7].updateMainName(t('archer'));
		this.list[8].updateMainName(t('monster'));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Classes.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Classes.getBindings(additionnalBinding));
	}
}

export { Classes };
