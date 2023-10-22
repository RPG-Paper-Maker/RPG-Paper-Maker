/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Model } from '../Editor';
import { Paths } from '../common/Paths';
import { Utils } from '../common/Utils';
import { Node } from '../core/Node';
import { Project } from '../core/Project';
import { Serializable } from '../core/Serializable';
import { TreeMapTag } from '../models';

class TreeMaps extends Serializable {
	public static readonly JSON_TREE = 'tree';
	public static readonly JSON_TABS = 'tabs';
	public static readonly JSON_CURRENT_MAP = 'currentMap';

	public tree: Node[] = [];
	public tabs: number[] = [1];
	public currentMap = 1;

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

	read(json: any) {
		const root = new Node(Model.TreeMapTag.create(-1, 'Maps', true));
		this.readRoot(json[TreeMaps.JSON_TREE], root);
		this.tree = [root];
		if (json[TreeMaps.JSON_TABS] !== undefined) {
			this.tabs = json[TreeMaps.JSON_TABS];
		}
		if (json[TreeMaps.JSON_CURRENT_MAP] !== undefined) {
			this.currentMap = json[TreeMaps.JSON_CURRENT_MAP];
		}
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

	write(json: any) {
		Utils.writeList(this.tree[0].children, json, TreeMaps.JSON_TREE);
		json[TreeMaps.JSON_TABS] = this.tabs;
		if (this.currentMap !== -1) {
			json[TreeMaps.JSON_CURRENT_MAP] = this.currentMap;
		}
	}
}

export { TreeMaps };
