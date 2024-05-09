/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useState, useEffect, useLayoutEffect } from 'react';
import '../styles/Tree.css';
import TreeItem from './TreeItem';
import { ArrayUtils, CONTEXT_MENU_ITEM_KIND, INPUT_TYPE_WIDTH, KEY, MenuItemType, RPM, SPECIAL_KEY } from '../common';
import { Node } from '../core';
import ContextMenu from './ContextMenu';
import { Model } from '../Editor';
import DialogName from './dialogs/DialogName';
import DialogMapObjectState from './dialogs/DialogMapObjectState';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setCopiedItems } from '../store';
import DialogMapObjectEvent from './dialogs/DialogMapObjectEvent';
import { useTranslation } from 'react-i18next';
import DialogMapObjectParameter from './dialogs/DialogMapObjectParameter';
import InputText from './InputText';
import useStateString from '../hooks/useStateString';

type Props = {
	list: Node[];
	constructorType?: typeof Model.Base;
	cannotAdd?: boolean;
	cannotEdit?: boolean;
	cannotDragDrop?: boolean;
	canBeEmpty?: boolean;
	showEditName?: boolean;
	contextMenuItems?: (CONTEXT_MENU_ITEM_KIND | MenuItemType)[];
	defaultSelectedID?: number;
	onSelectedItem?: (node: Node | null, isClick: boolean) => void;
	onCreateItem?: (node: Node) => void;
	forcedCurrentSelectedItemID?: number | null;
	setForcedCurrentSelectedItemID?: (forced: number | null) => void;
	minWidth?: number;
	onDrop?: () => Promise<void>;
};

export const TREES_MIN_WIDTH = 150;

function Tree({
	list,
	constructorType = Model.Base,
	cannotAdd = false,
	cannotEdit = false,
	cannotDragDrop = false,
	canBeEmpty = false,
	showEditName = false,
	contextMenuItems,
	defaultSelectedID,
	onSelectedItem,
	onCreateItem,
	forcedCurrentSelectedItemID,
	setForcedCurrentSelectedItemID,
	onDrop,
	minWidth,
}: Props) {
	const { t } = useTranslation();

	const defaultID =
		defaultSelectedID === undefined ? (list && list.length && list[0].content.id) || -1 : defaultSelectedID;
	const [currentSelectedItemNode, setCurrentSelectedItemNode] = useState(Node.getNodeByID(list, defaultID));
	const [notExpandedItemsList, setNotExpandedItemsList] = useState<number[]>(Node.getNotExpandedItemsList(list));
	const [, setForceUpdate] = useState(false);
	const [needOpenDialog, setNeedOpenDialog] = useState(false);
	const [newModel, setNewModel] = useState<Model.Base | null>(null);
	const [draggedNode, setDraggedNode] = useState<Node | null>(null);
	const [currentName, setCurrentName] = useStateString();

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

	const isEditNameDisabled = () => !currentSelectedItemNode || currentSelectedItemNode.content.id === -1;

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
		setCurrentName(node.content.name);
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
		if (currentSelectedItemNode && (canBeEmpty || list.length > 1)) {
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
			onCreateItem?.(node);
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

	const removeDragDropClasses = (target: HTMLElement) => {
		target.classList.remove('drag-over-top');
		target.classList.remove('drag-over-bot');
		target.classList.remove('drag-over-complete');
	};

	const handleDragStart = (event: React.DragEvent, node: Node) => {
		setDraggedNode(node);
	};

	const handleDragOver = async (event: React.DragEvent, node: Node) => {
		event.preventDefault();
		const target = event.currentTarget as HTMLElement;
		if (draggedNode) {
			event.dataTransfer.dropEffect = 'move';
			if (
				draggedNode.content.id !== node.content.id &&
				!Node.checkIDExists(draggedNode.children, node.content.id)
			) {
				removeDragDropClasses(target);
				const rect = target.getBoundingClientRect();
				const y = event.clientY - rect.top;
				if (node.isFolder()) {
					if (y < 5) {
						target.classList.add('drag-over-top');
					} else if (y > 15) {
						target.classList.add('drag-over-bot');
					} else {
						target.classList.add('drag-over-complete');
					}
				} else {
					target.classList.add(`drag-over-${y < 10 ? 'top' : 'bot'}`);
				}
			}
		} else {
			event.dataTransfer.dropEffect = 'none';
			target.style.cursor = 'not-allowed';
		}
	};

	const handleDragLeave = (event: React.DragEvent) => {
		removeDragDropClasses(event.currentTarget as HTMLElement);
	};

	const handleDrop = async (event: React.DragEvent, node: Node) => {
		event.preventDefault();
		if (draggedNode) {
			const target = event.currentTarget as HTMLElement;
			if (
				(node !== draggedNode && target.classList.contains('drag-over-complete')) ||
				target.classList.contains('drag-over-top') ||
				target.classList.contains('drag-over-bot')
			) {
				ArrayUtils.removeElement(draggedNode.parent ? draggedNode.parent.children : list, draggedNode);
				const dropList = node.parent ? node.parent.children : list;
				if (target.classList.contains('drag-over-complete')) {
					node.children.push(draggedNode);
					draggedNode.parent = node;
				} else if (target.classList.contains('drag-over-top')) {
					ArrayUtils.insertAt(dropList, dropList.indexOf(node), draggedNode);
					draggedNode.parent = node.parent;
				} else if (target.classList.contains('drag-over-bot')) {
					ArrayUtils.insertAt(dropList, dropList.indexOf(node) + 1, draggedNode);
					draggedNode.parent = node.parent;
				}
			}
			removeDragDropClasses(target);
			setDraggedNode(null);
			await onDrop?.();
		}
	};

	const handleChangeName = (name: string) => {
		if (currentSelectedItemNode) {
			currentSelectedItemNode.content.name = name;
			setCurrentName(name);
		}
	};

	useLayoutEffect(() => {
		if (
			forcedCurrentSelectedItemID !== undefined &&
			forcedCurrentSelectedItemID !== null &&
			setForcedCurrentSelectedItemID
		) {
			const node = Node.getNodeByID(list, forcedCurrentSelectedItemID);
			setCurrentSelectedItemNode(node);
			setCurrentName(node?.content?.name || '');
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
			setCurrentName(currentSelectedItemNode.content.name);
			if (onSelectedItem) {
				onSelectedItem(currentSelectedItemNode, false);
			}
		}
		// eslint-disable-next-line
	}, []);

	const headers = constructorType.getTreeHeader();

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
					onDragStart={node.draggable ? handleDragStart : undefined}
					onDragOver={node.draggable ? handleDragOver : undefined}
					onDragLeave={node.draggable ? handleDragLeave : undefined}
					onDrop={node.draggable ? handleDrop : undefined}
					draggable={!cannotDragDrop && node.draggable}
					headers={headers}
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
		if (currentSelectedItemNode && !cannotEdit) {
			const options = {
				isNew: newModel !== null,
				needOpen: needOpenDialog,
				setNeedOpen: setNeedOpenDialog,
				model: newModel ?? currentSelectedItemNode.content,
				onAccept: handleAcceptDialog,
				onReject: handleRejectDialog,
			};
			switch (constructorType) {
				case Model.MapObjectState:
					return <DialogMapObjectState {...options} />;
				case Model.MapObjectEvent:
					return <DialogMapObjectEvent {...options} />;
				case Model.MapObjectParameter:
					return <DialogMapObjectParameter {...options} />;
				default:
					return <DialogName {...options} />;
			}
		} else {
			return null;
		}
	};

	const getHeaders = () =>
		headers.length > 0 && (
			<div className='tree-header'>
				{headers.map((label) => (
					<div className='flex-one' key={label}>
						{t(label)}
					</div>
				))}
			</div>
		);

	return (
		<ContextMenu items={getContextMenuItems()}>
			<div className='flex-column gap-medium fill-width fill-height'>
				<div onDoubleClick={handleDoubleClick} className='tree' style={{ minWidth: `${minWidth}px` }}>
					<div className='flex gap-small'>{getHeaders()}</div>
					{getTreeItems(list)}
				</div>
				{showEditName && (
					<div className='flex gap-small'>
						<div className={isEditNameDisabled() ? 'disabled-label' : ''}>{t('name')}:</div>
						<InputText
							value={currentName}
							onChange={handleChangeName}
							widthType={INPUT_TYPE_WIDTH.FILL}
							disabled={isEditNameDisabled()}
						/>
					</div>
				)}
			</div>
			{getDialog()}
		</ContextMenu>
	);
}

export default Tree;
