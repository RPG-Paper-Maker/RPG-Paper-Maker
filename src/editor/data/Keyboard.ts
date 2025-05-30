/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING, JSONType, Paths } from '../common';
import { Project } from '../core/Project';
import { BindingType, Serializable } from '../core/Serializable';

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

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, Keyboard.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Keyboard.getBindings(additionnalBinding));
	}
}

export { Keyboard };
