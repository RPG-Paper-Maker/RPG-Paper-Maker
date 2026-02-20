/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

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
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandStopSong({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
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
		initialize();
	}, []);

	return (
		<Dialog
			title={t(Model.MapObjectCommand.getCommandName(commandKind))}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
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
