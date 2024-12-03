/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, EVENT_COMMAND_KIND, Utils } from '../../../common';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import PanelWaitTime, { PanelWaitTimeRef } from '../../panels/PanelWaitTime';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

function DialogCommandShakeScreen({ isOpen, setIsOpen, list, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const panelWaitTimeRef = useRef<PanelWaitTimeRef>();

	const [offset] = useStateDynamicValue();
	const [shakesNumber] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			offset.updateCommand(list, iterator);
			shakesNumber.updateCommand(list, iterator);
			panelWaitTimeRef.current?.initialize(list, iterator);
		} else {
			offset.updateToDefaultNumber(30);
			shakesNumber.updateToDefaultNumber(2, true);
			panelWaitTimeRef.current?.initialize();
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		offset.getCommand(newList);
		shakesNumber.getCommand(newList);
		panelWaitTimeRef.current?.getCommand(newList);
		onAccept(Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.SHAKE_SCREEN, newList));
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
			title={`${t('shake.screen')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Form>
					<Label>{t('offset')}</Label>
					<Value>
						<Flex spaced>
							<DynamicValueSelector value={offset} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
							{t('pixel.s').toLowerCase()}
						</Flex>
					</Value>
					<Label>{t('shakes.number')}</Label>
					<Value>
						<Flex spaced>
							<DynamicValueSelector
								value={shakesNumber}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							/>
							{t('per.second').toLowerCase()}
						</Flex>
					</Value>
				</Form>
				<PanelWaitTime ref={panelWaitTimeRef} defaultSeconds={2} />
			</Flex>
		</Dialog>
	);
}

export default DialogCommandShakeScreen;
