/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { ReactNode, useState } from 'react';
import '../styles/Tree.css';
import Tree from './Tree';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Node, Project } from '../core';
import { ArrayUtils, CONTEXT_MENU_ITEM_KIND, KEY, RPM } from '../common';
import { Model } from '../Editor';
import DialogMapProperties from './dialogs/DialogMapProperties';
import DialogName from './dialogs/DialogName';
import Dialog from './dialogs/Dialog';
import FooterNoYes from './dialogs/footers/FooterNoYes';

type Props = {
	onSelectedItem?: (node: Node | null, isClick: boolean) => void;
	forcedCurrentSelectedItemID?: number | null;
	setForcedCurrentSelectedItemID?: (forced: number | null) => void;
	mapsTabsTitles: Model.Base[];
	setMapsTabsTitles: (tiles: Model.Base[]) => void;
	mapsTabsContents: (ReactNode | null)[];
	setMapsTabsContents: (contents: (ReactNode | null)[]) => void;
};

function TreeMaps({
	onSelectedItem,
	forcedCurrentSelectedItemID,
	setForcedCurrentSelectedItemID,
	mapsTabsTitles,
	setMapsTabsTitles,
	mapsTabsContents,
	setMapsTabsContents,
}: Props) {
	const [isNew, setIsNew] = useState(false);
	const [editedMap, setEditedMap] = useState<Model.Map>(new Model.Map());
	const [editedFolder, setEditedFolder] = useState<Model.Base>(new Model.Base());
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);
	const [needOpenMapProperties, setNeedOpenMapProperties] = useState(false);
	const [needOpenName, setNeedOpenName] = useState(false);
	const [isOpenDialogConfirm, setIsOpenDialogConfirm] = useState(false);
	const [isDeletingMap, setIsDeletingMap] = useState(false);

	const isOpenLoading = useSelector((state: RootState) => state.projects.openLoading);

	if (!Project.current || isOpenLoading) {
		return null;
	}

	const handleSelectedItem = (node: Node | null, isClick: boolean) => {
		onSelectedItem?.(node, isClick);
		setSelectedNode(node);
	};

	const handleEditFolder = async () => {
		setEditedFolder(RPM.treeCurrentItem!.content);
		setIsNew(false);
		setNeedOpenName(true);
	};

	const handleAcceptEditFolder = async () => {
		if (selectedNode) {
			const ids = Node.getAllIDs(selectedNode.children);
			let changed = false;
			for (const id of ids) {
				const element = mapsTabsTitles.find((value) => value.id === id);
				if (element) {
					element.name = Node.getPathByID(Project.current!.treeMaps.tree, id);
					changed = true;
				}
			}
			if (changed) {
				setMapsTabsTitles([...mapsTabsTitles]);
			}
		}
		RPM.treeCurrentForceUpdate();
	};

	const handleNewMap = async () => {
		const id = Node.getNewID(RPM.treeCurrentItems);
		const name = Model.Map.generateMapName(id);
		setEditedMap(Model.Map.create(id, name));
		setIsNew(true);
		setNeedOpenMapProperties(true);
	};

	const handleAcceptNewMap = async () => {
		if (editedMap && selectedNode) {
			const node = new Node(Model.TreeMapTag.create(editedMap.id, editedMap.name), [], selectedNode);
			selectedNode.children.push(node);
			const map = Model.Map.create(editedMap.id, editedMap.name);
			await map.createNewMap();
			RPM.treeCurrentSetSelectedItem(node);
		}
	};

	const handleNewFolder = async () => {
		const id = Node.getNewID(RPM.treeCurrentItems, false);
		const name = 'New folder';
		setEditedFolder(Model.Base.create(id, name));
		setIsNew(true);
		setNeedOpenName(true);
	};

	const handleAcceptNewFolder = async () => {
		if (editedFolder && selectedNode) {
			const node = new Node(Model.TreeMapTag.create(editedFolder.id, editedFolder.name), [], selectedNode);
			selectedNode.children.push(node);
			RPM.treeCurrentSetSelectedItem(node);
		}
	};

	const handleDeleteFolder = async () => {
		setIsDeletingMap(false);
		setIsOpenDialogConfirm(true);
	};

	const handleAcceptDeleteFolder = async () => {
		if (selectedNode && selectedNode.parent) {
			const [newTitles, newContents] = await deleteFolder(
				selectedNode.children,
				[...mapsTabsTitles],
				[...mapsTabsContents]
			);
			ArrayUtils.removeElement(selectedNode.parent.children, selectedNode);
			if (newTitles.length !== mapsTabsTitles.length) {
				setMapsTabsTitles(newTitles);
				setMapsTabsContents(newContents);
			}
			RPM.treeCurrentSetSelectedItem(selectedNode.parent);
		}
		setIsOpenDialogConfirm(false);
	};

	const deleteFolder = async (
		nodes: Node[],
		tabTitles: Model.Base[],
		tabContents: (ReactNode | null)[]
	): Promise<[Model.Base[], (ReactNode | null)[]]> => {
		for (const node of nodes) {
			if (node.children.length > 0) {
				[tabTitles, tabContents] = await deleteFolder(node.children, tabTitles, tabContents);
			} else {
				const map = Model.Map.create(node.content.id, node.content.name);
				await map.deleteMap();
				const tabIndex = tabTitles.findIndex((value) => value.id === node.content.id);
				if (tabIndex !== -1) {
					ArrayUtils.removeAt(tabTitles, tabIndex);
					ArrayUtils.removeAt(tabContents, tabIndex);
				}
			}
		}
		return [tabTitles, tabContents];
	};

	const handleRejectDelete = async () => {
		setIsOpenDialogConfirm(false);
	};

	const handleEditMap = async () => {
		setEditedMap(RPM.treeCurrentItem!.content as Model.Map);
		setIsNew(false);
		setNeedOpenMapProperties(true);
	};

	const handleAcceptEditMap = async () => {
		if (selectedNode) {
			const element = mapsTabsTitles.find((value) => value.id === editedMap.id);
			if (element) {
				element.name = Node.getPathByID(Project.current!.treeMaps.tree, editedMap.id);
				setMapsTabsTitles([...mapsTabsTitles]);
			}
		}
		RPM.treeCurrentForceUpdate();
	};

	const handleDeleteMap = async () => {
		setIsDeletingMap(true);
		setIsOpenDialogConfirm(true);
	};

	const handleAcceptDeleteMap = async () => {
		if (selectedNode && selectedNode.parent) {
			const map = Model.Map.create(selectedNode.content.id, selectedNode.content.name);
			await map.deleteMap();
			const parent = selectedNode.parent;
			ArrayUtils.removeElement(parent.children, selectedNode);
			RPM.treeCurrentSetSelectedItem(parent);
			const tabIndex = mapsTabsTitles.findIndex((value) => value.id === selectedNode.content.id);
			if (tabIndex !== -1) {
				const newTitles = [...mapsTabsTitles];
				ArrayUtils.removeAt(newTitles, tabIndex);
				setMapsTabsTitles(newTitles);
				const newContents = [...mapsTabsContents];
				ArrayUtils.removeAt(newContents, tabIndex);
				setMapsTabsContents(newContents);
			}
		}
		setIsOpenDialogConfirm(false);
	};

	const getContextMenuItems = () =>
		selectedNode
			? (selectedNode.content as Model.TreeMapTag).isFolder()
				? [
						{
							title: 'Edit name...',
							onClick: handleEditFolder,
						},
						{
							title: 'New map...',
							onClick: handleNewMap,
						},
						{
							title: 'New folder...',
							onClick: handleNewFolder,
						},
						{
							title: 'Copy',
							disabled: selectedNode.content.id === -1,
						},
						{
							title: 'Paste',
							disabled: selectedNode.content.id === -1,
						},
						{
							title: 'Delete',
							onClick: handleDeleteFolder,
							disabled: selectedNode.content.id === -1,
						},
				  ]
				: [
						{
							title: 'Edit map properties...',
							onClick: handleEditMap,
						},
						CONTEXT_MENU_ITEM_KIND.COPY,
						CONTEXT_MENU_ITEM_KIND.PASTE,
						{
							title: 'Delete',
							onClick: handleDeleteMap,
							shortcut: [KEY.DELETE],
						},
				  ]
			: [];

	return (
		<>
			<Tree
				list={Project.current.treeMaps.tree}
				constructorType={Model.TreeMapTag}
				contextMenuItems={getContextMenuItems()}
				defaultSelectedID={-1}
				onSelectedItem={handleSelectedItem}
				forcedCurrentSelectedItemID={forcedCurrentSelectedItemID}
				setForcedCurrentSelectedItemID={setForcedCurrentSelectedItemID}
			/>
			<DialogMapProperties
				needOpen={needOpenMapProperties}
				setNeedOpen={setNeedOpenMapProperties}
				model={editedMap}
				onAccept={isNew ? handleAcceptNewMap : handleAcceptEditMap}
			/>
			<DialogName
				needOpen={needOpenName}
				setNeedOpen={setNeedOpenName}
				model={editedFolder}
				onAccept={isNew ? handleAcceptNewFolder : handleAcceptEditFolder}
			/>
			<Dialog
				title='Warning'
				isOpen={isOpenDialogConfirm}
				footer={
					<FooterNoYes
						onNo={handleRejectDelete}
						onYes={isDeletingMap ? handleAcceptDeleteMap : handleAcceptDeleteFolder}
					/>
				}
				onClose={handleRejectDelete}
			>
				<p className='warning text-center'>
					{isDeletingMap
						? 'Are you sure you want to delete this map?'
						: 'Are you sure you want to delete this directory? This will delete all the maps inside this folder.'}
				</p>
			</Dialog>
		</>
	);
}

export default TreeMaps;
