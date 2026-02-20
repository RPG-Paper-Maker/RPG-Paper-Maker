/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { Node } from '../core/Node';
import { Project } from '../core/Project';
import { Model } from '../Editor';
import Button from './Button';
import DialogVariables from './dialogs/DialogVariables';
import { INPUT_WIDTH } from './DynamicValueSelector';
import Flex from './Flex';
import Tree from './Tree';

type Props = {
	variableID: number;
	onChange: (id: number) => void;
	forcedVariableID?: number | null;
	setForcedVariableID?: (v: number | null) => void;
	fillWidth?: boolean;
	disabled?: boolean;
};

function VariableSelector({
	variableID,
	onChange,
	forcedVariableID,
	setForcedVariableID,
	fillWidth = false,
	disabled = false,
}: Props) {
	const getNodeContent = (id: number) =>
		Model.Base.create(id, Project.current!.variables.getVariableByID(id)?.name || '');

	const [needDialogOpen, setNeedDialogOpen] = useState(false);
	const [node] = useState(Node.create(getNodeContent(variableID)));

	const handleOpenVariables = () => {
		if (!disabled) {
			setNeedDialogOpen(true);
		}
	};

	const handleAccept = () => {
		onChange(node.content.id);
	};

	useLayoutEffect(() => {
		if (forcedVariableID !== null && forcedVariableID !== undefined && setForcedVariableID) {
			onChange(forcedVariableID);
			node.content = getNodeContent(forcedVariableID);
			setForcedVariableID(null);
		}
	}, [forcedVariableID, setForcedVariableID]);

	return (
		<>
			<Flex
				one
				spaced
				onDoubleClick={handleOpenVariables}
				style={{ minWidth: INPUT_WIDTH, maxWidth: fillWidth ? undefined : INPUT_WIDTH }}
			>
				<Tree
					list={[node]}
					disabled={disabled}
					forcedCurrentSelectedItemID={forcedVariableID}
					setForcedCurrentSelectedItemID={setForcedVariableID}
					cannotAdd
					cannotEdit
					cannotDragDrop
				/>
				<Button onClick={handleOpenVariables} disabled={disabled}>
					...
				</Button>
			</Flex>
			{needDialogOpen && (
				<DialogVariables setIsOpen={setNeedDialogOpen} model={node.content} onAccept={handleAccept} />
			)}
		</>
	);
}

export default VariableSelector;
