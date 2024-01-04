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
	onClick: (node: Node) => void;
};

function TreeItem({ node, level = 0, selected = false, onSwitchExpanded, onClick }: Props) {
	const [expanded, setExpanded] = useState(true);

	const isTreeMapTag = () => node.content instanceof Model.TreeMapTag;

	const isFolder = () => (node.content as Model.TreeMapTag).isFolder();

	const handleClick = () => {
		onClick(node);
	};

	const handleClickSwitchExpand = () => {
		onSwitchExpanded(node.content.id, !expanded);
		setExpanded((value) => !value);
		handleClick();
	};

	return (
		<div
			className={Utils.getClassName([[selected, 'selected']], ['tree-item'])}
			style={{ paddingLeft: `${level * 15}px` }}
			onClick={handleClick}
		>
			{isTreeMapTag() && isFolder() && (
				<div onClick={handleClickSwitchExpand}>{expanded ? <HiChevronDown /> : <HiChevronRight />}</div>
			)}
			{node.getIcon()}
			{node.toString()}
		</div>
	);
}

export default TreeItem;
