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
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

function DialogCommandFlashScreen({ isOpen, setIsOpen, list, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [colorID] = useStateDynamicValue();
	const [isWaitingEndCommand, setIsWaitingEndCommand] = useStateBool();
	const [time] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		colorID.updateToDefaultDatabase();
		if (list) {
			const iterator = Utils.generateIterator();
			colorID.updateCommand(list, iterator);
			setIsWaitingEndCommand(Utils.initializeBoolCommand(list, iterator));
			time.updateCommand(list, iterator);
		} else {
			setIsWaitingEndCommand(true);
			time.updateToDefaultNumber(1, true);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		colorID.getCommand(newList);
		newList.push(Utils.boolToNum(isWaitingEndCommand));
		time.getCommand(newList);
		onAccept(Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.FLASH_SCREEN, newList));
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
			title={`${t('flash.screen')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Flex spaced>
					<div>{t('color.id')}:</div>
					<DynamicValueSelector
						value={colorID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.systems.colors}
					/>
				</Flex>
				<Checkbox isChecked={isWaitingEndCommand} onChange={setIsWaitingEndCommand}>
					{t('wait.end.change.before.next.command')}
				</Checkbox>
				<Flex>
					<Flex one />
					<Flex spaced centerV>
						<div>{t('time')}:</div>
						<DynamicValueSelector value={time} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />
						<div>{t('seconds')}</div>
					</Flex>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandFlashScreen;
