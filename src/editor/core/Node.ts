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
import { BINDING, BindingType, CopiedItemsType, LOCAL_FORAGE, Paths, Utils } from '../common';
import { LocalFile } from './LocalFile';
import { Project } from './Project';

export const NODE_CONSTRUCTOR_KIND = {
	Base: () => Model.Base,
	TreeMapTag: () => Model.TreeMapTag,
};

class Node extends Serializable {
	public static readonly JSON_CHILDREN = 'children';

	public children: Node[] = [];
	public content!: Model.Base;
	public parent: Node | null = null;
	public expanded: boolean = true;

	public static readonly bindings: BindingType[] = [['expanded', 'e', true, BINDING.BOOLEAN]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Node.bindings, ...additionnalBinding];
	}

	static create(content?: Model.Base, children: Node[] = [], parent: Node | null = null): Node {
		const node = new Node();
		if (content === undefined) {
			content = new Model.Base();
		}
		node.content = content as Model.Base;
		node.children = children;
		node.parent = parent;
		node.updateParents();
		return node;
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

	static getPathByID(nodes: Node[], id: number): string {
		const node = Node.getNodeByID(nodes, id);
		return node ? node.getPath(false) : 'ERROR: Cannot find path';
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

	static getNotExpandedItemsList(nodes: Node[], list: number[] = []): number[] {
		for (const node of nodes) {
			if (!node.expanded) {
				list.push(node.content.id);
			}
			if (node.children.length > 0) {
				list = this.getNotExpandedItemsList(node.children, list);
			}
		}
		return list;
	}

	static getAllIDs(nodes: Node[], ids: number[] = []): number[] {
		for (const node of nodes) {
			ids.push(node.content.id);
			if (node.children.length > 0) {
				ids = this.getAllIDs(node.children, ids);
			}
		}
		return ids;
	}

	getIcon() {
		return this.content.getIcon();
	}

	copy(node: Node): void {
		this.children = node.children.map((child) => child.clone());
		this.content = node.content.clone();
		this.expanded = node.expanded;
		this.updateParents();
	}

	clone(): Node {
		const node = new Node();
		node.copy(this);
		return node;
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

	static async loadToPaste(): Promise<CopiedItemsType | null> {
		const pathCurrentCopy = Paths.join(LOCAL_FORAGE.ENGINE, Paths.FILE_CURRENT_COPY);
		const file = await LocalFile.getFile(pathCurrentCopy);
		if (file && file.content.length > 0) {
			const content = JSON.parse(file.content);
			const constructorClass = NODE_CONSTRUCTOR_KIND[content.type as keyof typeof NODE_CONSTRUCTOR_KIND]();
			const nodes = content.json.map((jsonNode: any) => {
				const node = new Node();
				node.read(jsonNode, [], constructorClass);
				return node;
			});
			return {
				values: nodes,
				constructorClass,
				pathProject: content.pathProject,
			};
		}
		return null;
	}

	static async saveToCopy(nodes: Node[]): Promise<CopiedItemsType> {
		const pathCurrentCopy = Paths.join(LOCAL_FORAGE.ENGINE, Paths.FILE_CURRENT_COPY);
		const pathProject = Project.current!.getPath();
		const json = nodes.map((node) => {
			const nodeJson = {};
			node.write(nodeJson);
			return nodeJson;
		});
		const constructorClass = nodes[0].content.constructor;
		const content = {
			type: `${constructorClass.name}`,
			pathProject,
			json,
		};
		await LocalFile.createFile(pathCurrentCopy, JSON.stringify(content));
		return {
			values: nodes.map((node) => node.clone()),
			constructorClass,
			pathProject,
		};
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = [], constructorClass: any = Model.Base) {
		super.read(json, Node.getBindings(additionnalBinding));
		if (!this.content) {
			this.content = new constructorClass();
		}
		this.content.read(json);
		if (json[Node.JSON_CHILDREN]) {
			for (const jsonNode of json[Node.JSON_CHILDREN]) {
				const node = new Node();
				node.read(jsonNode, [], constructorClass);
				this.children.push(node);
			}
		}
		this.updateParents();
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, Node.getBindings(additionnalBinding));
		this.content.write(json);
		Utils.writeList(this.children, json, Node.JSON_CHILDREN);
	}
}

export { Node };
