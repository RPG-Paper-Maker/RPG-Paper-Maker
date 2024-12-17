/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ArrayUtils, KEY, Paths, RPM, SPECIAL_KEY } from '../common';
import { Platform } from '../common/Platform';
import { Node, Project } from '../core';
import { Model } from '../Editor';
import { TreeMapTag } from '../models';
import { RootState, setCopiedItems, setNeedsReloadMap } from '../store';
import '../styles/Tree.css';
import Dialog from './dialogs/Dialog';
import FooterNoYes from './dialogs/footers/FooterNoYes';
import DialogMapProperties from './dialogs/models/DialogMapProperties';
import DialogName from './dialogs/models/DialogName';
import Tree from './Tree';

type Props = {
	onSelectedItem?: (node: Node | null, isClick: boolean) => void;
	forcedCurrentSelectedItemID?: number | null;
	setForcedCurrentSelectedItemID?: (forced: number | null) => void;
	mapsTabsTitles?: Model.Base[];
	setMapsTabsTitles?: (tiles: Model.Base[]) => void;
	mapsTabsContents?: (ReactNode | null)[];
	setMapsTabsContents?: (contents: (ReactNode | null)[]) => void;
	cannotEdit?: boolean;
	minWidth?: number;
};

function TreeMaps({
	onSelectedItem,
	forcedCurrentSelectedItemID,
	setForcedCurrentSelectedItemID,
	mapsTabsTitles,
	setMapsTabsTitles,
	mapsTabsContents,
	setMapsTabsContents,
	cannotEdit = false,
	minWidth,
}: Props) {
	const { t } = useTranslation();

	const [isNew, setIsNew] = useState(false);
	const [editedMap, setEditedMap] = useState<Model.Map>(new Model.Map());
	const [editedFolder, setEditedFolder] = useState<Model.Base>(new Model.Base());
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);
	const [isOpenMapProperties, setIsOpenMapProperties] = useState(false);
	const [isOpenName, setIsOpenName] = useState(false);
	const [isOpenDialogConfirm, setIsOpenDialogConfirm] = useState(false);
	const [isDeletingMap, setIsDeletingMap] = useState(false);

	const isOpenLoading = useSelector((state: RootState) => state.projects.openLoading);
	const copiedItems = useSelector((state: RootState) => state.projects.copiedItems);
	useSelector((state: RootState) => state.triggers.treeMap);

	const dispatch = useDispatch();

	if (isOpenLoading) {
		return null;
	}

	const canPaste = () => copiedItems?.constructorClass === Model.TreeMapTag;

	const handleSelectedItem = (node: Node | null, isClick: boolean) => {
		onSelectedItem?.(node, isClick);
		setSelectedNode(node);
	};

	const handleEditFolder = async () => {
		setEditedFolder(RPM.treeCurrentItem!.content);
		setIsNew(false);
		setIsOpenName(true);
	};

	const handleAcceptEditFolder = async () => {
		RPM.treeCurrentForceUpdate();
	};

	const handleNewMap = async () => {
		const id = Node.getNewID(RPM.treeCurrentItems);
		const name = Model.Map.generateMapName(id);
		setEditedMap(Model.Map.createDefaultNewMap(id, name));
		setIsNew(true);
		setIsOpenMapProperties(true);
	};

	const handleAcceptNewMap = async () => {
		if (editedMap && selectedNode) {
			const node = Node.create(Model.TreeMapTag.create(editedMap.id, editedMap.name), [], selectedNode);
			selectedNode.children.push(node);
			await editedMap.createNewMap();
			RPM.treeCurrentSetSelectedItem(node);
		}
	};

	const handleNewFolder = async () => {
		const id = Node.getNewID(RPM.treeCurrentItems, false);
		const name = t('new.folder');
		setEditedFolder(Model.Base.create(id, name));
		setIsNew(true);
		setIsOpenName(true);
	};

	const handleAcceptNewFolder = async () => {
		if (editedFolder && selectedNode) {
			const node = Node.create(Model.TreeMapTag.create(editedFolder.id, editedFolder.name), [], selectedNode);
			selectedNode.children.push(node);
			RPM.treeCurrentSetSelectedItem(node);
		}
	};

	const handleCopy = async () => {
		if (selectedNode) {
			dispatch(setCopiedItems(await Node.saveToCopy([selectedNode])));
		}
	};

	const handlePaste = async () => {
		if (selectedNode && copiedItems) {
			const nodes = copiedItems.values;
			const path = Paths.join(copiedItems.pathProject, Paths.MAPS);
			const exists = await Platform.checkFileExists(path);
			if (!exists) {
				alert(
					t('warning.path.doesnt.exist.copy.maps', {
						path,
					})
				);
			} else {
				for (const node of nodes) {
					const cloned = node.clone();
					cloned.parent = selectedNode;
					selectedNode.children.push(cloned);
					await paste(cloned);
					RPM.treeCurrentSetSelectedItem(cloned);
				}
			}
		}
	};

	const paste = async (node: Node) => {
		const tag = node.content as Model.TreeMapTag;
		const newId = Node.getNewID(Project.current!.treeMaps.tree, !tag.isFolder());
		if (tag.isFolder()) {
			for (const child of node.children) {
				await paste(child);
			}
		} else {
			const srcMap = Model.Map.create(tag.id, tag.name);
			const src = Paths.join(copiedItems!.pathProject, Paths.MAPS, srcMap.getRealName());
			const exists = await Platform.checkFileExists(src);
			const map = Model.Map.create(newId, tag.name);
			if (!exists) {
				alert(t('warning.could.not.copy.map.created.empty', { path: src }));
				await map.createNewMap();
			} else {
				await Platform.copyFolder(src, Paths.join(Project.current!.getPath(), Paths.MAPS, map.getRealName()));
				await map.load();
				map.id = newId;
				await map.save();
			}
		}
		tag.id = newId;
	};

	const handleDeleteFolder = async () => {
		setIsDeletingMap(false);
		setIsOpenDialogConfirm(true);
	};

	const handleAcceptDeleteFolder = async () => {
		if (selectedNode && selectedNode.parent && mapsTabsTitles && mapsTabsContents) {
			const [newTitles, newContents] = await deleteFolder(
				selectedNode.children,
				[...mapsTabsTitles],
				[...mapsTabsContents]
			);
			ArrayUtils.removeElement(selectedNode.parent.children, selectedNode);
			if (newTitles.length !== mapsTabsTitles.length) {
				setMapsTabsTitles?.(newTitles);
				setMapsTabsContents?.(newContents);
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
		const map = Model.Map.create(RPM.treeCurrentItem!.content.id, RPM.treeCurrentItem!.content.name);
		await map.load();
		setEditedMap(map);
		setIsNew(false);
		setIsOpenMapProperties(true);
	};

	const handleAcceptEditMap = async (previousModel: Model.Map) => {
		if (selectedNode) {
			selectedNode.content.name = editedMap.name;
			const element = mapsTabsTitles?.find((value) => value.id === editedMap.id);
			if (element && mapsTabsTitles) {
				element.name = editedMap.name;
				setMapsTabsTitles?.([...mapsTabsTitles]);
			}
			await editedMap.resizeMap(previousModel);
			const tag = selectedNode.content as TreeMapTag;
			const cursor = tag.cursorPosition;
			if (cursor) {
				editedMap.adjustPosition(cursor);
			}
			await Project.current!.treeMaps.save();
			await editedMap.save();
			await tag.saveFiles();
			dispatch(setNeedsReloadMap());
		}
		RPM.treeCurrentForceUpdate();
	};

	const handleDeleteMap = async () => {
		setIsDeletingMap(true);
		setIsOpenDialogConfirm(true);
	};

	const handleAcceptDeleteMap = async () => {
		if (selectedNode && selectedNode.parent && mapsTabsTitles && mapsTabsContents) {
			const map = Model.Map.create(selectedNode.content.id, selectedNode.content.name);
			await map.deleteMap();
			const parent = selectedNode.parent;
			ArrayUtils.removeElement(parent.children, selectedNode);
			RPM.treeCurrentSetSelectedItem(parent);
			const tabIndex = mapsTabsTitles.findIndex((value) => value.id === selectedNode.content.id);
			if (tabIndex !== -1) {
				const newTitles = [...mapsTabsTitles];
				ArrayUtils.removeAt(newTitles, tabIndex);
				setMapsTabsTitles?.(newTitles);
				const newContents = [...mapsTabsContents];
				ArrayUtils.removeAt(newContents, tabIndex);
				setMapsTabsContents?.(newContents);
			}
		}
		setIsOpenDialogConfirm(false);
	};

	const handleDrop = async () => {
		await Project.current!.treeMaps.save();
	};

	const getContextMenuItems = () => {
		if (selectedNode && !cannotEdit) {
			if ((selectedNode.content as Model.TreeMapTag).isFolder()) {
				return [
					{
						title: `${t('edit.name')}...`,
						onClick: handleEditFolder,
					},
					{
						title: `${t('new.map')}...`,
						onClick: handleNewMap,
					},
					{
						title: `${t('new.folder')}...`,
						onClick: handleNewFolder,
					},
					{
						title: t('copy'),
						onClick: handleCopy,
						disabled: selectedNode.content.id === -1,
						shortcut: [SPECIAL_KEY.CTRL, KEY.C],
					},
					{
						title: t('paste'),
						onClick: handlePaste,
						disabled: !canPaste(),
						shortcut: [SPECIAL_KEY.CTRL, KEY.V],
					},
					{
						title: t('delete'),
						onClick: handleDeleteFolder,
						disabled: selectedNode.content.id === -1,
						shortcut: [KEY.DELETE],
					},
				];
			} else {
				return [
					{
						title: `${t('edit.map.properties')}...`,
						onClick: handleEditMap,
					},
					{
						title: t('copy'),
						onClick: handleCopy,
						shortcut: [SPECIAL_KEY.CTRL, KEY.C],
					},
					{
						title: t('delete'),
						onClick: handleDeleteMap,
						shortcut: [KEY.DELETE],
					},
				];
			}
		}
		return [];
	};

	return (
		<>
			<Tree
				list={Project.current!.treeMaps.tree}
				constructorType={Model.TreeMapTag}
				contextMenuItems={getContextMenuItems()}
				defaultSelectedID={-1}
				onSelectedItem={handleSelectedItem}
				forcedCurrentSelectedItemID={forcedCurrentSelectedItemID}
				setForcedCurrentSelectedItemID={setForcedCurrentSelectedItemID}
				onDrop={handleDrop}
				minWidth={minWidth}
				cannotAdd
			/>
			<DialogMapProperties
				isOpen={isOpenMapProperties}
				setIsOpen={setIsOpenMapProperties}
				model={editedMap}
				onAccept={isNew ? handleAcceptNewMap : handleAcceptEditMap}
			/>
			<DialogName
				isOpen={isOpenName}
				setIsOpen={setIsOpenName}
				model={editedFolder}
				onAccept={isNew ? handleAcceptNewFolder : handleAcceptEditFolder}
			/>
			<Dialog
				title={t('warning')}
				isOpen={isOpenDialogConfirm}
				footer={
					<FooterNoYes
						onNo={handleRejectDelete}
						onYes={isDeletingMap ? handleAcceptDeleteMap : handleAcceptDeleteFolder}
					/>
				}
				onClose={handleRejectDelete}
			>
				<p className='warning textCenter'>
					{isDeletingMap ? t('are.you.sure.delete.this.map') : t('are.you.sure.delete.this.directory')}
					{!isDeletingMap && `${t('this.will.delete.all.maps.inside.folder')}.`}
				</p>
			</Dialog>
		</>
	);
}

export default TreeMaps;
