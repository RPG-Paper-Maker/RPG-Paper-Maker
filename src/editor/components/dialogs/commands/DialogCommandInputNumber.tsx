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
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Form, { Label, Value } from '../../Form';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandInputNumber({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [stockValueVariable] = useStateDynamicValue();
	const [digits] = useStateDynamicValue();
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
			title={`${t('input.number')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
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
