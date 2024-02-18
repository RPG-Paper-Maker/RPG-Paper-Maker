/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { Model } from '../Editor';
import { HiChevronDown, HiChevronRight } from 'react-icons/hi';
import '../styles/TreeItem.css';
import { Node } from '../core';
import { Utils } from '../common';

type Props = {
	node: Node;
	index?: number;
	level?: number;
	selected?: boolean;
	onSwitchExpanded: (id: number, expanded: boolean) => void;
	onMouseDown: (node: Node) => void;
};

function TreeItem({ node, level = 0, selected = false, onSwitchExpanded, onMouseDown }: Props) {
	const [expanded, setExpanded] = useState(true);

	const isTreeMapTag = () => node.content instanceof Model.TreeMapTag;

	const isFolder = () => (node.content as Model.TreeMapTag).isFolder();

	const handleMouseDown = (e: any) => {
		onMouseDown(node);
	};

	const handleMouseDownSwitchExpand = (e: any) => {
		onSwitchExpanded(node.content.id, !expanded);
		setExpanded((value) => !value);
		handleMouseDown(e);
	};

	return (
		<div
			className={Utils.getClassName([[selected, 'selected']], ['tree-item'])}
			style={{ paddingLeft: `${level * 15}px` }}
			onMouseDown={handleMouseDown}
		>
			{isTreeMapTag() && isFolder() && (
				<div onMouseDown={handleMouseDownSwitchExpand}>{expanded ? <HiChevronDown /> : <HiChevronRight />}</div>
			)}
			{node.getIcon()}
			{node.toString()}
		</div>
	);
}

export default TreeItem;
