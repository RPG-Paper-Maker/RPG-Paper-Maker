/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
	ArrayUtils,
	CONTEXT_MENU_ITEM_KIND,
	INPUT_TYPE_WIDTH,
	KEY,
	MenuItemType,
	RPM,
	SPECIAL_KEY,
	Utils,
} from '../common';
import { Node } from '../core';
import { Model } from '../Editor';
import useStateString from '../hooks/useStateString';
import { RootState, setCopiedItems } from '../store';
import '../styles/Tree.css';
import ContextMenu from './ContextMenu';
import DialogMapObjectCommand from './dialogs/models/DialogMapObjectCommand';
import DialogMapObjectEvent from './dialogs/models/DialogMapObjectEvent';
import DialogMapObjectParameter from './dialogs/models/DialogMapObjectParameter';
import DialogMapObjectProperty from './dialogs/models/DialogMapObjectProperty';
import DialogMapObjectState from './dialogs/models/DialogMapObjectState';
import DialogName from './dialogs/models/DialogName';
import Flex from './Flex';
import InputText from './InputText';
import TreeItem from './TreeItem';

type Props = {
	list: Node[];
	constructorType?: typeof Model.Base;
	cannotAdd?: boolean;
	cannotEdit?: boolean;
	cannotDragDrop?: boolean;
	cannotDelete?: boolean;
	canBeEmpty?: boolean;
	doNotGenerateIDOnPaste?: boolean;
	doNotShowID?: boolean;
	showEditName?: boolean;
	contextMenuItems?: (CONTEXT_MENU_ITEM_KIND | MenuItemType)[];
	defaultSelectedID?: number;
	onSelectedItem?: (node: Node | null, isClick: boolean) => void;
	onDoubleClick?: (node: Node | null) => void;
	onCreateItem?: (node: Node) => void;
	onListUpdated?: () => void;
	forcedCurrentSelectedItemID?: number | null;
	setForcedCurrentSelectedItemID?: (forced: number | null) => void;
	forcedCurrentSelectedItemIndex?: number | null;
	setForcedCurrentSelectedItemIndex?: (forced: number | null) => void;
	minWidth?: number;
	byIndex?: boolean;
	onDrop?: () => Promise<void>;
	disabled?: boolean;
};

export const TREES_MIN_WIDTH = 150;

function Tree({
	list,
	constructorType = Model.Base,
	cannotAdd = false,
	cannotEdit = false,
	cannotDragDrop = false,
	cannotDelete = false,
	canBeEmpty = false,
	doNotGenerateIDOnPaste = false,
	doNotShowID = false,
	showEditName = false,
	contextMenuItems,
	defaultSelectedID,
	onSelectedItem,
	onCreateItem,
	onListUpdated,
	onDoubleClick,
	forcedCurrentSelectedItemID,
	setForcedCurrentSelectedItemID,
	forcedCurrentSelectedItemIndex,
	setForcedCurrentSelectedItemIndex,
	byIndex = false,
	onDrop,
	minWidth,
	disabled = false,
}: Props) {
	const { t } = useTranslation();

	const defaultID =
		defaultSelectedID === undefined ? (list && list.length && list[0].content.id) || -1 : defaultSelectedID;
	const [currentSelectedItemNode, setCurrentSelectedItemNode] = useState(
		(byIndex ? list[0] : Node.getNodeByID(list, defaultID)) ??
			(cannotAdd ? null : Node.create(Model.Base.create(-1, '')))
	);
	const [notExpandedItemsList, setNotExpandedItemsList] = useState<number[]>(Node.getNotExpandedItemsList(list));
	const [, setForceUpdate] = useState(false);
	const [isOpenDialog, setIsOpenDialog] = useState(false);
	const [newModel, setNewModel] = useState<Model.Base | null>(null);
	const [draggedNode, setDraggedNode] = useState<Node | null>(null);
	const [currentName, setCurrentName] = useStateString();
	const [needScroll, setNeedScroll] = useState(false);

	const copiedItems = useSelector((state: RootState) => state.projects.copiedItems);

	const selectedElementRef = useRef<HTMLDivElement>(null);

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

	const isEditNameDisabled = () => disabled || !currentSelectedItemNode || currentSelectedItemNode.content.id <= 0;

	const canPaste = () => copiedItems?.constructorClass === constructorType && !cannotAdd;

	const getNodeID = () => currentSelectedItemNode?.content?.id ?? null;

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

	const isSelected = (id: number) => id === (byIndex ? getNewIndex() : getNodeID());

	const scrollToSelectedElement = () => {
		if (selectedElementRef.current) {
			selectedElementRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
		}
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
		onDoubleClick?.(currentSelectedItemNode);
	};

	const handleNewItem = async () => {
		const model = new constructorType();
		model.applyDefault();
		const id = Model.Base.generateNewIDfromList(list.map((node) => node.content));
		model.id = id;
		setNewModel(model);
		setIsOpenDialog(true);
	};

	const handleEditItem = async () => {
		setIsOpenDialog(true);
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
				if (!doNotGenerateIDOnPaste) {
					cloned.content.id = Model.Base.generateNewIDfromList(list.map((node) => node.content));
				}
				ArrayUtils.insertAt(list, index++, cloned);
			}
			if (cloned) {
				setCurrentSelectedItemNode(cloned);
				onSelectedItem?.(cloned, false);
			}
			onListUpdated?.();
		}
	};

	const handleDeleteItem = async () => {
		if (currentSelectedItemNode && (canBeEmpty || list.length > 1)) {
			const index = getNewIndex();
			ArrayUtils.removeElement(list, currentSelectedItemNode);
			const node = list[index] ?? Node.create(Model.Base.create(-1, ''));
			setCurrentSelectedItemNode(node);
			onListUpdated?.();
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
			node = currentSelectedItemNode;
		}
		setNewModel(null);
		setCurrentSelectedItemNode(node);
		onSelectedItem?.(node, false);
		onListUpdated?.();
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
			onListUpdated?.();
		}
	};

	const handleChangeName = (name: string) => {
		if (currentSelectedItemNode) {
			currentSelectedItemNode.content.name = name;
			setCurrentName(name);
			onListUpdated?.();
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
			if (node) {
				setNeedScroll(true);
			}
			if (onSelectedItem) {
				onSelectedItem(node, false);
			}
		}
		// eslint-disable-next-line
	}, [forcedCurrentSelectedItemID, setForcedCurrentSelectedItemID]);

	useLayoutEffect(() => {
		if (
			forcedCurrentSelectedItemIndex !== undefined &&
			forcedCurrentSelectedItemIndex !== null &&
			setForcedCurrentSelectedItemIndex
		) {
			const node = list[forcedCurrentSelectedItemIndex];
			setCurrentSelectedItemNode(node);
			setCurrentName(node?.content?.name || '');
			setForcedCurrentSelectedItemIndex(null);
			if (node) {
				setNeedScroll(true);
			}
			if (onSelectedItem) {
				onSelectedItem(node, false);
			}
		}
		// eslint-disable-next-line
	}, [forcedCurrentSelectedItemIndex, setForcedCurrentSelectedItemIndex]);

	useEffect(() => {
		if (needScroll) {
			scrollToSelectedElement();
			setNeedScroll(false);
		}
	}, [needScroll, currentSelectedItemNode]);

	useEffect(() => {
		if (currentSelectedItemNode) {
			setCurrentSelectedItemNode(currentSelectedItemNode);
			setCurrentName(currentSelectedItemNode.content.name);
			if (currentSelectedItemNode) {
				scrollToSelectedElement();
			}
			if (onSelectedItem) {
				onSelectedItem(currentSelectedItemNode, false);
			}
		}
		// eslint-disable-next-line
	}, []);

	const headers = constructorType.getTreeHeader();

	const getTreeItems = (nodes: Node[], level = 0, items: ReactNode[] = []) => {
		for (const [index, node] of nodes.entries()) {
			const selected = isSelected(byIndex ? index : node.content.id);
			items.push(
				<div key={byIndex ? index : node.content.id} ref={selected ? selectedElementRef : null}>
					<TreeItem
						node={node}
						level={level}
						selected={selected}
						onSwitchExpanded={handleSwitchExpandedItem}
						onMouseDown={handleMouseDownItem}
						onDragStart={!disabled && node.draggable ? handleDragStart : undefined}
						onDragOver={!disabled && node.draggable ? handleDragOver : undefined}
						onDragLeave={!disabled && node.draggable ? handleDragLeave : undefined}
						onDrop={!disabled && node.draggable ? handleDrop : undefined}
						draggable={!cannotDragDrop && node.draggable}
						headers={headers}
						doNotShowID={doNotShowID}
					/>
				</div>
			);
			if (!ArrayUtils.contains(notExpandedItemsList, node.content.id)) {
				getTreeItems(node.children, level + 1, items);
			}
		}
		if (!cannotAdd && level === 0) {
			const selected = isSelected(byIndex ? nodes.length : -1);
			items.push(
				<div key={byIndex ? nodes.length : -1} ref={selected ? selectedElementRef : null}>
					<TreeItem
						node={Node.create(Model.Base.create(-1, ''))}
						level={level}
						selected={selected}
						onSwitchExpanded={handleSwitchExpandedItem}
						onMouseDown={handleMouseDownItem}
					/>
				</div>
			);
		}
		return items;
	};

	const getContextMenuItems = () => {
		if (disabled) {
			return [];
		}
		const nodeID = getNodeID();
		const isEmpty = nodeID === -1 || nodeID === 0;
		return contextMenuItems!.map((kind) => {
			switch (kind) {
				case CONTEXT_MENU_ITEM_KIND.NEW:
					return {
						title: 'New...',
						onClick: handleNewItem,
						disabled: cannotAdd,
					};
				case CONTEXT_MENU_ITEM_KIND.EDIT:
					return {
						title: 'Edit...',
						onClick: handleEditItem,
						disabled: isEmpty || cannotAdd,
					};
				case CONTEXT_MENU_ITEM_KIND.COPY:
					return {
						title: 'Copy',
						shortcut: [SPECIAL_KEY.CTRL, KEY.C],
						onClick: handleCopyItem,
						disabled: isEmpty || cannotAdd,
					};
				case CONTEXT_MENU_ITEM_KIND.PASTE:
					return {
						title: 'Paste',
						shortcut: [SPECIAL_KEY.CTRL, KEY.V],
						onClick: handlePasteItem,
						disabled: !canPaste(),
					};
				case CONTEXT_MENU_ITEM_KIND.DELETE:
					return {
						title: 'Delete',
						shortcut: [KEY.DELETE],
						onClick: handleDeleteItem,
						disabled: isEmpty || cannotDelete,
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
				isOpen: isOpenDialog,
				setIsOpen: setIsOpenDialog,
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
				case Model.MapObjectProperty:
					return <DialogMapObjectProperty {...options} />;
				case Model.MapObjectCommand:
					return <DialogMapObjectCommand {...options} />;
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
					<Flex one key={label}>
						{t(label)}
					</Flex>
				))}
			</div>
		);

	return (
		<ContextMenu items={getContextMenuItems()}>
			<Flex column spacedLarge fillWidth fillHeight>
				<div
					onDoubleClick={handleDoubleClick}
					className={Utils.getClassName({ disabled }, 'tree')}
					style={{ minWidth: `${minWidth}px` }}
				>
					<Flex spaced>{getHeaders()}</Flex>
					{getTreeItems(list)}
				</div>
				{showEditName && (
					<Flex spaced>
						<div className={Utils.getClassName({ 'disabled-label': disabled || isEditNameDisabled() })}>
							{t('name')}:
						</div>
						<InputText
							value={currentName}
							onChange={handleChangeName}
							widthType={INPUT_TYPE_WIDTH.FILL}
							disabled={isEditNameDisabled()}
						/>
					</Flex>
				)}
			</Flex>
			{getDialog()}
		</ContextMenu>
	);
}

export default Tree;
