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
import { ArrayUtils, CONTEXT_MENU_ITEM_KIND, KEY, MenuItemType, RPM, SPECIAL_KEY } from '../common';
import { Node } from '../core';
import ContextMenu from './ContextMenu';
import { Model } from '../Editor';
import DialogName from './dialogs/DialogName';
import DialogMapObjectState from './dialogs/DialogMapObjectState';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setCopiedItems } from '../store';

type Props = {
	list: Node[];
	constructorType?: typeof Model.Base;
	cannotAdd?: boolean;
	contextMenuItems?: (CONTEXT_MENU_ITEM_KIND | MenuItemType)[];
	defaultSelectedID?: number;
	onSelectedItem?: (node: Node | null, isClick: boolean) => void;
	forcedCurrentSelectedItemID?: number | null;
	setForcedCurrentSelectedItemID?: (forced: number | null) => void;
	minWidth?: number;
};

function Tree({
	list,
	constructorType = Model.Base,
	cannotAdd = false,
	contextMenuItems,
	defaultSelectedID,
	onSelectedItem,
	forcedCurrentSelectedItemID,
	setForcedCurrentSelectedItemID,
	minWidth,
}: Props) {
	const defaultID =
		defaultSelectedID === undefined ? (list && list.length && list[0].content.id) || -1 : defaultSelectedID;
	const [currentSelectedItemNode, setCurrentSelectedItemNode] = useState(Node.getNodeByID(list, defaultID));
	const [notExpandedItemsList, setNotExpandedItemsList] = useState<number[]>(Node.getNotExpandedItemsList(list));
	const [, setForceUpdate] = useState(false);
	const [needOpenDialog, setNeedOpenDialog] = useState(false);
	const [newModel, setNewModel] = useState<Model.Base | null>(null);

	const copiedItems = useSelector((state: RootState) => state.projects.copiedItems);

	const dispatch = useDispatch();

	let hasCustomItems = true;
	if (!contextMenuItems) {
		contextMenuItems = [
			CONTEXT_MENU_ITEM_KIND.NEW,
			CONTEXT_MENU_ITEM_KIND.EDIT,
			CONTEXT_MENU_ITEM_KIND.COPY,
			CONTEXT_MENU_ITEM_KIND.PASTE,
			CONTEXT_MENU_ITEM_KIND.DELETE,
		];
		hasCustomItems = false;
	}

	const canPaste = () => copiedItems?.constructorClass === constructorType;

	const getNodeID = () => currentSelectedItemNode?.content?.id || -1;

	const isSelected = (id: number) => id === getNodeID();

	const getNewIndex = () => {
		if (currentSelectedItemNode) {
			let index = list.indexOf(currentSelectedItemNode);
			if (index === -1) {
				index = list.length;
			}
			return index;
		}
		return 0;
	};

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

	const handleDoubleClick = () => {
		if (!hasCustomItems) {
			if (getNodeID() === -1) {
				handleNewItem();
			} else {
				handleEditItem();
			}
		}
	};

	const handleNewItem = async () => {
		const model = new constructorType();
		model.applyDefault();
		const id = Model.Base.generateNewIDfromList(list.map((node) => node.content));
		model.id = id;
		setNewModel(model);
		setNeedOpenDialog(true);
	};

	const handleEditItem = async () => {
		setNeedOpenDialog(true);
	};

	const handleCopyItem = async () => {
		if (currentSelectedItemNode) {
			dispatch(setCopiedItems(await Node.saveToCopy([currentSelectedItemNode])));
		}
	};

	const handlePasteItem = async () => {
		if (currentSelectedItemNode && copiedItems) {
			const nodes = copiedItems.values;
			let index = getNewIndex();
			let cloned: Node | null = null;
			for (const node of nodes) {
				cloned = node.clone();
				const id = Model.Base.generateNewIDfromList(list.map((node) => node.content));
				cloned.content.id = id;
				ArrayUtils.insertAt(list, index++, cloned);
			}
			if (cloned) {
				setCurrentSelectedItemNode(cloned);
				onSelectedItem?.(cloned, false);
			}
		}
	};

	const handleDeleteItem = async () => {
		if (currentSelectedItemNode) {
			const index = getNewIndex();
			ArrayUtils.removeElement(list, currentSelectedItemNode);
			const node = list[index] ?? null;
			setCurrentSelectedItemNode(node);
			onSelectedItem?.(node, false);
		}
	};

	const handleAcceptDialog = () => {
		let node: Node | null = null;
		if (newModel && currentSelectedItemNode) {
			node = Node.create(newModel);
			ArrayUtils.insertAt(list, getNewIndex(), node);
		} else {
			node = Node.create(currentSelectedItemNode?.content);
		}
		setNewModel(null);
		setCurrentSelectedItemNode(node);
		onSelectedItem?.(node, false);
	};

	const handleRejectDialog = () => {
		setNewModel(null);
	};

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
		if (!cannotAdd && level === 0) {
			items.push(
				<TreeItem
					key={-1}
					node={Node.create(Model.Base.create(-1, ''))}
					level={level}
					selected={isSelected(-1)}
					onSwitchExpanded={handleSwitchExpandedItem}
					onMouseDown={handleMouseDownItem}
				/>
			);
		}
		return items;
	};

	const getContextMenuItems = () => {
		const isEmpty = getNodeID() === -1;
		return contextMenuItems!.map((kind) => {
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
						disabled: isEmpty,
					};
				case CONTEXT_MENU_ITEM_KIND.COPY:
					return {
						title: 'Copy',
						shortcut: [SPECIAL_KEY.CTRL, KEY.C],
						onClick: handleCopyItem,
						disabled: isEmpty,
					};
				case CONTEXT_MENU_ITEM_KIND.PASTE:
					return {
						title: 'Paste',
						shortcut: [SPECIAL_KEY.CTRL, KEY.D],
						onClick: handlePasteItem,
						disabled: !canPaste(),
					};
				case CONTEXT_MENU_ITEM_KIND.DELETE:
					return {
						title: 'Delete',
						shortcut: [KEY.DELETE],
						onClick: handleDeleteItem,
						disabled: isEmpty,
					};
				default: {
					const customItem = { ...kind };
					if (kind.onClick) {
						customItem.onClick = async () => {
							RPM.treeCurrentItems = list;
							RPM.treeCurrentItem = currentSelectedItemNode;
							RPM.treeCurrentForceUpdate = () => {
								setForceUpdate((value) => !value);
							};
							RPM.treeCurrentSetSelectedItem = (node: Node) => {
								setCurrentSelectedItemNode(node);
								onSelectedItem?.(node, false);
							};
							await kind.onClick!(list);
						};
					}
					return customItem;
				}
			}
		});
	};

	const getDialog = () => {
		if (currentSelectedItemNode) {
			const options = {
				isNew: newModel !== null,
				needOpen: needOpenDialog,
				setNeedOpen: setNeedOpenDialog,
				model: newModel ?? currentSelectedItemNode.content,
				onAccept: handleAcceptDialog,
				onReject: handleRejectDialog,
			};
			switch (constructorType) {
				case Model.Base:
					return <DialogName {...options} />;
				case Model.MapObjectState:
					return <DialogMapObjectState {...options} />;
				default:
					return null;
			}
		} else {
			return null;
		}
	};

	return (
		<ContextMenu items={getContextMenuItems()}>
			<div onDoubleClick={handleDoubleClick} className='tree' style={{ minWidth: `${minWidth}px` }}>
				{getTreeItems(list)}
			</div>
			{getDialog()}
		</ContextMenu>
	);
}

export default Tree;
