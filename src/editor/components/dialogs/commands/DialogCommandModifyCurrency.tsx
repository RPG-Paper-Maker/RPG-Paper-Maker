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
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import PanelOperation, { SELECTION_OPERATION_TYPE } from '../../panels/PanelOperation';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandModifyCurrency({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [currencyID] = useStateDynamicValue();
	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [value] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			currencyID.updateCommand(list, iterator);
			setSelectionOperationType(list[iterator.i++] as SELECTION_OPERATION_TYPE);
			value.updateCommand(list, iterator);
		} else {
			currencyID.updateToDefaultDatabase();
			setSelectionOperationType(SELECTION_OPERATION_TYPE.PLUS);
			value.updateToDefaultNumber(1);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		currencyID.getCommand(newList);
		newList.push(selectionOperationType);
		value.getCommand(newList);
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
			title={`${t('modify.currency')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Groupbox title={t('selection')}>
					<Flex spaced centerV>
						<div>{t('currency.id')}:</div>
						<DynamicValueSelector
							value={currencyID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.systems.currencies}
						/>
					</Flex>
				</Groupbox>
				<PanelOperation selectionType={selectionOperationType} setSelectionType={setSelectionOperationType} />
				<Groupbox title={t('number')}>
					<DynamicValueSelector value={value} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandModifyCurrency;
