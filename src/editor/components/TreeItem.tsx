/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { Model } from '../Editor';
import { HiChevronDown, HiChevronRight } from 'react-icons/hi';
import '../styles/TreeItem.css';
import { Node, Project } from '../core';
import { Utils } from '../common';

type Props = {
	node: Node;
	index?: number;
	level?: number;
	selected?: boolean;
	onSwitchExpanded: (id: number, expanded: boolean) => void;
	onMouseDown: (node: Node) => void;
	onDragStart?: (event: React.DragEvent, node: Node) => void;
	onDragOver?: (event: React.DragEvent, node: Node) => void;
	onDragLeave?: (event: React.DragEvent) => void;
	onDrop?: (event: React.DragEvent, node: Node) => void;
	draggable?: boolean;
	headers?: string[];
	doNotShowID?: boolean;
};

function TreeItem({
	node,
	level = 0,
	selected = false,
	onSwitchExpanded,
	onMouseDown,
	onDragStart,
	onDragOver,
	onDragLeave,
	onDrop,
	draggable = false,
	headers,
	doNotShowID = false,
}: Props) {
	const [expanded, setExpanded] = useState(node.expanded);

	const isTreeMapTag = () => node.content instanceof Model.TreeMapTag;

	const isFolder = () => (node.content as Model.TreeMapTag).isFolder();

	const handleMouseDown = () => {
		onMouseDown(node);
	};

	const handleMouseDownSwitchExpand = () => {
		onSwitchExpanded(node.content.id, !expanded);
		setExpanded((value) => !value);
		handleMouseDown();
	};

	useEffect(() => {
		if (node.expanded !== expanded) {
			node.expanded = expanded;
			Project.current!.treeMaps.save().catch(console.error);
		}
	}, [node, expanded]);

	const getString = () => {
		if (headers && headers.length > 0) {
			return node.toStrings().map((value, index) => (
				<div className='flex-one gap-small text-ellipsis' key={headers[index]}>
					{value}
				</div>
			));
		} else {
			return (
				<div className='flex-one gap-small text-ellipsis'>
					{doNotShowID ? node.content.getName() : node.toString()}
				</div>
			);
		}
	};

	return (
		<div
			className={Utils.getClassName({ selected }, 'tree-item')}
			style={{ paddingLeft: `${5 + level * 15}px` }}
			onMouseDown={handleMouseDown}
			onDragStart={(event: React.DragEvent) => onDragStart?.(event, node)}
			onDragOver={(event: React.DragEvent) => onDragOver?.(event, node)}
			onDragLeave={onDragLeave}
			onDrop={(event: React.DragEvent) => onDrop?.(event, node)}
			draggable={draggable}
		>
			{isTreeMapTag() && isFolder() && (
				<div onMouseDown={handleMouseDownSwitchExpand}>{expanded ? <HiChevronDown /> : <HiChevronRight />}</div>
			)}
			{node.getIcon()}
			{getString()}
		</div>
	);
}

export default TreeItem;
