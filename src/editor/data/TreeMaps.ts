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
	public static readonly JSON_TREE: string = 'tree';

	public tree: Node[] = [];

	getPath(): string {
		return Paths.join(Project.current!.getPath(), Paths.FILE_TREE_MAPS);
	}

	read(json: any) {
		const root = new Node(new Model.TreeMapTag(-1, 'Maps'));
		this.readRoot(json[TreeMaps.JSON_TREE], root);
		this.tree = [root];
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
	}
}

export { TreeMaps };
