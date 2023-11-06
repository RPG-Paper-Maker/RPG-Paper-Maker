/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useState, useEffect } from 'react';
import '../styles/Tree.css';
import TreeItem from './TreeItem';
import { ArrayUtils } from '../common';
import { Node } from '../core';

type Props = {
	list: Node[];
	defaultSelectedID?: number;
	onSelectedItem?: (node: Node | null, isClick: boolean) => void;
	forcedCurrentSelectedItemID?: number | null;
	setForcedCurrentSelectedItemID?: (forced: number | null) => void;
};

function Tree({
	list,
	defaultSelectedID,
	onSelectedItem,
	forcedCurrentSelectedItemID,
	setForcedCurrentSelectedItemID,
}: Props) {
	const defaultID =
		defaultSelectedID === undefined ? (list && list.length && list[0].content.id) || -1 : defaultSelectedID;
	const [currentSelectedItemID, setCurrentSelectedItemID] = useState(defaultID);
	const [notExpandedItemsList, setNotExpandedItemsList] = useState<number[]>([]);

	const isSelected = (id: number) => id === currentSelectedItemID;

	const handleSwitchExpandedItem = (id: number, expanded: boolean) => {
		const newList = [...notExpandedItemsList];
		if (expanded) {
			ArrayUtils.removeElement(newList, id);
		} else {
			newList.push(id);
		}
		setNotExpandedItemsList(newList);
	};

	const handleClickItem = (node: Node) => {
		setCurrentSelectedItemID(node.content.id);
		if (onSelectedItem) {
			onSelectedItem(node, true);
		}
	};

	useEffect(() => {
		if (
			forcedCurrentSelectedItemID !== undefined &&
			forcedCurrentSelectedItemID !== null &&
			setForcedCurrentSelectedItemID
		) {
			setCurrentSelectedItemID(forcedCurrentSelectedItemID);
			setForcedCurrentSelectedItemID(null);
			if (onSelectedItem) {
				onSelectedItem(Node.getNodeByID(list, forcedCurrentSelectedItemID), false);
			}
		}
		// eslint-disable-next-line
	}, [forcedCurrentSelectedItemID, setForcedCurrentSelectedItemID]);

	useEffect(() => {
		const node = Node.getNodeByID(list, currentSelectedItemID);
		if (node) {
			setCurrentSelectedItemID(node.content.id);
			if (onSelectedItem) {
				onSelectedItem(node, false);
			}
		}
	}, []);

	const getTreeItems = (nodes: Node[], level = 0, items: ReactNode[] = []) => {
		for (const node of nodes) {
			items.push(
				<TreeItem
					key={node.content.id}
					node={node}
					level={level}
					selected={isSelected(node.content.id)}
					onSwitchExpanded={handleSwitchExpandedItem}
					onClick={handleClickItem}
				/>
			);
			if (!ArrayUtils.contains(notExpandedItemsList, node.content.id)) {
				getTreeItems(node.children, level + 1, items);
			}
		}
		return items;
	};

	return <div className='tree'>{getTreeItems(list)}</div>;
}

export default Tree;
