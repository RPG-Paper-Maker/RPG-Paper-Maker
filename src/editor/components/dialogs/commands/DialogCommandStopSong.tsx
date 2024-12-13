/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, EVENT_COMMAND_KIND, Utils } from '../../../common';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandStopSong({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [soundID] = useStateDynamicValue();
	const [time] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			time.updateCommand(list, iterator);
			if (commandKind === EVENT_COMMAND_KIND.STOP_A_SOUND) {
				soundID.updateCommand(list, iterator);
			}
		} else {
			time.updateToDefaultNumber();
			if (commandKind === EVENT_COMMAND_KIND.STOP_A_SOUND) {
				soundID.updateToDefaultNumber();
			}
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		time.getCommand(newList);
		if (commandKind === EVENT_COMMAND_KIND.STOP_A_SOUND) {
			soundID.getCommand(newList);
		}
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={t(Model.MapObjectCommand.getCommandName(commandKind))}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				{commandKind === EVENT_COMMAND_KIND.STOP_A_SOUND && (
					<Flex spaced>
						<div>{t('sound.id')}:</div>
						<DynamicValueSelector value={soundID} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
					</Flex>
				)}
				<div>{t('disappear.with.time')}:</div>
				<Flex spaced>
					<DynamicValueSelector value={time} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
					{t('seconds')}
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandStopSong;
