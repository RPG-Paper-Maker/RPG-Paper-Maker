/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState } from 'react';
import '../styles/Input.css';
import { Model } from '../Editor';
import Tree from './Tree';
import { Node, Project } from '../core';
import Button from './Button';
import DialogVariables from './dialogs/DialogVariables';

type Props = {
	variableID: number;
	onChange: (id: number) => void;
};

function VariableSelector({ variableID, onChange }: Props) {
	const [needDialogOpen, setNeedDialogOpen] = useState(false);
	const [node] = useState(
		Node.create(Model.Base.create(variableID, Project.current!.variables.getVariableByID(variableID)?.name || ''))
	);

	const handleOpenVariables = () => {
		setNeedDialogOpen(true);
	};

	const handleAccept = () => {
		onChange(node.content.id);
	};

	return (
		<>
			<div className='flex-one gap-small' onDoubleClick={handleOpenVariables}>
				<Tree list={[node]} cannotAdd cannotEdit cannotDragDrop />
				<Button onClick={handleOpenVariables}>...</Button>
			</div>
			<DialogVariables
				needOpen={needDialogOpen}
				setNeedOpen={setNeedDialogOpen}
				model={node.content}
				onAccept={handleAccept}
			/>
		</>
	);
}

export default VariableSelector;
