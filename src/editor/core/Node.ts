/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';

class Node {
	public children: Node[];
	public content: Model.Base;
	public parent: Node | null;

	constructor(content?: Model.Base, children: Node[] = [], parent: Node | null = null) {
		if (content === undefined) {
			content = new Model.Base();
		}
		this.content = content;
		this.children = children;
		this.parent = parent;
		for (const child of this.children) {
			child.parent = this;
		}
	}

	static getNodeByID(nodes: Node[], id: number): Node | null {
		for (const node of nodes) {
			if (node.content.id === id) {
				return node;
			}
			const child = this.getNodeByID(node.children, id);
			if (child) {
				return child;
			}
		}
		return null;
	}

	getIcon() {
		return this.content.getIcon();
	}

	getPath(): string {
		return `${this.parent ? `${this.parent.getPath()}/` : ''}${this.toString()}`;
	}

	toString() {
		return this.content.toString();
	}

	toStrings() {
		return this.content.toStrings();
	}
}

export { Node };
