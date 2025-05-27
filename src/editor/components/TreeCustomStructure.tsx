/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { ArrayUtils, DYNAMIC_VALUE_KIND } from '../common';
import { Node } from '../core/Node';
import { Model } from '../Editor';
import Tree from './Tree';

type Props = {
	list: Node[];
	onListUpdated?: () => void;
	disabled?: boolean;
};

function TreeCustomStructure({ list, onListUpdated, disabled }: Props) {
	const [updatedList, setUpdatedList] = useState<Node[] | null>(null);
	const [defaultModel, setDefaultModel] = useState<Model.CustomStructure>();

	const handleSelectedItem = (node: Node | null, isClick: boolean) => {
		if (isClick && node && node.parent) {
			const model = new Model.CustomStructure();
			model.applyDefault();
			const structure = node.parent.content as Model.CustomStructure;
			if (structure.isList || structure.value?.kind === DYNAMIC_VALUE_KIND.CUSTOM_LIST) {
				model.isProperty = false;
			}
			setDefaultModel(model);
		}
	};

	const handleAcceptItem = (node: Node, isNew: boolean) => {
		const structure = node.content as Model.CustomStructure;
		const parentChildren = node.parent?.children;
		if (parentChildren) {
			const index = parentChildren.indexOf(node);
			const nextNode = parentChildren[index + 1];
			if (
				structure.value.kind === DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE ||
				structure.value.kind === DYNAMIC_VALUE_KIND.CUSTOM_LIST
			) {
				if (!isNew) {
					if (nextNode) {
						const next = nextNode.content as Model.CustomStructure;
						if (next.isClosure) {
							if (next.isList !== (structure.value.kind === DYNAMIC_VALUE_KIND.CUSTOM_LIST)) {
								node.children = [];
							}
							next.isList = structure.value.kind === DYNAMIC_VALUE_KIND.CUSTOM_LIST;
							return;
						}
					}
				}
				const content = new Model.CustomStructure();
				content.applyDefault();
				content.id = Node.getNewID(list);
				content.isClosure = true;
				content.isList = structure.value.kind === DYNAMIC_VALUE_KIND.CUSTOM_LIST;
				ArrayUtils.insertAt(parentChildren, index + 1, Node.create(content, [], node.parent));
			} else {
				if (!isNew && nextNode) {
					const next = nextNode.content as Model.CustomStructure;
					if (next.isClosure) {
						node.children = [];
						ArrayUtils.removeAt(parentChildren, index + 1);
						return;
					}
				}
			}
		}
	};

	const handlePasteItem = (node: Node) => {
		const structure = node.content as Model.CustomStructure;
		if (structure.isClosure) {
			return;
		}
		const parent = node.parent?.content as Model.CustomStructure;
		if (parent) {
			if ((parent.value && parent.value.kind === DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE) || !parent.isList) {
				structure.isProperty = true;
				if (structure.name.length === 0) {
					structure.name = 'new';
				}
				while (node.parent?.children?.some((n) => n !== node && n.content.name === structure.name)) {
					structure.name += '_copy';
				}
			} else {
				structure.isProperty = false;
				structure.name = '';
				structure.description = '';
			}
		}
	};

	useLayoutEffect(() => {
		Node.attributeIDsToList(list);
		setUpdatedList(list);
		// eslint-disable-next-line
	}, [list]);

	return updatedList ? (
		<Tree
			list={updatedList}
			constructorType={Model.CustomStructure}
			onListUpdated={onListUpdated}
			disabled={disabled}
			onSelectedItem={handleSelectedItem}
			onAccept={handleAcceptItem}
			onPasteItem={handlePasteItem}
			defaultNewModel={defaultModel}
			multipleLevels
			canBeEmpty
			scrollable
			multipleSelection
			cannotAddEditRemoveRoot
			cannotDragDrop
		/>
	) : null;
}

export default TreeCustomStructure;
