/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useState, useEffect } from 'react';
import '../styles/Tree.css';
import TreeItem from './TreeItem';
import { ArrayUtils, CONTEXT_MENU_ITEM_KIND, KEY, MenuItemType, SPECIAL_KEY } from '../common';
import { Node } from '../core';
import ContextMenu from './ContextMenu';
import { Model } from '../Editor';

type Props = {
	list: Node[];
	constructorType?: any;
	contextMenuItems?: (CONTEXT_MENU_ITEM_KIND | MenuItemType)[];
	defaultSelectedID?: number;
	onSelectedItem?: (node: Node | null, isClick: boolean) => void;
	forcedCurrentSelectedItemID?: number | null;
	setForcedCurrentSelectedItemID?: (forced: number | null) => void;
};

function Tree({
	list,
	constructorType = Model.Base,
	contextMenuItems = [
		CONTEXT_MENU_ITEM_KIND.NEW,
		CONTEXT_MENU_ITEM_KIND.EDIT,
		CONTEXT_MENU_ITEM_KIND.COPY,
		CONTEXT_MENU_ITEM_KIND.PASTE,
		CONTEXT_MENU_ITEM_KIND.DELETE,
	],
	defaultSelectedID,
	onSelectedItem,
	forcedCurrentSelectedItemID,
	setForcedCurrentSelectedItemID,
}: Props) {
	const defaultID =
		defaultSelectedID === undefined ? (list && list.length && list[0].content.id) || -1 : defaultSelectedID;

	const [currentSelectedItemNode, setCurrentSelectedItemNode] = useState(Node.getNodeByID(list, defaultID));
	const [notExpandedItemsList, setNotExpandedItemsList] = useState<number[]>([]);

	const getNodeID = () => currentSelectedItemNode?.content?.id || -1;

	const isSelected = (id: number) => id === getNodeID();

	const handleSwitchExpandedItem = (id: number, expanded: boolean) => {
		const newList = [...notExpandedItemsList];
		if (expanded) {
			ArrayUtils.removeElement(newList, id);
		} else {
			newList.push(id);
		}
		setNotExpandedItemsList(newList);
	};

	const handleMouseDownItem = (node: Node) => {
		setCurrentSelectedItemNode(node);
		if (onSelectedItem) {
			onSelectedItem(node, true);
		}
	};

	const handleNewItem = async () => {};

	const handleEditItem = async () => {};

	const handleCopyItem = async () => {};

	const handlePasteItem = async () => {};

	const handleDeleteItem = async () => {};

	useEffect(() => {
		if (
			forcedCurrentSelectedItemID !== undefined &&
			forcedCurrentSelectedItemID !== null &&
			setForcedCurrentSelectedItemID
		) {
			const node = Node.getNodeByID(list, forcedCurrentSelectedItemID);
			setCurrentSelectedItemNode(node);
			setForcedCurrentSelectedItemID(null);
			if (onSelectedItem) {
				onSelectedItem(node, false);
			}
		}
		// eslint-disable-next-line
	}, [forcedCurrentSelectedItemID, setForcedCurrentSelectedItemID]);

	useEffect(() => {
		if (currentSelectedItemNode) {
			setCurrentSelectedItemNode(currentSelectedItemNode);
			if (onSelectedItem) {
				onSelectedItem(currentSelectedItemNode, false);
			}
		}
		// eslint-disable-next-line
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
					onMouseDown={handleMouseDownItem}
				/>
			);
			if (!ArrayUtils.contains(notExpandedItemsList, node.content.id)) {
				getTreeItems(node.children, level + 1, items);
			}
		}
		return items;
	};

	const getContextMenuItems = () =>
		contextMenuItems.map((kind) => {
			switch (kind) {
				case CONTEXT_MENU_ITEM_KIND.NEW:
					return {
						title: 'New...',
						onClick: handleNewItem,
					};
				case CONTEXT_MENU_ITEM_KIND.EDIT:
					return {
						title: 'Edit...',
						onClick: handleEditItem,
					};
				case CONTEXT_MENU_ITEM_KIND.COPY:
					return {
						title: 'Copy',
						shortcut: [SPECIAL_KEY.CTRL, KEY.C],
						onClick: handleCopyItem,
					};
				case CONTEXT_MENU_ITEM_KIND.PASTE:
					return {
						title: 'Paste',
						shortcut: [SPECIAL_KEY.CTRL, KEY.D],
						onClick: handlePasteItem,
					};
				case CONTEXT_MENU_ITEM_KIND.DELETE:
					return {
						title: 'Delete',
						shortcut: [KEY.DELETE],
						onClick: handleDeleteItem,
					};
				default:
					const customItem = { ...kind };
					if (kind.onClick) {
						kind.onClick = async () => await kind.onClick!(list, currentSelectedItemNode);
					}
					return customItem;
			}
		});

	return (
		<ContextMenu items={getContextMenuItems()}>
			<div className='tree'>{getTreeItems(list)}</div>
		</ContextMenu>
	);
}

export default Tree;
