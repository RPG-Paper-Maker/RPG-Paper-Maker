/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, INPUT_TYPE_WIDTH } from '../common';
import { Project } from '../core';
import { DynamicValue } from '../core/DynamicValue';
import { Model } from '../Editor';
import '../styles/DynamicValueSelector.css';
import '../styles/Input.css';
import Dropdown from './Dropdown';
import Flex from './Flex';
import InputNumber from './InputNumber';
import InputText from './InputText';
import VariableSelector from './VariableSelector';

type Props = {
	value: DynamicValue;
	optionsType: DYNAMIC_VALUE_OPTIONS_TYPE;
};

function DynamicValueSelector({ value, optionsType }: Props) {
	const [kind, setKind] = useState(value.kind);
	const [valueNumber, setValueNumber] = useState(
		value.kind === DYNAMIC_VALUE_KIND.NUMBER || value.kind === DYNAMIC_VALUE_KIND.NUMBER_DECIMAL
			? (value.value as number)
			: 0
	);
	const [valueMessage, setValueMessage] = useState(
		value.kind === DYNAMIC_VALUE_KIND.MESSAGE ? (value.value as string) : ''
	);
	const [valueSwitch, setValueSwitch] = useState(
		value.kind === DYNAMIC_VALUE_KIND.SWITCH ? (value.value as boolean) : true
	);
	const [valueVariableID, setValueVariableID] = useState(
		value.kind === DYNAMIC_VALUE_KIND.VARIABLE ? (value.value as number) : 1
	);
	const [valueKeyboardID, setValueKeyboardID] = useState(
		value.kind === DYNAMIC_VALUE_KIND.KEYBOARD ? (value.value as number) : Project.current!.keyboard.list[0].id
	);

	const getOptions = () => {
		let list: DYNAMIC_VALUE_KIND[] = [];
		switch (optionsType) {
			case DYNAMIC_VALUE_OPTIONS_TYPE.PARAMETER:
				list = [
					DYNAMIC_VALUE_KIND.DEFAULT,
					DYNAMIC_VALUE_KIND.ANYTHING,
					DYNAMIC_VALUE_KIND.NONE,
					DYNAMIC_VALUE_KIND.NUMBER_DECIMAL,
					DYNAMIC_VALUE_KIND.VARIABLE,
					DYNAMIC_VALUE_KIND.MESSAGE,
					DYNAMIC_VALUE_KIND.SWITCH,
					DYNAMIC_VALUE_KIND.KEYBOARD,
				];
				break;
			case DYNAMIC_VALUE_OPTIONS_TYPE.PROPERTY:
				list = [
					DYNAMIC_VALUE_KIND.NONE,
					DYNAMIC_VALUE_KIND.NUMBER_DECIMAL,
					DYNAMIC_VALUE_KIND.VARIABLE,
					DYNAMIC_VALUE_KIND.MESSAGE,
					DYNAMIC_VALUE_KIND.SWITCH,
					DYNAMIC_VALUE_KIND.KEYBOARD,
				];
				break;
			default:
				break;
		}
		return list.map((k) => Model.Base.DYNAMIC_VALUE_KIND_OPTIONS[k]);
	};

	const handleChangeKind = (id: number) => {
		setKind(id);
		value.kind = id;
		switch (id) {
			case DYNAMIC_VALUE_KIND.DEFAULT:
			case DYNAMIC_VALUE_KIND.ANYTHING:
			case DYNAMIC_VALUE_KIND.NONE:
				value.value = null;
				break;
			case DYNAMIC_VALUE_KIND.NUMBER:
			case DYNAMIC_VALUE_KIND.NUMBER_DECIMAL:
				value.value = valueNumber;
				break;
			case DYNAMIC_VALUE_KIND.VARIABLE:
				value.value = valueVariableID;
				break;
			case DYNAMIC_VALUE_KIND.MESSAGE:
				value.value = valueMessage;
				break;
			case DYNAMIC_VALUE_KIND.SWITCH:
				value.value = valueSwitch;
				break;
			case DYNAMIC_VALUE_KIND.KEYBOARD:
				value.value = valueKeyboardID;
				break;
		}
	};

	const handleChangeNumber = (num: number) => {
		setValueNumber(num);
		value.value = num;
	};

	const handleChangeMessage = (message: string) => {
		setValueMessage(message);
		value.value = message;
	};

	const handleChangeSwitch = (id: number) => {
		setValueSwitch(id === 0);
		value.value = id === 0;
	};

	const handleChangeVariable = (id: number) => {
		setValueVariableID(id);
		value.value = id;
	};

	const handleChangeKeyboard = (id: number) => {
		setValueKeyboardID(id);
		value.value = id;
	};

	const getValueDisplay = () => {
		switch (kind) {
			case DYNAMIC_VALUE_KIND.NUMBER:
			case DYNAMIC_VALUE_KIND.NUMBER_DECIMAL:
				return (
					<InputNumber
						value={valueNumber}
						onChange={handleChangeNumber}
						widthType={INPUT_TYPE_WIDTH.FILL}
						decimals={kind === DYNAMIC_VALUE_KIND.NUMBER_DECIMAL}
					/>
				);
			case DYNAMIC_VALUE_KIND.VARIABLE:
				return <VariableSelector variableID={valueVariableID} onChange={handleChangeVariable} />;
			case DYNAMIC_VALUE_KIND.MESSAGE:
				return (
					<InputText value={valueMessage} onChange={handleChangeMessage} widthType={INPUT_TYPE_WIDTH.FILL} />
				);
			case DYNAMIC_VALUE_KIND.SWITCH:
				return (
					<Dropdown
						selectedID={valueSwitch ? 0 : 1}
						onChange={handleChangeSwitch}
						options={Model.Base.ON_OFF_OPTIONS}
						fillWidth
					/>
				);
			case DYNAMIC_VALUE_KIND.KEYBOARD:
				return (
					<Dropdown
						selectedID={valueKeyboardID}
						onChange={handleChangeKeyboard}
						options={Project.current!.keyboard.list}
						displayIDs
						fillWidth
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className='dynamic-value-selector'>
			<Dropdown selectedID={kind} onChange={handleChangeKind} options={getOptions()} translateOptions />
			<Flex one>{getValueDisplay()}</Flex>
		</div>
	);
}

export default DynamicValueSelector;
