/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { Node, Project } from '../core';
import { Model } from '../Editor';
import '../styles/Input.css';
import Button from './Button';
import DialogVariables from './dialogs/DialogVariables';
import Flex from './Flex';
import Tree from './Tree';

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
			<Flex one spaced onDoubleClick={handleOpenVariables}>
				<Tree list={[node]} cannotAdd cannotEdit cannotDragDrop />
				<Button onClick={handleOpenVariables}>...</Button>
			</Flex>
			<DialogVariables
				isOpen={needDialogOpen}
				setIsOpen={setNeedDialogOpen}
				model={node.content}
				onAccept={handleAccept}
			/>
		</>
	);
}

export default VariableSelector;
