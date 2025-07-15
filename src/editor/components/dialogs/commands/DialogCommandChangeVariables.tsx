/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, ITEM_KIND, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model, Scene } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType, TroopMonster } from '../../../models';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import InputNumber from '../../InputNumber';
import PanelOperation, { SELECTION_OPERATION_TYPE } from '../../panels/PanelOperation';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import VariableSelector from '../../VariableSelector';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

enum SELECTION_TYPE {
	ONE_VARIABLE,
	RANGE,
}

enum SELECTION_VALUE_TYPE {
	NUMBER = 0,
	RANDOM = 1,
	TEXT = 2,
	SWITCH = 3,
	NUMBER_ITEM = 5,
	TOTAL_CURRENCY = 6,
	HERO_INSTANCE_STATISTIC = 7,
	OBJECT_CHARACTERISTIC = 4,
	ENEMY_INSTANCE_ID = 8,
	OTHER_CHARACTERISTICS = 9,
}

function DialogCommandChangeVariables({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [selectionType, setSelectionType] = useStateNumber();
	const [variableID, setVariableID] = useState(1);
	const [forcedVariableID, setForcedVariableID] = useState<number | null>(null);
	const [range1, setRange1] = useStateNumber();
	const [range2, setRange2] = useStateNumber();
	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [selectionValueType, setSelectionValueType] = useStateNumber();
	const [valueNumber] = useStateDynamicValue();
	const [valueRandom1] = useStateDynamicValue();
	const [valueRandom2] = useStateDynamicValue();
	const [valueText] = useStateDynamicValue();
	const [valueSwitch] = useStateDynamicValue();
	const [valueNumberItemIndex, setValueNumberItemIndex] = useStateNumber();
	const [valueNumberItemID] = useStateDynamicValue();
	const [valueTotalCurrencyIndex, setValueTotalCurrencyIndex] = useStateNumber();
	const [valueTotalCurrency] = useStateDynamicValue();
	const [valueHeroEnemyInstanceID] = useStateDynamicValue();
	const [valueStatisticID] = useStateDynamicValue();
	const [valueObjectID] = useStateDynamicValue();
	const [valueObjectCharacteristicIndex, setValueObjectCharacteristicIndex] = useStateNumber();
	const [valueEnemyID, setValueEnemyID] = useStateNumber();
	const [valueOtherCharacteristicsIndex, setValueOtherCharacteristicsIndex] = useStateNumber();
	const [, setTrigger] = useStateBool();

	const isOneVariable = selectionType === SELECTION_TYPE.ONE_VARIABLE;
	const isRange = selectionType === SELECTION_TYPE.RANGE;
	const isNumber = selectionValueType === SELECTION_VALUE_TYPE.NUMBER;
	const isRandom = selectionValueType === SELECTION_VALUE_TYPE.RANDOM;
	const isText = selectionValueType === SELECTION_VALUE_TYPE.TEXT;
	const isSwitch = selectionValueType === SELECTION_VALUE_TYPE.SWITCH;
	const isNumberItem = selectionValueType === SELECTION_VALUE_TYPE.NUMBER_ITEM;
	const isTotalCurrency = selectionValueType === SELECTION_VALUE_TYPE.TOTAL_CURRENCY;
	const isHeroInstanceStatistic = selectionValueType === SELECTION_VALUE_TYPE.HERO_INSTANCE_STATISTIC;
	const isObjectCharacteristic = selectionValueType === SELECTION_VALUE_TYPE.OBJECT_CHARACTERISTIC;
	const isEnemyInstanceID = selectionValueType === SELECTION_VALUE_TYPE.ENEMY_INSTANCE_ID;
	const isOtherCharacteristics = selectionValueType === SELECTION_VALUE_TYPE.OTHER_CHARACTERISTICS;
	const objectsList = Scene.Map.getCurrentMapObjectsList();

	const initialize = () => {
		setForcedVariableID(1);
		setRange1(1);
		setRange2(1);
		valueNumber.updateToDefaultNumber(0, true);
		valueRandom1.updateToDefaultNumber();
		valueRandom2.updateToDefaultNumber();
		valueText.updateToDefaultText();
		valueSwitch.updateToDefaultSwitch();
		setValueNumberItemIndex(ITEM_KIND.ITEM);
		valueNumberItemID.updateToDefaultDatabase();
		setValueTotalCurrencyIndex(0);
		valueTotalCurrency.updateToDefaultDatabase();
		valueHeroEnemyInstanceID.updateToDefaultVariable();
		valueStatisticID.updateToDefaultDatabase();
		valueObjectID.updateToDefaultDatabase(-1);
		setValueObjectCharacteristicIndex(0);
		setValueEnemyID(TroopMonster.currentMonsters[0]?.id ?? -1);
		setValueOtherCharacteristicsIndex(0);
		if (list) {
			const iterator = Utils.generateIterator();
			const selection = list[iterator.i++] as SELECTION_TYPE;
			setSelectionType(selection);
			switch (selection) {
				case SELECTION_TYPE.ONE_VARIABLE:
					setForcedVariableID(list[iterator.i++] as number);
					break;
				case SELECTION_TYPE.RANGE:
					setRange1(list[iterator.i++] as number);
					setRange2(list[iterator.i++] as number);
					break;
			}
			setSelectionOperationType(list[iterator.i++] as SELECTION_OPERATION_TYPE);
			const selectionValue = list[iterator.i++] as SELECTION_VALUE_TYPE;
			setSelectionValueType(selectionValue);
			switch (selectionValue) {
				case SELECTION_VALUE_TYPE.NUMBER:
					valueNumber.updateCommand(list, iterator);
					break;
				case SELECTION_VALUE_TYPE.RANDOM:
					valueRandom1.updateCommand(list, iterator);
					valueRandom2.updateCommand(list, iterator);
					break;
				case SELECTION_VALUE_TYPE.TEXT:
					valueText.updateCommand(list, iterator);
					break;
				case SELECTION_VALUE_TYPE.SWITCH:
					valueSwitch.updateCommand(list, iterator);
					break;
				case SELECTION_VALUE_TYPE.NUMBER_ITEM:
					setValueNumberItemIndex(list[iterator.i++] as number);
					valueNumberItemID.updateCommand(list, iterator);
					break;
				case SELECTION_VALUE_TYPE.TOTAL_CURRENCY:
					setValueTotalCurrencyIndex(list[iterator.i++] as number);
					valueTotalCurrency.updateCommand(list, iterator);
					break;
				case SELECTION_VALUE_TYPE.HERO_INSTANCE_STATISTIC:
					valueHeroEnemyInstanceID.updateCommand(list, iterator);
					valueStatisticID.updateCommand(list, iterator);
					break;
				case SELECTION_VALUE_TYPE.OBJECT_CHARACTERISTIC:
					valueObjectID.updateCommand(list, iterator);
					setValueObjectCharacteristicIndex(list[iterator.i++] as number);
					break;
				case SELECTION_VALUE_TYPE.ENEMY_INSTANCE_ID:
					setValueEnemyID(TroopMonster.currentMonsters[list[iterator.i++] as number]?.id ?? -1);
					break;
				case SELECTION_VALUE_TYPE.OTHER_CHARACTERISTICS:
					setValueOtherCharacteristicsIndex(list[iterator.i++] as number);
					break;
			}
		} else {
			setSelectionType(SELECTION_TYPE.ONE_VARIABLE);
			setSelectionOperationType(SELECTION_OPERATION_TYPE.EQUALS);
			setSelectionValueType(SELECTION_VALUE_TYPE.NUMBER);
		}
		setTrigger((v) => !v);
	};

	const getDatabaseItem = () => {
		switch (valueNumberItemIndex) {
			case ITEM_KIND.ITEM:
				return Project.current!.items.list;
			case ITEM_KIND.WEAPON:
				return Project.current!.weapons.list;
			case ITEM_KIND.ARMOR:
				return Project.current!.armors.list;
		}
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(selectionType);
		switch (selectionType) {
			case SELECTION_TYPE.ONE_VARIABLE:
				newList.push(variableID);
				break;
			case SELECTION_TYPE.RANGE:
				newList.push(range1);
				newList.push(range2);
				break;
		}
		newList.push(selectionOperationType);
		newList.push(selectionValueType);
		switch (selectionValueType) {
			case SELECTION_VALUE_TYPE.NUMBER:
				valueNumber.getCommand(newList);
				break;
			case SELECTION_VALUE_TYPE.RANDOM:
				valueRandom1.getCommand(newList);
				valueRandom2.getCommand(newList);
				break;
			case SELECTION_VALUE_TYPE.TEXT:
				valueText.getCommand(newList);
				break;
			case SELECTION_VALUE_TYPE.SWITCH:
				valueSwitch.getCommand(newList);
				break;
			case SELECTION_VALUE_TYPE.NUMBER_ITEM:
				newList.push(valueNumberItemIndex);
				valueNumberItemID.getCommand(newList);
				break;
			case SELECTION_VALUE_TYPE.TOTAL_CURRENCY:
				newList.push(valueTotalCurrencyIndex);
				valueTotalCurrency.getCommand(newList);
				break;
			case SELECTION_VALUE_TYPE.HERO_INSTANCE_STATISTIC:
				valueHeroEnemyInstanceID.getCommand(newList);
				valueStatisticID.getCommand(newList);
				break;
			case SELECTION_VALUE_TYPE.OBJECT_CHARACTERISTIC:
				valueObjectID.getCommand(newList);
				newList.push(valueObjectCharacteristicIndex);
				break;
			case SELECTION_VALUE_TYPE.ENEMY_INSTANCE_ID:
				newList.push(TroopMonster.currentMonsters.findIndex((monster) => monster.id === valueEnemyID));
				break;
			case SELECTION_VALUE_TYPE.OTHER_CHARACTERISTICS:
				newList.push(valueOtherCharacteristicsIndex);
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
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('change.variables')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge>
				<Groupbox title={t('selection')}>
					<RadioGroup selected={selectionType} onChange={setSelectionType}>
						<Form>
							<Label>
								<RadioButton value={SELECTION_TYPE.ONE_VARIABLE}>{t('one.variable')}</RadioButton>
							</Label>
							<Value>
								<VariableSelector
									variableID={variableID}
									onChange={setVariableID}
									forcedVariableID={forcedVariableID}
									setForcedVariableID={setForcedVariableID}
									disabled={!isOneVariable}
								/>
							</Value>
							<Label>
								<RadioButton value={SELECTION_TYPE.RANGE}>{t('range')}</RadioButton>
							</Label>
							<Value>
								<Flex spaced centerV>
									<InputNumber value={range1} onChange={setRange1} min={1} disabled={!isRange} />
									<Flex disabledLabel={!isRange}>{t('to').toLowerCase()}</Flex>
									<InputNumber value={range2} onChange={setRange2} min={1} disabled={!isRange} />
								</Flex>
							</Value>
						</Form>
					</RadioGroup>
				</Groupbox>
				<PanelOperation selectionType={selectionOperationType} setSelectionType={setSelectionOperationType} />
				<Groupbox title={t('value')}>
					<RadioGroup selected={selectionValueType} onChange={setSelectionValueType}>
						<Form>
							<Label>
								<RadioButton value={SELECTION_VALUE_TYPE.NUMBER}>{t('number')}</RadioButton>
							</Label>
							<Value>
								<DynamicValueSelector
									value={valueNumber}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
									disabled={!isNumber}
								/>
							</Value>
							<Label>
								<RadioButton value={SELECTION_VALUE_TYPE.RANDOM}>{t('random')}</RadioButton>
							</Label>
							<Value>
								<Flex spaced centerV>
									<DynamicValueSelector
										value={valueRandom1}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
										disabled={!isRandom}
									/>
									<Flex disabledLabel={!isRandom}>{t('to').toLowerCase()}</Flex>
									<DynamicValueSelector
										value={valueRandom2}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
										disabled={!isRandom}
									/>
								</Flex>
							</Value>
							<Label>
								<RadioButton value={SELECTION_VALUE_TYPE.TEXT}>{t('text')}</RadioButton>
							</Label>
							<Value>
								<DynamicValueSelector
									value={valueText}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.TEXT}
									disabled={!isText}
								/>
							</Value>
							<Label>
								<RadioButton value={SELECTION_VALUE_TYPE.SWITCH}>{t('switch')}</RadioButton>
							</Label>
							<Value>
								<DynamicValueSelector
									value={valueSwitch}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.SWITCH}
									disabled={!isSwitch}
								/>
							</Value>
							<Label>
								<RadioButton value={SELECTION_VALUE_TYPE.NUMBER_ITEM}>{t('number.of')}</RadioButton>
							</Label>
							<Value>
								<Flex spaced centerV>
									<Dropdown
										selectedID={valueNumberItemIndex}
										onChange={setValueNumberItemIndex}
										options={Model.Base.ITEM_OPTIONS}
										disabled={!isNumberItem}
										translateOptions
									/>
									<DynamicValueSelector
										value={valueNumberItemID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={getDatabaseItem()}
										disabled={!isNumberItem}
									/>
									<Flex disabledLabel={!isNumberItem}>{t('in.inventory').toLowerCase()}</Flex>
								</Flex>
							</Value>
							<Label>
								<RadioButton value={SELECTION_VALUE_TYPE.TOTAL_CURRENCY}>
									{t('total.currency')}
								</RadioButton>
							</Label>
							<Value>
								<Flex spaced centerV>
									<DynamicValueSelector
										value={valueTotalCurrency}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.systems.currencies}
										disabled={!isTotalCurrency}
									/>
									<Dropdown
										selectedID={valueTotalCurrencyIndex}
										onChange={setValueTotalCurrencyIndex}
										options={Model.Base.CURRENCY_OPTIONS}
										disabled={!isTotalCurrency}
										translateOptions
									/>
								</Flex>
							</Value>
							<Label>
								<RadioButton value={SELECTION_VALUE_TYPE.HERO_INSTANCE_STATISTIC}>
									{t('hero.enemy.instance.id')}
								</RadioButton>
							</Label>
							<Value>
								<DynamicValueSelector
									value={valueHeroEnemyInstanceID}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									disabled={!isHeroInstanceStatistic}
								/>
							</Value>
							<Label hideColon />
							<Value>
								<Flex spaced centerV>
									<Flex disabledLabel={!isHeroInstanceStatistic}>{t('statistic.id')}:</Flex>
									<DynamicValueSelector
										value={valueStatisticID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.battleSystem.statistics}
										disabled={!isHeroInstanceStatistic}
									/>
								</Flex>
							</Value>
							<Label>
								<RadioButton value={SELECTION_VALUE_TYPE.OBJECT_CHARACTERISTIC}>
									{t('object.id')}
								</RadioButton>
							</Label>
							<Value>
								<Flex spaced centerV>
									<DynamicValueSelector
										value={valueObjectID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={objectsList}
										disabled={!isObjectCharacteristic}
									/>
									<Dropdown
										selectedID={valueObjectCharacteristicIndex}
										onChange={setValueObjectCharacteristicIndex}
										options={Model.Base.VARIABLE_OBJECT_CHARACTERISTIC_OPTIONS}
										disabled={!isObjectCharacteristic}
										translateOptions
									/>
								</Flex>
							</Value>
							<Label>
								<RadioButton value={SELECTION_VALUE_TYPE.ENEMY_INSTANCE_ID}>{t('enemy')}</RadioButton>
							</Label>
							<Value>
								<Flex spaced centerV>
									<Dropdown
										selectedID={valueEnemyID}
										onChange={setValueEnemyID}
										options={TroopMonster.currentMonsters}
										disabled={!isEnemyInstanceID}
										displayIDs
									/>
									<Flex disabledLabel={!isEnemyInstanceID}>{t('instance.id').toLowerCase()}</Flex>
								</Flex>
							</Value>
							<Label>
								<RadioButton value={SELECTION_VALUE_TYPE.OTHER_CHARACTERISTICS}>
									{t('other.characteristics')}
								</RadioButton>
							</Label>
							<Value>
								<Flex spaced centerV>
									<Dropdown
										selectedID={valueOtherCharacteristicsIndex}
										onChange={setValueOtherCharacteristicsIndex}
										options={Model.Base.VARIABLE_OTHER_CHARACTERISTICS_OPTIONS}
										disabled={!isOtherCharacteristics}
										translateOptions
									/>
								</Flex>
							</Value>
						</Form>
					</RadioGroup>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeVariables;
