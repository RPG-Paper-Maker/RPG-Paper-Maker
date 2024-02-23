/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState } from 'react';
import '../styles/Tree.css';
import Tree from './Tree';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Node, Project } from '../core';
import { CONTEXT_MENU_ITEM_KIND, RPM } from '../common';
import { Model } from '../Editor';
import DialogMapProperties from './dialogs/DialogMapProperties';

type Props = {
	onSelectedItem?: (node: Node | null, isClick: boolean) => void;
	forcedCurrentSelectedItemID?: number | null;
	setForcedCurrentSelectedItemID?: (forced: number | null) => void;
};

function TreeMaps({ onSelectedItem, forcedCurrentSelectedItemID, setForcedCurrentSelectedItemID }: Props) {
	const [editedMap, setEditedMap] = useState<Model.Map>(new Model.Map());
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);
	const [needOpenMapProperties, setNeedOpenMapProperties] = useState(false);

	const isOpenLoading = useSelector((state: RootState) => state.projects.openLoading);

	if (!Project.current || isOpenLoading) {
		return null;
	}

	const handleSelectedItem = (node: Node | null, isClick: boolean) => {
		onSelectedItem?.(node, isClick);
		setSelectedNode(node);
	};

	const handleNewMap = async () => {
		const id = Node.getNewID(RPM.treeCurrentItems);
		const name = Model.Map.generateMapName(id);
		setEditedMap(Model.Map.create(id, name));
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

	const handleNewFolder = async () => {};

	const getContextMenuItems = () =>
		selectedNode && selectedNode.content.id !== -1
			? (selectedNode.content as Model.TreeMapTag).isFolder()
				? [
						CONTEXT_MENU_ITEM_KIND.EDIT,
						{
							title: 'New map...',
							onClick: handleNewMap,
						},
						{
							title: 'New folder...',
							onClick: handleNewFolder,
						},
						CONTEXT_MENU_ITEM_KIND.COPY,
						CONTEXT_MENU_ITEM_KIND.PASTE,
						CONTEXT_MENU_ITEM_KIND.DELETE,
				  ]
				: [
						CONTEXT_MENU_ITEM_KIND.EDIT,
						CONTEXT_MENU_ITEM_KIND.COPY,
						CONTEXT_MENU_ITEM_KIND.PASTE,
						CONTEXT_MENU_ITEM_KIND.DELETE,
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
				onAccept={handleAcceptNewMap}
			/>
		</>
	);
}

export default TreeMaps;
