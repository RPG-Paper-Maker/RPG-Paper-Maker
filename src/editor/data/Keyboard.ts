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
import { detectMovementKeys } from './EngineSettings';

const { t } = i18next;

class Keyboard extends Serializable {
	public list!: Model.Keyboard[];
	public keyAction!: number;
	public keyCancel!: number;
	public keyUp!: number;
	public keyDown!: number;
	public keyLeft!: number;
	public keyRight!: number;

	public static readonly bindings: BindingType[] = [
		['list', 'list', undefined, BINDING.LIST, Model.Keyboard],
		['keyAction', 'a', undefined, BINDING.NUMBER],
		['keyCancel', 'c', undefined, BINDING.NUMBER],
		['keyUp', 'u', undefined, BINDING.NUMBER],
		['keyDown', 'd', undefined, BINDING.NUMBER],
		['keyLeft', 'l', undefined, BINDING.NUMBER],
		['keyRight', 'r', undefined, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	getByID(id: number): Model.Keyboard | undefined {
		return this.list.find((key) => key.id === id)!;
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_KEYBOARD);
	}

	async applyKeyboardLayout() {
		const [up, down, left, right] = await detectMovementKeys();
		// Hero movement
		this.list[0].shortcuts = [[up]];
		this.list[1].shortcuts = [[down]];
		this.list[2].shortcuts = [[left]];
		this.list[3].shortcuts = [[right]];
		// Menu movement (keep arrow keys as primary)
		this.list[4].shortcuts = [['ArrowUp'], [up]];
		this.list[5].shortcuts = [['ArrowDown'], [down]];
		this.list[6].shortcuts = [['ArrowLeft'], [left]];
		this.list[7].shortcuts = [['ArrowRight'], [right]];
	}

	translateDefaults(): void {
		this.list[0].updateMainName(t('move.hero.up'));
		this.list[1].updateMainName(t('move.hero.down'));
		this.list[2].updateMainName(t('move.hero.left'));
		this.list[3].updateMainName(t('move.hero.right'));
		this.list[4].updateMainName(t('move.menu.up'));
		this.list[5].updateMainName(t('move.menu.down'));
		this.list[6].updateMainName(t('move.menu.left'));
		this.list[7].updateMainName(t('move.menu.right'));
		this.list[8].updateMainName(t('move.camera.left'));
		this.list[9].updateMainName(t('move.camera.right'));
		this.list[10].updateMainName(t('action'));
		this.list[11].updateMainName(t('cancel'));
		this.list[12].updateMainName(t('open.close.main.menu'));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Keyboard.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Keyboard.getBindings(additionnalBinding));
	}
}

export { Keyboard };
