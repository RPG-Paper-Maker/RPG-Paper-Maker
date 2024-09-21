/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
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
	const [valueText, setValueText] = useState(value.kind === DYNAMIC_VALUE_KIND.TEXT ? (value.value as string) : '');
	const [valueSwitch, setValueSwitch] = useState(
		value.kind === DYNAMIC_VALUE_KIND.SWITCH ? (value.value as boolean) : true
	);
	const [valueVariableID, setValueVariableID] = useState(
		value.kind === DYNAMIC_VALUE_KIND.VARIABLE ? (value.value as number) : 1
	);
	const [valueKeyboardID, setValueKeyboardID] = useState(
		value.kind === DYNAMIC_VALUE_KIND.KEYBOARD ? (value.value as number) : Project.current!.keyboard.list[0]?.id
	);
	const [valueParameterID, setValueParameterID] = useState(
		value.kind === DYNAMIC_VALUE_KIND.PARAMETER
			? (value.value as number)
			: Project.current!.currentMapObjectParameters[0]?.id
	);
	const [valuePropertyID, setValuePropertyID] = useState(
		value.kind === DYNAMIC_VALUE_KIND.PROPERTY
			? (value.value as number)
			: Project.current!.currentMapObjectProperties[0]?.content?.id
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
					DYNAMIC_VALUE_KIND.TEXT,
					DYNAMIC_VALUE_KIND.SWITCH,
					DYNAMIC_VALUE_KIND.KEYBOARD,
				];
				break;
			case DYNAMIC_VALUE_OPTIONS_TYPE.PROPERTY:
				list = [
					DYNAMIC_VALUE_KIND.NONE,
					DYNAMIC_VALUE_KIND.NUMBER_DECIMAL,
					DYNAMIC_VALUE_KIND.VARIABLE,
					DYNAMIC_VALUE_KIND.TEXT,
					DYNAMIC_VALUE_KIND.SWITCH,
					DYNAMIC_VALUE_KIND.KEYBOARD,
				];
				break;
			case DYNAMIC_VALUE_OPTIONS_TYPE.TEXT:
				list = [DYNAMIC_VALUE_KIND.TEXT, DYNAMIC_VALUE_KIND.VARIABLE];
				if (Project.current!.currentMapObjectParameters.length > 0) {
					list.push(DYNAMIC_VALUE_KIND.PARAMETER);
				}
				if (Project.current!.currentMapObjectProperties.length > 0) {
					list.push(DYNAMIC_VALUE_KIND.PROPERTY);
				}
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
			case DYNAMIC_VALUE_KIND.TEXT:
				value.value = valueText;
				break;
			case DYNAMIC_VALUE_KIND.SWITCH:
				value.value = valueSwitch;
				break;
			case DYNAMIC_VALUE_KIND.KEYBOARD:
				value.value = valueKeyboardID;
				break;
			case DYNAMIC_VALUE_KIND.PARAMETER:
				value.value = valueParameterID;
				break;
			case DYNAMIC_VALUE_KIND.PROPERTY:
				value.value = valuePropertyID;
				break;
		}
	};

	const handleChangeNumber = (num: number) => {
		setValueNumber(num);
		value.value = num;
	};

	const handleChangeText = (text: string) => {
		setValueText(text);
		value.value = text;
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

	const handleChangeParameter = (id: number) => {
		setValueParameterID(id);
		value.value = id;
	};

	const handleChangeProperty = (id: number) => {
		setValuePropertyID(id);
		value.value = id;
	};

	useEffect(() => {
		setKind(value.kind);
	}, [value.kind]);

	useEffect(() => {
		switch (value.kind) {
			case DYNAMIC_VALUE_KIND.TEXT:
				setValueText(value.value as string);
				break;
		}
	}, [value.value]);

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
			case DYNAMIC_VALUE_KIND.TEXT:
				return <InputText value={valueText} onChange={handleChangeText} widthType={INPUT_TYPE_WIDTH.FILL} />;
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
			case DYNAMIC_VALUE_KIND.PARAMETER:
				return (
					<Dropdown
						selectedID={valueParameterID}
						onChange={handleChangeParameter}
						options={Project.current!.currentMapObjectParameters}
						displayIDs
						fillWidth
					/>
				);
			case DYNAMIC_VALUE_KIND.PROPERTY:
				return (
					<Dropdown
						selectedID={valuePropertyID}
						onChange={handleChangeProperty}
						options={Project.current!.currentMapObjectProperties.map((node) => node.content)}
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
