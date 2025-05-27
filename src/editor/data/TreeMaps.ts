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
import { BINDING, BindingType, JSONType, Paths, Utils } from '../common';
import { Node } from '../core/Node';
import { Project } from '../core/Project';
import { Serializable } from '../core/Serializable';

const { t } = i18next;

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

	translateDefaults() {
		const root = this.tree[0];
		const introduction = root.children[0];
		introduction.content.name = t('introduction');
		introduction.children[0].content.name = t('starting.map');
		const battles = root.children[1];
		battles.content.name = t('battle.maps');
		battles.children[0].content.name = t('default');
	}

	private isAllMapsSavedRecursive(nodes: Node[]): boolean {
		for (const node of nodes) {
			if (!(node.content as Model.TreeMapTag).saved) {
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
			await (node.content as Model.TreeMapTag).saveFiles();
			await this.saveAllTagsRecursive(node.children);
		}
	}

	async saveAllTags() {
		await this.saveAllTagsRecursive(this.tree);
		await this.save();
	}

	private getAllMapsNodes(nodes: Node[], list: Model.Base[], basePath = '', level = 0) {
		for (const node of nodes) {
			if (node.children.length > 0) {
				this.getAllMapsNodes(
					node.children,
					list,
					level === 0 ? '' : `${basePath}${node.content.name}/`,
					level + 1
				);
			} else {
				list.push(Model.Base.create(node.content.id, `${basePath}${node.content.name}`));
			}
		}
	}

	getAllMapsList(): Model.Base[] {
		const list: Model.Base[] = [Model.Base.create(-1, t('this.map'))];
		this.getAllMapsNodes(this.tree, list);
		return list;
	}

	readRoot(json: JSONType[], root: Node) {
		const children: Node[] = [];
		for (const obj of json) {
			const tag = new Model.TreeMapTag();
			const node = Node.create(tag);
			node.read(obj);
			node.parent = root;
			children.push(node);
			const objChildren = obj[Node.JSON_CHILDREN] as JSONType[];
			if (objChildren) {
				this.readRoot(objChildren, node);
			}
		}
		root.children = children;
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, TreeMaps.getBindings(additionnalBinding));
		const root = Node.create(Model.TreeMapTag.create(-1, t('maps'), true), [], null, false);
		this.readRoot(json[TreeMaps.JSON_TREE] as JSONType[], root);
		this.tree = [root];
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, TreeMaps.getBindings(additionnalBinding));
		Utils.writeList(this.tree[0].children, json, TreeMaps.JSON_TREE);
	}
}

export { TreeMaps };
