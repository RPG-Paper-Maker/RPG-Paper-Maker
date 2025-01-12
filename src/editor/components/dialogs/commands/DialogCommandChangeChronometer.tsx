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
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

enum SELECTION_OPERATION_TYPE {
	START,
	PAUSE,
	CONTINUE,
	STOP,
}

function DialogCommandChangeChronometer({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [stockValueVariableID] = useStateDynamicValue();
	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [time] = useStateDynamicValue();
	const [isDisplayOnScreen, setIsDisplayOnScreen] = useStateBool();
	const [isStockCurrentValueVariableID, setIsStockCurrentValueVariableID] = useStateBool();
	const [stockCurrentValueVariableID] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		time.updateToDefaultNumber(1, true);
		stockCurrentValueVariableID.updateToDefaultVariable(1);
		if (list) {
			const iterator = Utils.generateIterator();
			stockValueVariableID.updateCommand(list, iterator);
			const kind = list[iterator.i++] as SELECTION_OPERATION_TYPE;
			setSelectionOperationType(kind);
			switch (kind) {
				case SELECTION_OPERATION_TYPE.START:
					time.updateCommand(list, iterator);
					setIsDisplayOnScreen(Utils.initializeBoolCommand(list, iterator));
					setIsStockCurrentValueVariableID(false);
					break;
				default: {
					setIsDisplayOnScreen(false);
					const checked = Utils.initializeBoolCommand(list, iterator);
					setIsStockCurrentValueVariableID(checked);
					if (checked) {
						stockCurrentValueVariableID.updateCommand(list, iterator);
					}
					break;
				}
			}
		} else {
			stockValueVariableID.updateToDefaultVariable(1);
			setSelectionOperationType(SELECTION_OPERATION_TYPE.START);
			setIsDisplayOnScreen(false);
			setIsStockCurrentValueVariableID(false);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		stockValueVariableID.getCommand(newList);
		newList.push(selectionOperationType);
		switch (selectionOperationType) {
			case SELECTION_OPERATION_TYPE.START:
				time.getCommand(newList);
				newList.push(Utils.boolToNum(isDisplayOnScreen));
				break;
			default:
				newList.push(Utils.boolToNum(isStockCurrentValueVariableID));
				if (isStockCurrentValueVariableID) {
					stockCurrentValueVariableID.getCommand(newList);
				}
				break;
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
			title={`${t('change.chronometer')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Flex spaced centerV>
					<div>
						{t(
							selectionOperationType === SELECTION_OPERATION_TYPE.START
								? 'stock.chronometer.id.in.variable.id'
								: 'chronometer.id'
						)}
						:
					</div>
					<DynamicValueSelector
						value={stockValueVariableID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
					/>
				</Flex>
				<Groupbox title={t('opertation')}>
					<RadioGroup selected={selectionOperationType} onChange={setSelectionOperationType}>
						<Flex spaced>
							<RadioButton value={SELECTION_OPERATION_TYPE.START}>{t('start')}</RadioButton>
							<RadioButton value={SELECTION_OPERATION_TYPE.PAUSE}>{t('pause')}</RadioButton>
							<RadioButton value={SELECTION_OPERATION_TYPE.CONTINUE}>{t('continue')}</RadioButton>
							<RadioButton value={SELECTION_OPERATION_TYPE.STOP}>{t('stop')}</RadioButton>
						</Flex>
					</RadioGroup>
				</Groupbox>
				{selectionOperationType === SELECTION_OPERATION_TYPE.START ? (
					<>
						<Flex spaced centerV>
							<div>{t('time')}:</div>
							<DynamicValueSelector
								value={time}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							/>
							{t('seconds')}
						</Flex>
						<Checkbox isChecked={isDisplayOnScreen} onChange={setIsDisplayOnScreen}>
							{t('display.on.screen')}
						</Checkbox>
					</>
				) : (
					<Flex spaced centerV>
						<Checkbox isChecked={isStockCurrentValueVariableID} onChange={setIsStockCurrentValueVariableID}>
							{t('stock.current.chronometer.value.in.variable.id')}:
						</Checkbox>
						<DynamicValueSelector
							value={stockCurrentValueVariableID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							disabled={!isStockCurrentValueVariableID}
						/>
					</Flex>
				)}
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeChronometer;
