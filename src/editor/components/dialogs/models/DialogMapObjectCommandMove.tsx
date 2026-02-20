/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { COMMAND_MOVE_KIND, EVENT_COMMAND_KIND } from '../../../common';
import { Model } from '../../../Editor';
import { MapObjectCommandMove } from '../../../models';
import DialogCommandMoveObjectChangeGraphics from '../commands/DialogCommandMoveObjectChangeGraphics';
import DialogCommandMoveObjectChangeSpeedFrequency from '../commands/DialogCommandMoveObjectChangeSpeedFrequency';
import DialogCommandMoveObjectJump from '../commands/DialogCommandMoveObjectJump';
import DialogCommandWait from '../commands/DialogCommandWait';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject: () => void;
};

function DialogMapObjectCommandMove({ setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const command = model as MapObjectCommandMove;

	const getDialogCommand = () => {
		const options = {
			setIsOpen,
			model,
			isNew,
			onAccept,
			onReject,
		};
		switch (command.command && command.getKind()) {
			case COMMAND_MOVE_KIND.JUMP:
				return <DialogCommandMoveObjectJump {...options} />;
			case COMMAND_MOVE_KIND.CHANGE_SPEED:
			case COMMAND_MOVE_KIND.CHANGE_FREQUENCY:
				return <DialogCommandMoveObjectChangeSpeedFrequency {...options} />;
			case COMMAND_MOVE_KIND.CHANGE_GRAPHICS:
				return <DialogCommandMoveObjectChangeGraphics {...options} />;
			case COMMAND_MOVE_KIND.WAIT: {
				const list = command.command.slice(1);
				const handleAcceptWait = (c: Model.MapObjectCommand) => {
					command.command = [COMMAND_MOVE_KIND.WAIT, ...(c.command as string[])];
					onAccept();
				};
				return (
					<DialogCommandWait
						commandKind={EVENT_COMMAND_KIND.WAIT}
						setIsOpen={setIsOpen}
						list={isNew ? undefined : list}
						onAccept={handleAcceptWait}
						onReject={onReject}
					/>
				);
			}
			default:
				return null;
		}
	};

	useEffect(() => {
		if (
			!command.command ||
			![
				COMMAND_MOVE_KIND.JUMP,
				COMMAND_MOVE_KIND.CHANGE_SPEED,
				COMMAND_MOVE_KIND.CHANGE_FREQUENCY,
				COMMAND_MOVE_KIND.CHANGE_GRAPHICS,
				COMMAND_MOVE_KIND.WAIT,
			].includes(command.getKind())
		) {
			onReject();
			setIsOpen(false);
		}
	}, []);

	return getDialogCommand();
}

export default DialogMapObjectCommandMove;
