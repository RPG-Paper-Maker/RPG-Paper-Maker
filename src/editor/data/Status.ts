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

class Status extends Serializable {
	public list!: Model.Status[];

	public static readonly bindings: BindingType[] = [['list', 'status', undefined, BINDING.LIST, Model.Status]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_STATUS);
	}

	getByID(id: number): Model.Status {
		return this.list.find((status) => status.id === id)!;
	}

	translateDefaults(): void {
		this.list[0].setNameMessages(t('ko'));
		this.list[1].setNameMessages(
			t('poisoned'),
			t('message.poisoned'),
			t('message.poisoned'),
			t('message.poisoned.heal'),
		);
		this.list[2].setNameMessages(t('burnt'), t('message.burnt'), t('message.burnt'), t('message.burnt.heal'));
		this.list[3].setNameMessages(
			t('paralized'),
			t('message.paralyzed'),
			t('message.paralyzed'),
			t('message.paralyzed.heal'),
		);
		this.list[4].setNameMessages(
			t('confused'),
			t('message.confused'),
			t('message.confused'),
			t('message.confused.heal'),
		);
		this.list[5].setNameMessages(t('muted'), t('message.muted'), t('message.muted'), t('message.muted.heal'));
		this.list[6].setNameMessages(
			t('sleeping'),
			t('message.sleeping'),
			t('message.sleeping'),
			t('message.sleeping.heal'),
		);
		this.list[7].setNameMessages(t('blind'), t('message.blind'), t('message.blind'), t('message.blind.heal'));
		this.list[8].setNameMessages(t('power'));
		this.list[9].setNameMessages(t('war.cry'));
		this.list[10].setNameMessages(t('concentration'));
		this.list[11].setNameMessages(t('weaked'), t('message.weakened'), t('message.weakened'));
		this.list[12].setNameMessages(t('broken'), t('message.broken'), t('message.broken'));
		this.list[13].setNameMessages(t('barrier'));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Status.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Status.getBindings(additionnalBinding));
	}
}

export { Status };
