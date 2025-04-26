/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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
import { Node } from '../core';
import { Model } from '../Editor';
import useStateString from '../hooks/useStateString';
import { Inputs } from '../managers';
import { Localization } from '../models';
import { RootState, setCopiedItems } from '../store';
import '../styles/Tree.css';
import ContextMenu from './ContextMenu';
import DialogBattleCommand from './dialogs/models/DialogBattleCommand';
import DialogBattleMap from './dialogs/models/DialogBattleMap';
import DialogCameraProperty from './dialogs/models/DialogCameraProperty';
import DialogColor from './dialogs/models/DialogColor';
import DialogCost from './dialogs/models/DialogCost';
import DialogCreateParameter from './dialogs/models/DialogCreateParameter';
import DialogCurrency from './dialogs/models/DialogCurrency';
import DialogCustomStructure from './dialogs/models/DialogCustomStructure';
import DialogDetection from './dialogs/models/DialogDetection';
import DialogDynamicNumber from './dialogs/models/DialogDynamicNumber';
import DialogElement from './dialogs/models/DialogElement';
import DialogFontName from './dialogs/models/DialogFontName';
import DialogFontSize from './dialogs/models/DialogFontSize';
import DialogFrequency from './dialogs/models/DialogFrequency';
import DialogGameOverCommand from './dialogs/models/DialogGameOverCommand';
import DialogHeroStatisticDisplay from './dialogs/models/DialogHeroStatisticDisplay';
import DialogInitialPartyMember from './dialogs/models/DialogInitialPartyMember';
import DialogInventoryFilter from './dialogs/models/DialogInventoryFilter';
import DialogLocalization from './dialogs/models/DialogLocalization';
import DialogMainMenuCommand from './dialogs/models/DialogMainMenuCommand';
import DialogMapObjectCommand from './dialogs/models/DialogMapObjectCommand';
import DialogMapObjectCommandMove from './dialogs/models/DialogMapObjectCommandMove';
import DialogMapObjectCommandShopItem from './dialogs/models/DialogMapObjectCommandShopItem';
import DialogMapObjectEvent from './dialogs/models/DialogMapObjectEvent';
import DialogMapObjectParameter from './dialogs/models/DialogMapObjectParameter';
import DialogMapObjectProperty from './dialogs/models/DialogMapObjectProperty';
import DialogMapObjectState from './dialogs/models/DialogMapObjectState';
import DialogName from './dialogs/models/DialogName';
import DialogPlugin from './dialogs/models/DialogPlugin';
import DialogPluginCommand from './dialogs/models/DialogPluginCommand';
import DialogPluginParameter from './dialogs/models/DialogPluginParameter';
import DialogRandomBattle from './dialogs/models/DialogRandomBattle';
import DialogSkybox from './dialogs/models/DialogSkybox';
import DialogSpeed from './dialogs/models/DialogSpeed';
import DialogStatistic from './dialogs/models/DialogStatistic';
import DialogTitleCommand from './dialogs/models/DialogTitleCommand';
import DialogWeaponArmorKind from './dialogs/models/DialogWeaponArmorKind';
import DialogWindowSkin from './dialogs/models/DialogWindowSkin';
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
	cannotDelete?: boolean;
	canDelete?: (node: Node | null) => boolean;
	canBeEmpty?: boolean;
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
	onPasteItem?: (node: Node) => void;
	onListUpdated?: () => void;
	onAccept?: (node: Node, isNew: boolean) => void;
	forcedCurrentSelectedItemID?: number | null;
	setForcedCurrentSelectedItemID?: (forced: number | null) => void;
	forcedCurrentSelectedItemIndex?: number | null;
	setForcedCurrentSelectedItemIndex?: (forced: number | null) => void;
	minWidth?: number;
	minHeight?: number;
	byIndex?: boolean;
	onDrop?: () => Promise<void>;
	disabled?: boolean;
	scrollable?: boolean;
	multipleSelection?: boolean;
	noScrollOnForce?: boolean;
	applyDefault?: boolean;
	noFirstSelection?: boolean;
	isLocalization?: boolean;
	cannotAddEditRemoveRoot?: boolean;
	hideCheck?: boolean;
	triggerUpdate?: boolean;
};

export const TREES_MIN_WIDTH = 150;
export const TREES_MIN_HEIGHT = 100;
export const TREES_LARGE_MIN_WIDTH = 250;

function Tree({
	list,
	constructorType = Model.Base,
	defaultNewModel,
	cannotAdd = false,
	cannotEdit = false,
	cannotDragDrop = false,
	cannotDelete = false,
	canDelete,
	canBeEmpty = false,
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
	minHeight,
	disabled = false,
	scrollable = false,
	multipleSelection = false,
	noScrollOnForce = false,
	applyDefault = false,
	noFirstSelection = false,
	isLocalization = false,
	cannotAddEditRemoveRoot = false,
	hideCheck = false,
}: Props) {
	const { t } = useTranslation();

	const listRef = useRef<HTMLDivElement>(null);

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
			(cannotAdd ? null : Node.create(createDefault(-1)))
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

	const copiedItems = useSelector((state: RootState) => state.projects.copiedItems);

	const selectedElementRef = useRef<HTMLDivElement>(null);

	const dispatch = useDispatch();

	let hasCustomItems = true;
	if (!contextMenuItems) {
		contextMenuItems = [
			CONTEXT_MENU_ITEM_KIND.EDIT,
			CONTEXT_MENU_ITEM_KIND.NEW,
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
		if (!noScrollOnForce && selectedElementRef.current) {
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
		if (currentSelectedItemNode === node) {
			return;
		}
		if (multipleSelection && (Inputs.isSHIFT || Inputs.isCTRL)) {
			if (node.content.id !== currentSelectedItemNode!.content.id) {
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

	const handleDoubleClick = () => {
		if (!hasCustomItems && (!cannotAddEditRemoveRoot || currentSelectedItemNode !== list[0])) {
			if (isEmpty) {
				handleNewItem();
			} else {
				handleEditItem();
			}
		}
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
		setIsOpenDialog(true);
	};

	const handleEditItem = async () => {
		setIsOpenDialog(true);
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

	const handlePasteItem = async () => {
		if (currentSelectedItemNode && copiedItems) {
			const nodes = copiedItems.values;
			const currentList = currentSelectedItemNode.parent?.children ?? list;
			let index = getNewIndex();
			let cloned: Node | null = null;
			let firstCloned: Node | null = null;
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
				onPasteItem?.(cloned);
			}
			if (firstCloned) {
				setCurrentSelectedItemNode(firstCloned);
				onSelectedItem?.(firstCloned, false);
			}
			onListUpdated?.();
		}
	};

	const generateNewIDsToAllNodes = (node: Node) => {
		node.content.id = Node.getNewID(list);
		for (const child of node.children) {
			generateNewIDsToAllNodes(child);
		}
	};

	const handleDeleteItem = async () => {
		const nodes = getCorrectSelectedNodes();
		if (nodes.length > 0) {
			for (const node of nodes) {
				node.willBeDeleted = true;
			}
			getTreeItems(list, []);
			const nextNode = nodes[nodes.length - 1].next;
			for (const node of nodes) {
				ArrayUtils.removeElement(node.parent?.children ?? list, node);
				onDeleteItem?.(node);
			}
			setCurrentSelectedItemNode(nextNode);
			onListUpdated?.();
			onSelectedItem?.(nextNode, false);
		}
	};

	const handleAcceptDialog = () => {
		let node: Node | null = null;
		if (newModel && currentSelectedItemNode) {
			const currentList = currentSelectedItemNode.parent?.children ?? list;
			node = Node.create(newModel);
			node.parent = currentSelectedItemNode.parent;
			ArrayUtils.insertAt(currentList, getNewIndex(), node);
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
	};

	const handleRejectDialog = () => {
		setNewModel(null);
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
				draggedNode.content.id !== node.content.id &&
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
			const node =
				forcedCurrentSelectedItemIndex === -1
					? null
					: list[forcedCurrentSelectedItemIndex] ?? Node.create(createDefault(-1));
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
		// eslint-disable-next-line
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
		// eslint-disable-next-line
	}, [list]);

	useEffect(() => {
		if (needScroll) {
			scrollToSelectedElement();
			setNeedScroll(false);
		}
		// eslint-disable-next-line
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
				setIsFocused(false);
			}
		};
		const dialog = document.getElementsByClassName('dialog')[0] ?? document;
		dialog.addEventListener('mousedown', handleMouseDownOutside as EventListener);
		return () => {
			dialog.removeEventListener('mousedown', handleMouseDownOutside as EventListener);
		};
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const handleKeyDown = async (event: KeyboardEvent) => {
			if (isFocused) {
				switch (event.key.toUpperCase()) {
					case 'ARROWUP':
						if (currentSelectedItemNode?.previous) {
							setCurrentSelectedItemNode(currentSelectedItemNode.previous);
						}
						break;
					case 'ARROWDOWN':
						if (currentSelectedItemNode?.next) {
							setCurrentSelectedItemNode(currentSelectedItemNode.next);
						}
						break;
					default:
						break;
				}
			}
			return true;
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
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
		parentSelected = false
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
			const nextNode = nodes[index + nbSelectionNextIndex + 1] ?? emptyNode;
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
								? (e, n) => handleDragOver(e, n, nbSelectionNextIndex > 0)
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
					/>
				</div>
			);
			if (!node.willBeDeleted && !ArrayUtils.contains(notExpandedItemsList, node.content.id)) {
				emptyID = getTreeItems(
					node.children,
					items,
					node,
					level + 1,
					node.content.canHaveChildren(),
					emptyID,
					multipleLevels && selected
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
					/>
				</div>
			);
		}
		return emptyID;
	};

	const getItems = () => {
		const items: ReactNode[] = [];
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
						title: 'Edit...',
						shortcut: [KEY.ENTER],
						onClick: handleEditItem,
						disabled: disableAll || isEmpty || cannotAdd || isFixed || additionalSelectedNodes.length > 0,
					};
				case CONTEXT_MENU_ITEM_KIND.NEW:
					return {
						title: 'New...',
						shortcut: [KEY.ENTER],
						onClick: handleNewItem,
						disabled: disableAll || cannotAdd || isFixed || additionalSelectedNodes.length > 0,
					};
				case CONTEXT_MENU_ITEM_KIND.COPY:
					return {
						title: 'Copy',
						shortcut: [SPECIAL_KEY.CTRL, KEY.C],
						onClick: handleCopyItem,
						disabled:
							disableAll || ((isEmpty || isFixed) && additionalSelectedNodes.length === 0) || cannotAdd,
					};
				case CONTEXT_MENU_ITEM_KIND.PASTE:
					return {
						title: 'Paste',
						shortcut: [SPECIAL_KEY.CTRL, KEY.V],
						onClick: handlePasteItem,
						disabled: disableAll || !canPaste() || isFixed || additionalSelectedNodes.length > 0,
					};
				case CONTEXT_MENU_ITEM_KIND.DELETE:
					return {
						title: 'Delete',
						shortcut: [KEY.DELETE],
						onClick: handleDeleteItem,
						disabled:
							disableAll ||
							(canDelete && !canDelete(currentSelectedItemNode)) ||
							((isEmpty || isFixed) && additionalSelectedNodes.length === 0) ||
							cannotDelete ||
							(!canBeEmpty && list.length === 1),
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
		if (currentSelectedItemNode && !cannotEdit && constructorType !== Model.Checkable && isOpenDialog) {
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
				case Model.Localization:
					return <DialogLocalization {...options} />;
				case Model.MapObjectCommandMove:
					return <DialogMapObjectCommandMove {...options} />;
				case Model.MapObjectCommandShopItem:
					return <DialogMapObjectCommandShopItem {...options} />;
				case Model.Cost:
					return <DialogCost {...options} />;
				case Model.RandomBattle:
					return <DialogRandomBattle {...options} />;
				case Model.DynamicNumber:
					return <DialogDynamicNumber {...options} />;
				case Model.FontSize:
					return <DialogFontSize {...options} />;
				case Model.FontName:
					return <DialogFontName {...options} />;
				case Model.Color:
					return <DialogColor {...options} />;
				case Model.WindowSkin:
					return <DialogWindowSkin {...options} />;
				case Model.Currency:
					return <DialogCurrency {...options} />;
				case Model.Speed:
					return <DialogSpeed {...options} />;
				case Model.Detection:
					return <DialogDetection {...options} />;
				case Model.CameraProperty:
					return <DialogCameraProperty {...options} />;
				case Model.Frequency:
					return <DialogFrequency {...options} />;
				case Model.Skybox:
					return <DialogSkybox {...options} />;
				case Model.InitialPartyMember:
					return <DialogInitialPartyMember {...options} />;
				case Model.BattleMap:
					return <DialogBattleMap {...options} />;
				case Model.Element:
					return <DialogElement {...options} />;
				case Model.ElementEfficiency:
					return <DialogDynamicNumber decimal {...options} />;
				case Model.Statistic:
					return <DialogStatistic {...options} />;
				case Model.WeaponArmorKind:
					return <DialogWeaponArmorKind {...options} />;
				case Model.BattleCommand:
					return <DialogBattleCommand {...options} />;
				case Model.TitleCommand:
					return <DialogTitleCommand {...options} />;
				case Model.GameOverCommand:
					return <DialogGameOverCommand {...options} />;
				case Model.InventoryFilter:
					return <DialogInventoryFilter {...options} />;
				case Model.MainMenuCommand:
					return <DialogMainMenuCommand {...options} />;
				case Model.HeroStatisticDisplay:
					return <DialogHeroStatisticDisplay {...options} />;
				case Model.CreateParameter:
					return <DialogCreateParameter {...options} />;
				case Model.Plugin:
					return options.isNew ? <DialogPlugin {...options} /> : null;
				case Model.PluginParameter:
					return <DialogPluginParameter {...options} />;
				case Model.PluginDefaultParameter:
					return <DialogPluginParameter isDefault {...options} />;
				case Model.CustomStructure:
					return <DialogCustomStructure parent={currentSelectedItemNode.parent} {...options} />;
				case Model.PluginCommand:
					return <DialogPluginCommand {...options} />;
				default:
					return <DialogName {...options} />;
			}
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

	return (
		<ContextMenu items={getContextMenuItems()} isFocused={isFocused} setIsFocused={setIsFocused}>
			<Flex column spacedLarge fillWidth fillHeight>
				<div
					onDoubleClick={handleDoubleClick}
					className={Utils.getClassName({ disabled, zeroHeight: scrollable }, 'tree')}
					style={{ minWidth: `${minWidth}px`, minHeight: `${minHeight}px` }}
					ref={listRef}
				>
					<Flex spaced>{getHeaders()}</Flex>
					{getItems()}
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
							/>
						) : (
							<InputText
								value={currentName}
								onChange={handleChangeName}
								widthType={INPUT_TYPE_WIDTH.FILL}
								disabled={isEditNameDisabled()}
							/>
						)}
					</Flex>
				)}
			</Flex>
			{getDialog()}
		</ContextMenu>
	);
}

export default Tree;
