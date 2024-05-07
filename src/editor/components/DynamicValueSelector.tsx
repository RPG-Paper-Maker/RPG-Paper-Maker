/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useRef, useState } from 'react';
import '../styles/Input.css';
import { DynamicValue } from '../core/DynamicValue';
import Dropdown from './Dropdown';
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, INPUT_TYPE_WIDTH } from '../common';
import { Model } from '../Editor';
import InputNumber from './InputNumber';
import InputText from './InputText';

type Props = {
	value: DynamicValue;
	optionsType: DYNAMIC_VALUE_OPTIONS_TYPE;
};

function DynamicValueSelector({ value, optionsType }: Props) {
	const defaultNumber =
		value.kind === DYNAMIC_VALUE_KIND.NUMBER || value.kind === DYNAMIC_VALUE_KIND.NUMBER_DECIMAL
			? (value.value as number)
			: 0;
	const defaultMessage = value.kind === DYNAMIC_VALUE_KIND.MESSAGE ? (value.value as string) : '';
	const defaultSwitch = value.kind === DYNAMIC_VALUE_KIND.SWITCH ? (value.value as boolean) : true;

	const [kind, setKind] = useState(value.kind);
	const [valueNumber, setValueNumber] = useState(defaultNumber);
	const [valueMessage, setValueMessage] = useState(defaultMessage);
	const [valueSwitch, setValueSwitch] = useState(defaultSwitch);

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
				return valueNumber;
			case DYNAMIC_VALUE_KIND.VARIABLE:
				value.value = null;
				break;
			case DYNAMIC_VALUE_KIND.MESSAGE:
				value.value = valueMessage;
				break;
			case DYNAMIC_VALUE_KIND.SWITCH:
				value.value = valueSwitch;
				break;
			case DYNAMIC_VALUE_KIND.KEYBOARD:
				value.value = null;
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
				return null;
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
				return null;
			default:
				return null;
		}
	};

	return (
		<div className='flex gap-small' style={{ width: '250px' }}>
			<Dropdown selectedID={kind} onChange={handleChangeKind} options={getOptions()} translateOptions />
			<div className='flex-one'>{getValueDisplay()}</div>
		</div>
	);
}

export default DynamicValueSelector;
