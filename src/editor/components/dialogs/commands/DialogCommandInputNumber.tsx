/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, EVENT_COMMAND_KIND, Utils } from '../../../common';
import { DynamicValue } from '../../../core/DynamicValue';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Form, { Label, Value } from '../../Form';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

function DialogCommandInputNumber({ isOpen, setIsOpen, list, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [stockValueVariable] = useState<DynamicValue>(new DynamicValue());
	const [digits] = useState<DynamicValue>(new DynamicValue());
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			stockValueVariable.updateCommand(list, iterator);
			digits.updateCommand(list, iterator);
		} else {
			stockValueVariable.updateToDefaultVariable();
			digits.updateToDefaultNumber(3);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		stockValueVariable.getCommand(newList);
		digits.getCommand(newList);
		onAccept(Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.INPUT_NUMBER, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('input.number')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Form>
				<Label>{t('stock.value.in.variable.id')}</Label>
				<Value>
					<DynamicValueSelector value={stockValueVariable} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
				</Value>
				<Label>{t('digits')}</Label>
				<Value>
					<DynamicValueSelector value={digits} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
				</Value>
			</Form>
		</Dialog>
	);
}

export default DialogCommandInputNumber;
