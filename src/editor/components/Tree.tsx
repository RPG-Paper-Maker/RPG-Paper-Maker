/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import { Node } from '../core/Node';
import { Model } from '../Editor';
import useStateString from '../hooks/useStateString';
import { Inputs } from '../managers';
import { Localization, MapObjectCommand } from '../models';
import { RootState, setCopiedItems } from '../store';
import '../styles/Tree.css';
import ContextMenu from './ContextMenu';
import DialogUpdateID from './dialogs/DialogUpdateID';
import DialogUpdateListSize from './dialogs/DialogUpdateListSize';
import Flex from './Flex';
import InputLocalization from './InputLocalization';
import InputText from './InputText';
import TreeItem from './TreeItem';

type Props = {
	list: Node[];
	constructorType?: typeof Model.Base;
	defaultNewModel?: Model.Base;
	cannotAdd?: boolean;
	cannotEdit?: boolean;
	cannotDragDrop?: boolean;
	cannotUpdateListSize?: boolean;
	cannotDelete?: boolean;
	cannotClear?: boolean;
	canDelete?: (node: Node | null) => boolean;
	canBeEmpty?: boolean;
	canForcePasteAdd?: boolean;
	canDisable?: boolean;
	doNotGenerateIDOnPaste?: boolean;
	doNotShowID?: boolean;
	showEditName?: boolean;
	multipleLevels?: boolean;
	contextMenuItems?: (CONTEXT_MENU_ITEM_KIND | MenuItemType)[];
	defaultSelectedID?: number;
	onSelectedItem?: (node: Node | null, isClick: boolean) => void;
	onDoubleClick?: (node: Node | null) => void;
	onCreateItem?: (node: Node) => void;
	onDeleteItem?: (node: Node) => void;
	onPasteItem?: (copied: Node, originalCopy: Node) => void;
	onListUpdated?: () => void;
	onAccept?: (node: Node, isNew: boolean) => void;
	forcedCurrentSelectedItemID?: number | null;
	setForcedCurrentSelectedItemID?: (forced: number | null) => void;
	forcedCurrentSelectedItemIndex?: number | null;
	setForcedCurrentSelectedItemIndex?: (forced: number | null) => void;
	minWidth?: number;
	width?: number;
	minHeight?: number;
	height?: number;
	byIndex?: boolean;
	onDrop?: () => Promise<void>;
	disabled?: boolean;
	scrollable?: boolean;
	multipleSelection?: boolean;
	applyDefault?: boolean;
	noFirstSelection?: boolean;
	isLocalization?: boolean;
	cannotAddEditRemoveRoot?: boolean;
	hideCheck?: boolean;
	triggerUpdate?: boolean;
	doNotOpenDialog?: boolean;
	inputNameWidth?: INPUT_TYPE_WIDTH;
	hideTooltip?: boolean;
	blurOnMouseLeave?: boolean;
};

export const TREES_SMALL_MIN_WIDTH = 75;
export const TREES_MIN_WIDTH = 150;
export const TREES_MIN_HEIGHT = 100;
export const TREES_LARGE_MIN_WIDTH = 250;
export const TREES_LARGE_MIN_HEIGHT = 200;

function Tree({
	list,
	constructorType = Model.Base,
	defaultNewModel,
	cannotAdd = false,
	cannotEdit = false,
	cannotDragDrop = false,
	cannotUpdateListSize = false,
	cannotDelete = false,
	canDelete,
	canBeEmpty = false,
	canForcePasteAdd = false,
	canDisable = false,
	cannotClear = false,
	doNotGenerateIDOnPaste = false,
	doNotShowID = false,
	showEditName = false,
	multipleLevels = false,
	contextMenuItems,
	defaultSelectedID,
	onSelectedItem,
	onDoubleClick,
	onCreateItem,
	onDeleteItem,
	onPasteItem,
	onListUpdated,
	onAccept,
	forcedCurrentSelectedItemID,
	setForcedCurrentSelectedItemID,
	forcedCurrentSelectedItemIndex,
	setForcedCurrentSelectedItemIndex,
	byIndex = false,
	onDrop,
	minWidth,
	width,
	minHeight,
	height,
	disabled = false,
	scrollable = false,
	multipleSelection = false,
	applyDefault = false,
	noFirstSelection = false,
	isLocalization = false,
	cannotAddEditRemoveRoot = false,
	hideCheck = false,
	doNotOpenDialog = false,
	inputNameWidth = INPUT_TYPE_WIDTH.SMALL,
	hideTooltip = false,
	blurOnMouseLeave = false,
}: Props) {
	const { t } = useTranslation();

	const listRef = useRef<HTMLDivElement>(null);
	const doubleTapHandler = useRef(Utils.createDoubleTapHandler()).current;
	const handleSetFocusRef = useRef<(b: boolean) => void>(() => {});

	const createDefault = (id: number) => {
		if (applyDefault) {
			const model = new constructorType();
			model.applyDefault();
			model.id = id;
			model.name = '';
			return model;
		} else {
			return Model.Base.create(id, '');
		}
	};

	const defaultID =
		defaultSelectedID === undefined ? (list && list.length && list[0].content.id) || -1 : defaultSelectedID;
	const defaultNotExpandedItemsList = useMemo(() => Node.getNotExpandedItemsList(list), [list]);

	const [currentSelectedItemNode, setCurrentSelectedItemNode] = useState(
		() =>
			(byIndex ? list[0] : Node.getNodeByID(list, defaultID)) ??
			(cannotAdd ? null : Node.create(createDefault(-1))),
	);
	const [additionalSelectedNodes, setAdditionalSelectedNodes] = useState<Node[]>([]);
	const [notExpandedItemsList, setNotExpandedItemsList] = useState<number[]>(defaultNotExpandedItemsList);
	const [, setForceUpdate] = useState(false);
	const [isOpenDialog, setIsOpenDialog] = useState(false);
	const [newModel, setNewModel] = useState<Model.Base | null>(null);
	const [draggedNode, setDraggedNode] = useState<Node | null>(null);
	const [currentName, setCurrentName] = useStateString();
	const [needScroll, setNeedScroll] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [isDialogUpdateListSizeOpen, setIsDialogUpdateListSizeOpen] = useState(false);
	const [isDialogUpdateIDOpen, setIsDialogUpdateIDOpen] = useState(false);

	const copiedItems = useSelector((state: RootState) => state.projects.copiedItems);

	const selectedElementRef = useRef<HTMLDivElement>(null);

	const dispatch = useDispatch();

	let hasCustomItems = true;
	if (!contextMenuItems) {
		contextMenuItems = [
			CONTEXT_MENU_ITEM_KIND.EDIT,
			CONTEXT_MENU_ITEM_KIND.NEW,
			CONTEXT_MENU_ITEM_KIND.COPY,
			CONTEXT_MENU_ITEM_KIND.CUT,
			CONTEXT_MENU_ITEM_KIND.PASTE,
			CONTEXT_MENU_ITEM_KIND.PASTE_OVER,
			CONTEXT_MENU_ITEM_KIND.DELETE,
			CONTEXT_MENU_ITEM_KIND.CLEAR,
		];
		if (!cannotUpdateListSize && !cannotAdd) {
			ArrayUtils.insertAt(contextMenuItems, 2, CONTEXT_MENU_ITEM_KIND.UPDATE_LIST_SIZE);
			ArrayUtils.insertAt(contextMenuItems, 2, CONTEXT_MENU_ITEM_KIND.UPDATE_ID);
		}
		if (canDisable) {
			contextMenuItems.push(CONTEXT_MENU_ITEM_KIND.DISABLE);
		}
		hasCustomItems = false;
	}

	const isEditNameDisabled = () => disabled || !currentSelectedItemNode || currentSelectedItemNode.content.id <= 0;

	const canPaste = () => copiedItems?.constructorClass === constructorType && !cannotEdit;

	const getNodeID = () => currentSelectedItemNode?.content?.id ?? null;

	const getNewIndex = () => {
		if (currentSelectedItemNode) {
			const currentList = currentSelectedItemNode.parent?.children ?? list;
			let index = currentList.indexOf(currentSelectedItemNode);
			if (index === -1) {
				index = currentList.length;
			}
			return index;
		}
		return 0;
	};

	const isEmpty = byIndex ? getNewIndex() === list.length : (getNodeID() ?? -1) <= 0;

	const isSelected = (id: number) => id === (byIndex ? getNewIndex() : getNodeID());

	const scrollToSelectedElement = () => {
		if (listRef.current && selectedElementRef.current) {
			const containerRect = listRef.current.getBoundingClientRect();
			const itemRect = selectedElementRef.current.getBoundingClientRect();
			const targetScrollTop =
				listRef.current.scrollTop +
				(itemRect.top - containerRect.top) -
				containerRect.height / 2 +
				itemRect.height / 2;
			listRef.current.scrollTo({
				top: targetScrollTop,
				behavior: 'smooth',
			});
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
		if (currentSelectedItemNode === node) {
			return;
		}
		if (multipleSelection && (Inputs.isSHIFT || Inputs.isCTRL) && currentSelectedItemNode) {
			if (node.content.id !== currentSelectedItemNode.content.id) {
				if (additionalSelectedNodes.some((n) => n.content.id === node.content.id)) {
					setAdditionalSelectedNodes(additionalSelectedNodes.filter((n) => node.content.id !== n.content.id));
				} else {
					setAdditionalSelectedNodes([...additionalSelectedNodes, node]);
				}
			} else {
				if (additionalSelectedNodes.length > 0) {
					setCurrentSelectedItemNode(additionalSelectedNodes[0]);
					setAdditionalSelectedNodes(additionalSelectedNodes.slice(1));
				}
			}
		} else {
			setCurrentSelectedItemNode(node);
			setAdditionalSelectedNodes([]);
		}
		setCurrentName(node.content.name);
		if (onSelectedItem) {
			onSelectedItem(node, true);
		}
	};

	const handleDoubleClick = async () => {
		if (disabled) {
			return;
		}
		if (!hasCustomItems && (!cannotAddEditRemoveRoot || currentSelectedItemNode !== list[0])) {
			if (isEmpty) {
				await handleNewItem();
			} else {
				await handleEditItem();
			}
		}
		RPM.treeCurrentItems = list;
		RPM.treeCurrentItem = currentSelectedItemNode;
		RPM.treeCurrentForceUpdate = () => {
			setForceUpdate((value) => !value);
		};
		RPM.treeCurrentSetSelectedItem = (node: Node) => {
			setCurrentSelectedItemNode(node);
			onSelectedItem?.(node, false);
		};
		onDoubleClick?.(currentSelectedItemNode);
	};

	const handleNewItem = async () => {
		let model: Model.Base;
		if (defaultNewModel) {
			model = defaultNewModel.clone();
		} else {
			model = new constructorType();
			model.applyDefault();
		}
		model.id = Node.getNewID(list);
		setNewModel(model);
		if (doNotOpenDialog || constructorType === Model.Base || constructorType === Model.Localization) {
			handleAcceptDialog(model);
		} else {
			setIsOpenDialog(true);
		}
	};

	const handleEditItem = async () => {
		setIsOpenDialog(true);
	};

	const handleUpdateListSize = async () => {
		setIsDialogUpdateListSizeOpen(true);
	};

	const handleAcceptUpdateListSize = (newSize: number) => {
		let node: Node | null = null;
		if (newSize < list.length) {
			while (list.length > newSize) {
				node = list[list.length - 1];
				ArrayUtils.removeElement(list, node);
				onDeleteItem?.(node);
			}
		} else {
			while (list.length < newSize) {
				const model = new constructorType();
				model.applyDefault();
				model.id = Node.getNewID(list);
				node = Node.create(model);
				list.push(node);
				onCreateItem?.(node);
				onAccept?.(node, true);
			}
		}
		if (node) {
			setCurrentSelectedItemNode(node);
			onSelectedItem?.(node, false);
			onListUpdated?.();
		}
	};

	const getCorrectSelectedNodes = () => {
		const selectedNodes = [currentSelectedItemNode!, ...additionalSelectedNodes];
		const selectedNodesComplete: Node[] = [];
		for (const node of selectedNodes) {
			const isFixed = node.content.isFixedNode();
			if (!isFixed) {
				selectedNodesComplete.push(node);
				const currentList = node.parent?.children ?? list;
				const selectionIndexes = node.content.getSelectionNextIndexes();
				const index = currentList.indexOf(node) + 1;
				for (let i = 0; i < selectionIndexes - 1; i++) {
					selectedNodesComplete.push(currentList[index + i]);
				}
			}
		}
		const selectedWithoutChildren: Node[] = [];
		for (const node of selectedNodesComplete) {
			if (node && !node.getParents().some((parent) => selectedNodesComplete.includes(parent))) {
				selectedWithoutChildren.push(node);
			}
		}
		const reorderedNodes: Node[] = [];
		reorderSelectedNodes(reorderedNodes, list, selectedWithoutChildren);
		return reorderedNodes;
	};

	const reorderSelectedNodes = (result: Node[], nodes: Node[], selectedNodes: Node[]) => {
		for (const node of nodes) {
			if (selectedNodes.includes(node) && !result.includes(node)) {
				result.push(node);
			}
			reorderSelectedNodes(result, node.children, selectedNodes);
		}
	};

	const handleCopyItem = async () => {
		const nodes = getCorrectSelectedNodes();
		if (nodes.length > 0) {
			dispatch(setCopiedItems(await Node.saveToCopy(nodes)));
		}
	};

	const handleCutItem = async () => {
		const nodes = getCorrectSelectedNodes();
		if (nodes.length > 0) {
			const copied = await Node.saveToCopy(nodes);
			copied.isCut = true;
			copied.sourceNodes = nodes;
			dispatch(setCopiedItems(copied));
		}
	};

	const pasteCutItem = () => {
		if (copiedItems!.isCut && copiedItems!.sourceNodes) {
			for (const sourceNode of copiedItems!.sourceNodes) {
				ArrayUtils.removeElement(sourceNode.parent?.children ?? list, sourceNode);
				onDeleteItem?.(sourceNode);
			}
			dispatch(setCopiedItems(null));
		}
	};

	const handlePasteItem = async () => {
		if (currentSelectedItemNode && copiedItems) {
			const nodes = copiedItems.values;
			const currentList = currentSelectedItemNode.parent?.children ?? list;
			let index = getNewIndex();
			let cloned: Node;
			let firstCloned: Node | null = null;
			if (cannotAdd && !canForcePasteAdd) {
				const id = currentList[index].content.id;
				currentList[index].content.copy(nodes[0].content);
				currentList[index].content.id = id;
				setCurrentName(currentList[index].content.name);
			} else {
				index += Math.max(1, currentSelectedItemNode.content.getSelectionNextIndexes());
				for (const node of nodes) {
					cloned = node.clone();
					if (firstCloned === null) {
						firstCloned = cloned;
					}
					cloned.parent = currentSelectedItemNode.parent;
					ArrayUtils.insertAt(currentList, index++, cloned);
					if (!doNotGenerateIDOnPaste) {
						generateNewIDsToAllNodes(cloned);
					}
					onPasteItem?.(cloned, node);
				}
				if (firstCloned) {
					setCurrentSelectedItemNode(firstCloned);
					onSelectedItem?.(firstCloned, false);
					setCurrentName(firstCloned.content.name);
				}
			}
			pasteCutItem();
			onListUpdated?.();
		}
	};

	const handlePasteOverItem = async () => {
		if (currentSelectedItemNode && copiedItems) {
			const nodes = copiedItems.values;
			const currentList = currentSelectedItemNode.parent?.children ?? list;
			const index = getNewIndex();
			const id = currentList[index].content.id;
			const cloned = nodes[0].content.clone();
			cloned.id = id;
			currentList[index].content = cloned;
			setCurrentName(currentList[index].content.name);
			onPasteItem?.(currentList[index], nodes[0]);
			pasteCutItem();
			onListUpdated?.();
			onSelectedItem?.(currentList[index], false);
		}
	};

	const handleUpdateID = async () => {
		setIsDialogUpdateIDOpen(true);
	};

	const handleAcceptUpdateID = (newID: number) => {
		if (currentSelectedItemNode) {
			const oldID = currentSelectedItemNode.content.id;
			if (newID !== oldID) {
				const existingNode = Node.getNodeByID(list, newID);
				if (existingNode) {
					existingNode.content.id = oldID;
				}
				currentSelectedItemNode.content.id = newID;
				onListUpdated?.();
			}
		}
	};

	const generateNewIDsToAllNodes = (node: Node) => {
		node.content.id = Node.getNewID(list);
		for (const child of node.children) {
			generateNewIDsToAllNodes(child);
		}
	};

	const handleClearItem = async () => {
		if (currentSelectedItemNode && !isEmpty) {
			currentSelectedItemNode.content = currentSelectedItemNode.content.clone();
			const model = currentSelectedItemNode.content;
			const id = model.id;
			model.applyDefault();
			model.id = id;
			model.name = '';
			setCurrentName('');
			onSelectedItem?.(currentSelectedItemNode, false);
			onListUpdated?.();
		}
	};

	const handleDisableItem = async () => {
		if (currentSelectedItemNode && !isEmpty) {
			(currentSelectedItemNode.content as MapObjectCommand).disabled = !(
				currentSelectedItemNode.content as MapObjectCommand
			).disabled;
			setForceUpdate((value) => !value);
			onListUpdated?.();
		}
	};

	const handleDeleteItem = async () => {
		const nodes = getCorrectSelectedNodes();
		if (nodes.length > 0) {
			for (const node of nodes) {
				node.willBeDeleted = true;
			}
			getTreeItems(list, []);
			const nextNode = nodes[nodes.length - 1].next ?? nodes[0].previous ?? null;
			for (const node of nodes) {
				ArrayUtils.removeElement(node.parent?.children ?? list, node);
				onDeleteItem?.(node);
			}
			setCurrentSelectedItemNode(nextNode);
			onListUpdated?.();
			onSelectedItem?.(nextNode, false);
		}
	};

	const handleAcceptDialog = (model?: Model.Base | null) => {
		if (model === undefined) {
			model = newModel;
		}
		let node: Node | null = null;
		if (model && currentSelectedItemNode) {
			const currentList = currentSelectedItemNode.parent?.children ?? list;
			node = Node.create(model);
			node.parent = currentSelectedItemNode.parent;
			const selectionIndexes = currentSelectedItemNode.content.getSelectionNextIndexes();
			ArrayUtils.insertAt(currentList, getNewIndex() + Math.max(1, selectionIndexes), node);
			onCreateItem?.(node);
			onAccept?.(node, true);
		} else {
			node = currentSelectedItemNode;
			onAccept?.(node!, false);
		}
		setNewModel(null);
		setCurrentSelectedItemNode(node);
		onSelectedItem?.(node, false);
		onListUpdated?.();
		handleSetFocus(true);
	};

	const handleRejectDialog = () => {
		setNewModel(null);
		handleSetFocus(true);
	};

	const removeDragDropClasses = (target: HTMLElement) => {
		target.classList.remove('dragOverTop');
		target.classList.remove('dragOverBot');
		target.classList.remove('dragOverComplete');
	};

	const getCompleteNodes = (node: Node): Node[] => {
		const nodes = [];
		nodes.push(node);
		const currentList = node.parent?.children ?? list;
		const selectionIndexes = node.content.getSelectionNextIndexes();
		const index = currentList.indexOf(node) + 1;
		for (let i = 0; i < selectionIndexes - 1; i++) {
			nodes.push(currentList[index + i]);
		}
		return nodes;
	};

	const checkNodeInsideNode = (node1: Node, node2: Node): boolean => {
		return checkNodeInside(node2, getCompleteNodes(node1));
	};

	const checkNodeInside = (otherNode: Node, nodes: Node[]): boolean => {
		const parent = otherNode.parent;
		if (parent !== null) {
			if (nodes.includes(parent)) {
				return true;
			}
			return checkNodeInside(parent, nodes);
		}
		return false;
	};

	const handleDragStart = (event: React.DragEvent, node: Node) => {
		setDraggedNode(node);
	};

	const handleDragOver = async (event: React.DragEvent, node: Node, onlyTop = false) => {
		event.preventDefault();
		const target = event.currentTarget as HTMLElement;
		if (draggedNode) {
			event.dataTransfer.dropEffect = 'move';
			if (
				(byIndex || draggedNode.content.id !== node.content.id) &&
				!checkNodeInsideNode(draggedNode, node) &&
				!Node.checkIDExists(draggedNode.children, node.content.id)
			) {
				removeDragDropClasses(target);
				const rect = target.getBoundingClientRect();
				const y = event.clientY - rect.top;
				if (node.isFolder()) {
					if ((!onlyTop && y < 5) || (onlyTop && y < 10)) {
						target.classList.add('dragOverTop');
					} else if (!onlyTop && y > 15) {
						target.classList.add('dragOverBot');
					} else if (!onlyTop) {
						target.classList.add('dragOverComplete');
					}
				} else {
					const isTop = y < 10;
					if (!onlyTop || (onlyTop && isTop)) {
						target.classList.add(`dragOver${isTop ? 'Top' : 'Bot'}`);
					}
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
				(node !== draggedNode &&
					!checkNodeInsideNode(draggedNode, node) &&
					target.classList.contains('dragOverComplete')) ||
				target.classList.contains('dragOverTop') ||
				target.classList.contains('dragOverBot')
			) {
				const nodes = getCompleteNodes(draggedNode);
				let dropList = draggedNode.parent?.children ?? list;
				for (const n of nodes) {
					ArrayUtils.removeElement(dropList, n);
				}
				if (target.classList.contains('dragOverComplete')) {
					node.children.push(draggedNode);
					draggedNode.parent = node;
				} else if (target.classList.contains('dragOverTop')) {
					dropList = node.parent?.children ?? list;
					let index = dropList.indexOf(node);
					if (index === -1) {
						index = dropList.length;
					}
					for (const n of nodes) {
						ArrayUtils.insertAt(dropList, index++, n);
						n.parent = node.parent;
					}
				} else if (target.classList.contains('dragOverBot')) {
					dropList = node.parent?.children ?? list;
					let index = dropList.indexOf(node) + 1;
					for (const n of nodes) {
						ArrayUtils.insertAt(dropList, index++, n);
						n.parent = node.parent;
					}
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

	const handleSetFocus = (b: boolean) => {
		if (b && disabled) {
			return;
		}
		RPM.isFocusingTree = b;
		setIsFocused(b);
	};
	handleSetFocusRef.current = handleSetFocus;

	useEffect(() => {
		if (!blurOnMouseLeave) return;
		const el = listRef.current;
		if (!el) return;
		const handleMouseDown = () => handleSetFocusRef.current(true);
		el.addEventListener('mousedown', handleMouseDown);
		return () => el.removeEventListener('mousedown', handleMouseDown);
	}, [blurOnMouseLeave]);

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
	}, [forcedCurrentSelectedItemID, setForcedCurrentSelectedItemID]);

	useLayoutEffect(() => {
		if (
			forcedCurrentSelectedItemIndex !== undefined &&
			forcedCurrentSelectedItemIndex !== null &&
			setForcedCurrentSelectedItemIndex
		) {
			const node =
				forcedCurrentSelectedItemIndex === -1
					? null
					: (list[forcedCurrentSelectedItemIndex] ?? Node.create(createDefault(-1)));
			setCurrentSelectedItemNode(node);
			setCurrentName(node?.content?.name ?? '');
			setForcedCurrentSelectedItemIndex(null);
			if (node) {
				setNeedScroll(true);
			}
			if (onSelectedItem) {
				onSelectedItem(node, false);
			}
		}
	}, [forcedCurrentSelectedItemIndex, setForcedCurrentSelectedItemIndex]);

	useLayoutEffect(() => {
		if (!noFirstSelection) {
			const index =
				defaultSelectedID === undefined ? 0 : list.findIndex((node) => node.content.id === defaultSelectedID);
			const node = list[index] ?? Node.create(createDefault(-1));
			setCurrentSelectedItemNode(node);
			setCurrentName(node.content.name);
			if (onSelectedItem) {
				onSelectedItem(node, false);
			}
		}
	}, [list]);

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

		const handleMouseDownOutside = (e: MouseEvent) => {
			if (listRef.current && !listRef.current.contains(e.target as globalThis.Node)) {
				handleSetFocus(false);
			}
		};
		const dialog = Utils.getViewport();
		dialog.addEventListener('mousedown', handleMouseDownOutside as EventListener);
		return () => {
			dialog.removeEventListener('mousedown', handleMouseDownOutside as EventListener);
		};
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (isFocused) {
				const currentTime = new Date().getTime();
				switch (event.key.toUpperCase()) {
					case 'ARROWUP':
						if (currentSelectedItemNode?.previous) {
							event.preventDefault();
							setCurrentSelectedItemNode(currentSelectedItemNode.previous);
							if (currentTime >= RPM.treeArrowTime + RPM.TREE_ARROW_LIMIT) {
								RPM.treeArrowTime = currentTime;
								onSelectedItem?.(currentSelectedItemNode.previous, true);
							}
							setNeedScroll(true);
						}
						break;
					case 'ARROWDOWN':
						if (currentSelectedItemNode?.next) {
							event.preventDefault();
							setCurrentSelectedItemNode(currentSelectedItemNode.next);
							if (currentTime >= RPM.treeArrowTime + RPM.TREE_ARROW_LIMIT) {
								RPM.treeArrowTime = currentTime;
								onSelectedItem?.(currentSelectedItemNode.next, true);
							}
							setNeedScroll(true);
						}
						break;
					default:
						break;
				}
			}
			return true;
		};
		const handleKeyUp = (event: KeyboardEvent) => {
			if (isFocused) {
				switch (event.key.toUpperCase()) {
					case 'ARROWUP':
					case 'ARROWDOWN':
						if (currentSelectedItemNode) {
							onSelectedItem?.(currentSelectedItemNode, true);
						}
						break;
					default:
						break;
				}
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [list, isFocused, currentSelectedItemNode, setCurrentSelectedItemNode]);

	const headers = constructorType.getTreeHeader();

	const getTreeItems = (
		nodes: Node[],
		items: ReactNode[],
		parent: Node | null = null,
		level = 0,
		addEmpty = false,
		emptyID = -1,
		parentSelected = false,
	): number => {
		const canAddEmptyNode =
			!cannotAdd && ((multipleLevels && addEmpty) || (level === 0 && !cannotAddEditRemoveRoot));
		let emptyNode: Node | null = null;
		if (canAddEmptyNode) {
			emptyNode = Node.create(createDefault(emptyID));
			emptyNode.parent = parent;
			emptyID--;
		}
		let selectNextIndexes = 0;
		for (const [index, node] of nodes.entries()) {
			const nbSelectionNextIndex = node.content.getSelectionNextIndexes();
			const nextNode = nodes[index + Math.max(nbSelectionNextIndex, 1)] ?? emptyNode;
			node.next = nextNode;
			if (nextNode && !nextNode.previous) {
				nextNode.previous = node;
			}
			const selected =
				selectNextIndexes > 0 ||
				parentSelected ||
				isSelected(byIndex ? index : node.content.id) ||
				additionalSelectedNodes.includes(node);
			if (selected && selectNextIndexes === 0) {
				selectNextIndexes = nbSelectionNextIndex;
			}
			if (selectNextIndexes > 0) {
				selectNextIndexes--;
			}
			items.push(
				<div key={byIndex ? `${index}-${level}` : node.content.id} ref={selected ? selectedElementRef : null}>
					<TreeItem
						node={node}
						level={level}
						selected={selected}
						onSwitchExpanded={handleSwitchExpandedItem}
						onMouseDown={handleMouseDownItem}
						onDragStart={
							!disabled && node.draggable && !node.content.isFixedNode() ? handleDragStart : undefined
						}
						onDragOver={
							!disabled && node.draggable && !node.content.isFixedNode()
								? (e, n) => handleDragOver(e, n, byIndex || nbSelectionNextIndex > 0)
								: undefined
						}
						onDragLeave={
							!disabled && node.draggable && !node.content.isFixedNode() ? handleDragLeave : undefined
						}
						onDrop={!disabled && node.draggable && !node.content.isFixedNode() ? handleDrop : undefined}
						draggable={!cannotDragDrop && node.draggable && !node.content.isFixedNode()}
						headers={headers}
						doNotShowID={doNotShowID}
						hideCheck={hideCheck}
						isCutSource={copiedItems?.isCut === true && copiedItems.sourceNodes?.includes(node) === true}
						hideTooltip={hideTooltip}
					/>
				</div>,
			);
			if (!node.willBeDeleted && !ArrayUtils.contains(notExpandedItemsList, node.content.id)) {
				emptyID = getTreeItems(
					node.children,
					items,
					node,
					level + 1,
					node.content.canHaveChildren(),
					emptyID,
					multipleLevels && selected,
				);
			}
		}
		if (canAddEmptyNode) {
			const selected =
				parentSelected ||
				isSelected(byIndex ? nodes.length : emptyNode!.content.id) ||
				additionalSelectedNodes.some((n) => n.content.id === emptyNode!.content.id);
			items.push(
				<div key={byIndex ? nodes.length : emptyNode!.content.id} ref={selected ? selectedElementRef : null}>
					<TreeItem
						node={emptyNode!}
						level={level}
						selected={selected}
						onSwitchExpanded={handleSwitchExpandedItem}
						onMouseDown={handleMouseDownItem}
						onDragOver={!disabled ? (e, n) => handleDragOver(e, n, true) : undefined}
						onDragLeave={!disabled ? handleDragLeave : undefined}
						onDrop={!disabled ? handleDrop : undefined}
						hideCheck={hideCheck}
						hideTooltip={hideTooltip}
					/>
				</div>,
			);
		}
		return emptyID;
	};

	const resetPreviousLinks = (nodes: Node[]) => {
		for (const node of nodes) {
			node.previous = null;
			resetPreviousLinks(node.children);
		}
	};

	const getItems = () => {
		const items: ReactNode[] = [];
		resetPreviousLinks(list);
		getTreeItems(list, items);
		return items;
	};

	const getContextMenuItems = () => {
		if (disabled) {
			return [];
		}
		const isFixed = currentSelectedItemNode?.content?.isFixedNode() ?? false;
		const disableAll =
			cannotAddEditRemoveRoot && (currentSelectedItemNode === list[0] || currentSelectedItemNode === list[1]);
		return contextMenuItems!.map((kind) => {
			switch (kind) {
				case CONTEXT_MENU_ITEM_KIND.EDIT:
					return {
						title: `${t('edit')}...`,
						shortcut: [KEY.ENTER, KEY.SPACE],
						onClick: handleEditItem,
						disabled: disableAll || isEmpty || isFixed || additionalSelectedNodes.length > 0 || cannotEdit,
					};
				case CONTEXT_MENU_ITEM_KIND.NEW:
					return {
						title: `${t('new')}...`,
						shortcut: [KEY.ENTER, KEY.SPACE],
						onClick: handleNewItem,
						disabled: disableAll || cannotAdd || isFixed || additionalSelectedNodes.length > 0,
					};
				case CONTEXT_MENU_ITEM_KIND.UPDATE_LIST_SIZE:
					return {
						title: `${t('update.list.size')}...`,
						onClick: handleUpdateListSize,
						disabled: disableAll || cannotAdd,
					};
				case CONTEXT_MENU_ITEM_KIND.COPY:
					return {
						title: t('copy'),
						shortcut: [SPECIAL_KEY.CTRL, KEY.C],
						onClick: handleCopyItem,
						disabled:
							disableAll || ((isEmpty || isFixed) && additionalSelectedNodes.length === 0) || cannotEdit,
					};
				case CONTEXT_MENU_ITEM_KIND.CUT:
					return {
						title: t('cut.clipboard'),
						shortcut: [SPECIAL_KEY.CTRL, KEY.X],
						onClick: handleCutItem,
						disabled:
							disableAll ||
							((isEmpty || isFixed) && additionalSelectedNodes.length === 0) ||
							cannotEdit ||
							cannotDelete,
					};
				case CONTEXT_MENU_ITEM_KIND.PASTE:
					return {
						title: t('paste'),
						shortcut: [SPECIAL_KEY.CTRL, KEY.V],
						onClick: handlePasteItem,
						disabled: disableAll || !canPaste() || isFixed || additionalSelectedNodes.length > 0,
					};
				case CONTEXT_MENU_ITEM_KIND.PASTE_OVER:
					return {
						title: t('paste.over'),
						shortcut: [SPECIAL_KEY.CTRL, KEY.B],
						onClick: handlePasteOverItem,
						disabled: disableAll || !canPaste() || isEmpty || isFixed || additionalSelectedNodes.length > 0,
					};
				case CONTEXT_MENU_ITEM_KIND.UPDATE_ID:
					return {
						title: `${t('update.id')}...`,
						shortcut: [KEY.I],
						onClick: handleUpdateID,
						disabled:
							disableAll ||
							isEmpty ||
							isFixed ||
							additionalSelectedNodes.length > 0 ||
							cannotEdit ||
							list.length <= 1,
					};
				case CONTEXT_MENU_ITEM_KIND.DELETE:
					return {
						title: t('delete'),
						shortcut: [KEY.DELETE],
						onClick: handleDeleteItem,
						disabled:
							disableAll ||
							(canDelete && !canDelete(currentSelectedItemNode)) ||
							((isEmpty || isFixed) && additionalSelectedNodes.length === 0) ||
							cannotDelete ||
							(!canBeEmpty && list.length === 1),
					};
				case CONTEXT_MENU_ITEM_KIND.CLEAR:
					return {
						title: t('clear'),
						shortcut: [SPECIAL_KEY.CTRL, KEY.D],
						onClick: handleClearItem,
						disabled:
							disableAll ||
							cannotClear ||
							isEmpty ||
							isFixed ||
							additionalSelectedNodes.length > 0 ||
							cannotEdit,
					};
				case CONTEXT_MENU_ITEM_KIND.DISABLE: {
					const isCommandDisabled = (currentSelectedItemNode?.content as MapObjectCommand)?.disabled;
					return {
						title: t(isCommandDisabled ? 'enable' : 'disable'),
						shortcut: [KEY.D],
						onClick: handleDisableItem,
						disabled: disableAll || isEmpty || isFixed || additionalSelectedNodes.length > 0,
					};
				}
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
		if (
			currentSelectedItemNode &&
			!cannotEdit &&
			constructorType &&
			constructorType !== Model.Checkable &&
			isOpenDialog
		) {
			const options = {
				isNew: newModel !== null,
				isOpen: isOpenDialog,
				setIsOpen: setIsOpenDialog,
				model: newModel ?? currentSelectedItemNode.content,
				parent: currentSelectedItemNode.parent,
				onAccept: handleAcceptDialog,
				onReject: handleRejectDialog,
			};
			return options.model.getDialog(options);
		} else {
			return null;
		}
	};

	const getHeaders = () =>
		headers.length > 0 && (
			<div className='treeHeader'>
				{headers.map((label) => (
					<Flex one key={label}>
						{t(label)}
					</Flex>
				))}
			</div>
		);

	const content = (
		<>
			<Flex column spacedLarge fillWidth fillHeight>
				<div
					onDoubleClick={handleDoubleClick}
					onTouchEnd={(e) => doubleTapHandler(e, handleDoubleClick)}
					onMouseLeave={
						blurOnMouseLeave
							? (e) => {
									const rect = listRef.current?.getBoundingClientRect();
									if (
										rect &&
										e.clientX >= rect.left &&
										e.clientX <= rect.right &&
										e.clientY >= rect.top &&
										e.clientY <= rect.bottom
									) {
										return;
									}
									handleSetFocusRef.current(false);
								}
							: undefined
					}
					className={Utils.getClassName(
						{ disabled, zeroHeightNoMobile: scrollable, focused: isFocused },
						'tree',
					)}
					style={{
						minWidth: `${minWidth}px`,
						minHeight: `${minHeight}px`,
						width: `${width}px`,
						height: `${height}px`,
					}}
					ref={listRef}
				>
					<ContextMenu items={getContextMenuItems()} isFocused={isFocused} setIsFocused={handleSetFocus}>
						<Flex spaced>{getHeaders()}</Flex>
						{getItems()}
					</ContextMenu>
				</div>
				{showEditName && (
					<Flex spaced>
						<div className={Utils.getClassName({ disabledLabel: disabled || isEditNameDisabled() })}>
							{t('name')}:
						</div>
						{isLocalization ? (
							<InputLocalization
								localization={currentSelectedItemNode?.content as Localization}
								onUpdate={() => setForceUpdate((value) => !value)}
								widthType={inputNameWidth}
								disabled={isEditNameDisabled()}
								onFocus={() => handleSetFocus(false)}
							/>
						) : (
							<InputText
								value={currentName}
								onChange={handleChangeName}
								widthType={inputNameWidth}
								disabled={isEditNameDisabled()}
								onFocus={() => handleSetFocus(false)}
							/>
						)}
					</Flex>
				)}
			</Flex>
			{getDialog()}
			{isDialogUpdateListSizeOpen && (
				<DialogUpdateListSize
					setIsOpen={setIsDialogUpdateListSizeOpen}
					initialSize={list.length}
					canBeEmpty={canBeEmpty}
					onAccept={handleAcceptUpdateListSize}
				/>
			)}
			{isDialogUpdateIDOpen && currentSelectedItemNode && (
				<DialogUpdateID
					setIsOpen={setIsDialogUpdateIDOpen}
					initialID={currentSelectedItemNode.content.id}
					onAccept={handleAcceptUpdateID}
				/>
			)}
		</>
	);

	return scrollable && !height ? (
		<Flex one column fillHeight>
			<Flex one column scrollable zeroHeight>
				{content}
			</Flex>
		</Flex>
	) : (
		content
	);
}

export default Tree;
