/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import PanelOperation, { SELECTION_OPERATION_TYPE } from '../../panels/PanelOperation';
import PanelSelectionHero, { PanelSelectionHeroRef } from '../../panels/PanelSelectionHero';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

enum SELECTION_VALUE_TYPE {
	NUMBER,
	FORMULA,
	MAXIMUM,
}

function DialogCommandChangeAStatistic({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const panelSelectionHeroRef = useRef<PanelSelectionHeroRef>(null);

	const [statisticID] = useStateDynamicValue();
	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [selectionValueType, setSelectionValueType] = useStateNumber();
	const [valueNumber] = useStateDynamicValue();
	const [valueFormula] = useStateDynamicValue();
	const [isCanGoAboveMaximumValue, setIsCanGoAboveMaximumValue] = useStateBool();
	const [isApplyChangeMaximumValue, setIsApplyChangeMaximumValue] = useStateBool();
	const [, setTrigger] = useStateBool();

	const isNumber = selectionValueType === SELECTION_VALUE_TYPE.NUMBER;
	const isFormula = selectionValueType === SELECTION_VALUE_TYPE.FORMULA;

	const initialize = () => {
		valueNumber.updateToDefaultNumber(0);
		valueFormula.updateToDefaultFormula('0');
		if (list) {
			const iterator = Utils.generateIterator();
			statisticID.updateCommand(list, iterator);
			panelSelectionHeroRef.current?.initialize(list, iterator);
			setSelectionOperationType(list[iterator.i++] as SELECTION_OPERATION_TYPE);
			const selection = list[iterator.i++] as SELECTION_VALUE_TYPE;
			setSelectionValueType(selection);
			switch (selection) {
				case SELECTION_VALUE_TYPE.NUMBER:
					valueNumber.updateCommand(list, iterator);
					break;
				case SELECTION_VALUE_TYPE.FORMULA:
					valueFormula.updateCommand(list, iterator);
					break;
			}
			setIsCanGoAboveMaximumValue(Utils.initializeBoolCommand(list, iterator));
			setIsApplyChangeMaximumValue(Utils.initializeBoolCommand(list, iterator));
		} else {
			statisticID.updateToDefaultDatabase();
			panelSelectionHeroRef.current?.initialize();
			setSelectionOperationType(SELECTION_OPERATION_TYPE.PLUS);
			setSelectionValueType(SELECTION_VALUE_TYPE.NUMBER);
			setIsCanGoAboveMaximumValue(false);
			setIsApplyChangeMaximumValue(false);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		statisticID.getCommand(newList);
		panelSelectionHeroRef.current?.getCommand(newList);
		newList.push(selectionOperationType);
		newList.push(selectionValueType);
		switch (selectionValueType) {
			case SELECTION_VALUE_TYPE.NUMBER:
				valueNumber.getCommand(newList);
				break;
			case SELECTION_VALUE_TYPE.FORMULA:
				valueFormula.getCommand(newList);
				break;
		}
		newList.push(Utils.boolToNum(isCanGoAboveMaximumValue));
		newList.push(Utils.boolToNum(isApplyChangeMaximumValue));
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
			title={`${t('change.a.statistic')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge>
				<Flex spaced centerV>
					<div>{t('statistic.id')}:</div>
					<DynamicValueSelector
						value={statisticID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.battleSystem.statistics}
					/>
				</Flex>
				<PanelSelectionHero ref={panelSelectionHeroRef} />
				<PanelOperation selectionType={selectionOperationType} setSelectionType={setSelectionOperationType} />
				<Groupbox title={t('value')}>
					<Flex column spacedLarge>
						<RadioGroup selected={selectionValueType} onChange={setSelectionValueType}>
							<Form>
								<Label>
									<RadioButton value={SELECTION_VALUE_TYPE.NUMBER}>{t('number')}</RadioButton>
								</Label>
								<Value>
									<DynamicValueSelector
										value={valueNumber}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
										disabled={!isNumber}
									/>
								</Value>
								<Label>
									<RadioButton value={SELECTION_VALUE_TYPE.FORMULA}>{t('formula')}</RadioButton>
								</Label>
								<Value>
									<DynamicValueSelector
										value={valueFormula}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
										disabled={!isFormula}
									/>
								</Value>
								<Label hideColon>
									<RadioButton value={SELECTION_VALUE_TYPE.MAXIMUM}>
										{t('maximum.statistic.value')}
									</RadioButton>
								</Label>
								<Value />
							</Form>
						</RadioGroup>
						<Checkbox isChecked={isCanGoAboveMaximumValue} onChange={setIsCanGoAboveMaximumValue}>
							{t('can.go.above.maximum.value')}
						</Checkbox>
						<Checkbox isChecked={isApplyChangeMaximumValue} onChange={setIsApplyChangeMaximumValue}>
							{t('apply.change.maximum.value')}
						</Checkbox>
					</Flex>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeAStatistic;
