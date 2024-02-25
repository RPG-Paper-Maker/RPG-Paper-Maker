/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { Serializable } from './Serializable';
import { Utils } from '../common';

class Node extends Serializable {
	public static readonly JSON_CHILDREN = 'children';

	public children: Node[];
	public content: Model.Base;
	public parent: Node | null;

	constructor(content?: Model.Base, children: Node[] = [], parent: Node | null = null) {
		super();
		if (content === undefined) {
			content = Model.Base.createDefault();
		}
		this.content = content;
		this.children = children;
		this.parent = parent;
		this.updateParents();
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

	static getNewID(nodes: Node[], positive = true): number {
		let exists = true;
		const addition = positive ? 1 : -1;
		let id = addition;
		do {
			exists = this.checkIDExists(nodes, id);
			if (exists) {
				id = id + addition;
			}
		} while (exists);
		return id;
	}

	static checkIDExists(nodes: Node[], id: number): boolean {
		for (const node of nodes) {
			if (node.content.id === id) {
				return true;
			}
			if (node.children.length > 0 && this.checkIDExists(node.children, id)) {
				return true;
			}
		}
		return false;
	}

	getIcon() {
		return this.content.getIcon();
	}

	getPath(includesRoot = true): string {
		return `${
			this.parent ? `${this.parent.getPath(includesRoot)}${this.parent.parent || includesRoot ? '/' : ''}` : ''
		}${includesRoot || this.parent ? this.toString() : ''}`;
	}

	toString() {
		return this.content.toString();
	}

	toStrings() {
		return this.content.toStrings();
	}

	updateParents() {
		for (const child of this.children) {
			child.parent = this;
			child.updateParents();
		}
	}

	read(json: Record<string, any>) {
		this.content.read(json);
		Utils.readList(this.children, json[Node.JSON_CHILDREN], Node);
		this.updateParents();
	}

	write(json: Record<string, any>) {
		this.content.write(json);
		Utils.writeList(this.children, json, Node.JSON_CHILDREN);
	}
}

export { Node };
