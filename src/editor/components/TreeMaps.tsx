/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import { Node } from '../core/Node';
import '../styles/Tree.css';
import Tree from './Tree';
import { Project } from '../core/Project';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

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

	return (
		<Tree
			list={Project.current.treeMaps.tree}
			defaultSelectedID={-1}
			onSelectedItem={onSelectedItem}
			forcedCurrentSelectedItemID={forcedCurrentSelectedItemID}
			setForcedCurrentSelectedItemID={setForcedCurrentSelectedItemID}
		/>
	);
}

export default TreeMaps;
