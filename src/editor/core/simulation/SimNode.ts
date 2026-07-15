/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { EVENT_COMMAND_KIND } from '../../common';
import { Node as EditorNode } from '../Node';
import type { CommandBase } from './SimulationCommands';

class SimNode {
	public data: CommandBase | null;
	public kind: EVENT_COMMAND_KIND;
	public parent: SimNode | null;
	public firstChild: SimNode | null = null;
	public lastChild: SimNode | null = null;
	public next: SimNode | null = null;
	public editorNode: EditorNode | null;

	constructor(
		parent: SimNode | null,
		data: CommandBase | null,
		kind: EVENT_COMMAND_KIND = EVENT_COMMAND_KIND.NONE,
		editorNode: EditorNode | null = null,
	) {
		this.parent = parent;
		this.data = data;
		this.kind = kind;
		this.editorNode = editorNode;
	}

	add(data: CommandBase | null, kind: EVENT_COMMAND_KIND, editorNode: EditorNode | null): SimNode {
		const node = new SimNode(this, data, kind, editorNode);
		if (this.firstChild === null) {
			this.firstChild = node;
		} else {
			this.lastChild!.next = node;
		}
		this.lastChild = node;
		return node;
	}

	isRoot(): boolean {
		return this.parent === null;
	}

	isAncestorOf(node: SimNode | null): boolean {
		let current = node;
		while (current !== null) {
			if (current === this) {
				return true;
			}
			current = current.parent;
		}
		return false;
	}
}

export { SimNode };
