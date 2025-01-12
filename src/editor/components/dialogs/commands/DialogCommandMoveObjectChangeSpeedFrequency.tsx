/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { COMMAND_MOVE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	isNew: boolean;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogCommandMoveObjectChangeSpeedFrequency({ isOpen, setIsOpen, model, isNew, onAccept, onReject }: Props) {
	const command = model as Model.MapObjectCommandMove;

	const { t } = useTranslation();

	const [value] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const isSpeed = command.getKind() === COMMAND_MOVE_KIND.CHANGE_SPEED;

	const initialize = () => {
		if (isNew) {
			value.updateToDefaultDatabase();
		} else {
			const iterator = Utils.generateIterator();
			iterator.i += 2;
			value.updateCommand(command.command, iterator);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		const list: MapObjectCommandType[] = [command.getKind()];
		if (!isNew) {
			list.push(command.command[1]);
		}
		value.getCommand(list);
		command.command = list;
		setIsOpen(false);
		onAccept();
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t(isSpeed ? 'change.speed' : 'change.frequency')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex spaced centerV>
				<div>{t(isSpeed ? 'speed' : 'frequency')}:</div>
				<DynamicValueSelector
					value={value}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
					databaseOptions={isSpeed ? Project.current!.systems.speeds : Project.current!.systems.frequencies}
				/>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandMoveObjectChangeSpeedFrequency;
