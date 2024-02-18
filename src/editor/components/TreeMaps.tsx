/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import '../styles/Tree.css';
import Tree from './Tree';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Node, Project } from '../core';
import { CONTEXT_MENU_ITEM_KIND } from '../common';
import { Model } from '../Editor';

type Props = {
	onSelectedItem?: (node: Node | null, isClick: boolean) => void;
	forcedCurrentSelectedItemID?: number | null;
	setForcedCurrentSelectedItemID?: (forced: number | null) => void;
};

function TreeMaps({ onSelectedItem, forcedCurrentSelectedItemID, setForcedCurrentSelectedItemID }: Props) {
	const isOpenLoading = useSelector((state: RootState) => state.projects.openLoading);

	if (!Project.current || isOpenLoading) {
		return null;
	}

	const handleNewMap = async (items: Node[], selectedItem: Node) => {};

	const handleNewFolder = async (items: Node[], selectedItem: Node) => {};

	return (
		<Tree
			list={Project.current.treeMaps.tree}
			constructorType={Model.TreeMapTag}
			contextMenuItems={[
				CONTEXT_MENU_ITEM_KIND.EDIT,
				{
					title: 'New map...',
					onClick: handleNewMap,
				},
				CONTEXT_MENU_ITEM_KIND.COPY,
				CONTEXT_MENU_ITEM_KIND.PASTE,
				CONTEXT_MENU_ITEM_KIND.DELETE,
			]}
			defaultSelectedID={-1}
			onSelectedItem={onSelectedItem}
			forcedCurrentSelectedItemID={forcedCurrentSelectedItemID}
			setForcedCurrentSelectedItemID={setForcedCurrentSelectedItemID}
		/>
	);
}

export default TreeMaps;
