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
import { BINDING, BindingType, Constants, CopiedItemsType, JSONType, LOCAL_FORAGE, Paths, Utils } from '../common';
import { Project } from './Project';
import { Platform } from '../common/Platform';

export const NODE_CONSTRUCTOR_KIND = {
	Base: () => Model.Base,
	TreeMapTag: () => Model.TreeMapTag,
	MapObjectState: () => Model.MapObjectState,
};

class Node extends Serializable {
	public static readonly JSON_CHILDREN = 'children';

	public children: Node[] = [];
	public content!: Model.Base;
	public parent: Node | null = null;
	public expanded = true;
	public draggable = true;

	public static readonly bindings: BindingType[] = [['expanded', 'e', true, BINDING.BOOLEAN]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...Node.bindings, ...additionnalBinding];
	}

	static create(content?: Model.Base, children: Node[] = [], parent: Node | null = null, draggable = true): Node {
		const node = new Node();
		if (content === undefined) {
			content = new Model.Base();
		}
		node.content = content as Model.Base;
		node.children = children;
		node.parent = parent;
		node.updateParents();
		node.draggable = draggable;
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

	static getNameByID(nodes: Node[], id: number): string {
		return Node.getNodeByID(nodes, id)?.content.name ?? '';
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

	static createList(list: Model.Base[], clone = true): Node[] {
		return list.map((content) => Node.create(clone ? content.clone() : content));
	}

	static createListFromNodes<T>(nodes: Node[]): T[] {
		return nodes.map((node) => node.content as T);
	}

	isFolder() {
		return this.content.id < 0;
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
		const pathCurrentCopy = Paths.join(
			Constants.IS_DESKTOP ? window.__dirname : LOCAL_FORAGE.ENGINE,
			Paths.FILE_CURRENT_COPY
		);
		const content = await Platform.readFile(pathCurrentCopy);
		if (content && content.length > 0) {
			const json = JSON.parse(content);
			const constructorClass = NODE_CONSTRUCTOR_KIND[json.type as keyof typeof NODE_CONSTRUCTOR_KIND]();
			const nodes = json.json.map((jsonNode: JSONType) => {
				const node = new Node();
				node.read(jsonNode, [], constructorClass);
				return node;
			});
			return {
				values: nodes,
				constructorClass,
				pathProject: json.pathProject,
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
		const constructorClass = nodes[0].content.constructor as typeof Serializable;
		const content = {
			type: `${constructorClass.name}`,
			pathProject,
			json,
		};
		await Platform.createFile(pathCurrentCopy, JSON.stringify(content));
		return {
			values: nodes.map((node) => node.clone()),
			constructorClass,
			pathProject,
		};
	}

	read(json: JSONType, additionnalBinding: BindingType[] = [], constructorClass = Model.Base) {
		super.read(json, Node.getBindings(additionnalBinding));
		if (!this.content) {
			this.content = new constructorClass();
		}
		this.content.read(json);
		if (json[Node.JSON_CHILDREN]) {
			for (const jsonNode of json[Node.JSON_CHILDREN] as JSONType[]) {
				const node = new Node();
				node.read(jsonNode, [], constructorClass);
				this.children.push(node);
			}
		}
		this.updateParents();
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, Node.getBindings(additionnalBinding));
		this.content.write(json);
		Utils.writeList(this.children, json, Node.JSON_CHILDREN);
	}
}

export { Node };
