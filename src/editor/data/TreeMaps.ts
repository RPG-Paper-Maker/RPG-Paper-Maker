/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { BINDING } from '../common/Enum';
import { Paths } from '../common/Paths';
import { BindingType } from '../common/Types';
import { Utils } from '../common/Utils';
import { Node } from '../core/Node';
import { Project } from '../core/Project';
import { Serializable } from '../core/Serializable';
import { TreeMapTag } from '../models';

class TreeMaps extends Serializable {
	public static readonly JSON_TREE = 'tree';

	public tree: Node[] = [];
	public tabs!: number[];
	public currentMap!: number;

	public static readonly bindings: BindingType[] = [
		['tabs', 'tabs', [1], BINDING.NUMBER],
		['currentMap', 'currentMap', 1, BINDING.NUMBER],
	];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...TreeMaps.bindings, ...additionnalBinding];
	}

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_TREE_MAPS);
	}

	private isAllMapsSavedRecursive(nodes: Node[]): boolean {
		for (const node of nodes) {
			if (!(node.content as TreeMapTag).saved) {
				return false;
			}
			if (!this.isAllMapsSavedRecursive(node.children)) {
				return false;
			}
		}
		return true;
	}

	isAllMapsSaved(): boolean {
		return this.isAllMapsSavedRecursive(this.tree);
	}

	private async saveAllTagsRecursive(nodes: Node[]) {
		for (const node of nodes) {
			await (node.content as TreeMapTag).saveFiles();
			await this.saveAllTagsRecursive(node.children);
		}
	}

	async saveAllTags() {
		await this.saveAllTagsRecursive(this.tree);
		await this.save();
	}

	readRoot(json: Record<string, any>[], root: Node) {
		const children: Node[] = [];
		for (const obj of json) {
			const tag = new TreeMapTag();
			tag.read(obj);
			const node = new Node(tag);
			node.parent = root;
			children.push(node);
			const objChildren = obj[Node.JSON_CHILDREN];
			if (objChildren) {
				this.readRoot(objChildren, node);
			}
		}
		root.children = children;
	}

	read(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.read(json, TreeMaps.getBindings(additionnalBinding));
		const root = new Node(Model.TreeMapTag.create(-1, 'Maps', true));
		this.readRoot(json[TreeMaps.JSON_TREE], root);
		this.tree = [root];
	}

	write(json: Record<string, any>, additionnalBinding: BindingType[] = []) {
		super.write(json, TreeMaps.getBindings(additionnalBinding));
		Utils.writeList(this.tree[0].children, json, TreeMaps.JSON_TREE);
	}
}

export { TreeMaps };
