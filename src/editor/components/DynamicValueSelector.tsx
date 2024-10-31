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

export const INPUT_WIDTH = '200px';

type Props = {
	value: DynamicValue;
	optionsType: DYNAMIC_VALUE_OPTIONS_TYPE;
	databaseOptions?: Model.Base[];
	disabled?: boolean;
	onChangeKind?: (k: DYNAMIC_VALUE_KIND) => void;
	onChangeValue?: (v: unknown) => void;
	min?: number;
	max?: number;
};

function DynamicValueSelector({
	value,
	optionsType,
	databaseOptions = [],
	disabled = false,
	onChangeKind,
	onChangeValue,
	min,
	max,
}: Props) {
	const [kind, setKind] = useState(value.kind);
	const [valueNumber, setValueNumber] = useState(
		value.kind === DYNAMIC_VALUE_KIND.NUMBER || value.kind === DYNAMIC_VALUE_KIND.NUMBER_DECIMAL
			? (value.value as number)
			: 0
	);
	const [valueText, setValueText] = useState(
		value.kind === DYNAMIC_VALUE_KIND.TEXT || value.kind === DYNAMIC_VALUE_KIND.FORMULA
			? (value.value as string)
			: ''
	);
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
	const [valueDatabase, setValueDatabase] = useState(
		value.kind === DYNAMIC_VALUE_KIND.DATABASE ? (value.value as number) : 1
	);
	const [forcedValueNumber, setForcedValueNumber] = useState<number | undefined>();

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
				break;
			case DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER:
				list = [DYNAMIC_VALUE_KIND.NUMBER, DYNAMIC_VALUE_KIND.VARIABLE];
				break;
			case DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL:
				list = [DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, DYNAMIC_VALUE_KIND.VARIABLE];
				break;
			case DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE:
				list = [DYNAMIC_VALUE_KIND.DATABASE, DYNAMIC_VALUE_KIND.NUMBER, DYNAMIC_VALUE_KIND.VARIABLE];
				break;
			case DYNAMIC_VALUE_OPTIONS_TYPE.SWITCH:
				list = [DYNAMIC_VALUE_KIND.SWITCH, DYNAMIC_VALUE_KIND.VARIABLE];
				break;
			case DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA:
				list = [DYNAMIC_VALUE_KIND.FORMULA, DYNAMIC_VALUE_KIND.VARIABLE];
				break;
			default:
				break;
		}
		switch (optionsType) {
			case DYNAMIC_VALUE_OPTIONS_TYPE.TEXT:
			case DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER:
			case DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL:
			case DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE:
			case DYNAMIC_VALUE_OPTIONS_TYPE.SWITCH:
			case DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA:
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
			case DYNAMIC_VALUE_KIND.FORMULA:
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
			case DYNAMIC_VALUE_KIND.DATABASE:
				value.value = valueDatabase;
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

	const handleChangeDetabase = (id: number) => {
		setValueDatabase(id);
		value.value = id;
	};

	useEffect(() => {
		setKind(value.kind);
		onChangeKind?.(value.kind);
		// eslint-disable-next-line
	}, [value.kind]);

	useEffect(() => {
		switch (value.kind) {
			case DYNAMIC_VALUE_KIND.NUMBER:
			case DYNAMIC_VALUE_KIND.NUMBER_DECIMAL:
				setValueNumber(value.value as number);
				setForcedValueNumber(value.value as number);
				break;
			case DYNAMIC_VALUE_KIND.TEXT:
			case DYNAMIC_VALUE_KIND.FORMULA:
				setValueText(value.value as string);
				break;
			case DYNAMIC_VALUE_KIND.VARIABLE:
				setValueVariableID(value.value as number);
				break;
			case DYNAMIC_VALUE_KIND.KEYBOARD:
				setValueVariableID(value.value as number);
				break;
			case DYNAMIC_VALUE_KIND.PARAMETER:
				setValueParameterID(value.value as number);
				break;
			case DYNAMIC_VALUE_KIND.PROPERTY:
				setValuePropertyID(value.value as number);
				break;
			case DYNAMIC_VALUE_KIND.DATABASE:
				setValueDatabase(value.value as number);
				break;
			case DYNAMIC_VALUE_KIND.SWITCH:
				setValueSwitch(value.value as boolean);
				break;
		}
		onChangeValue?.(value.value);
		// eslint-disable-next-line
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
						disabled={disabled}
						forcedValue={forcedValueNumber}
						setForcedValue={setForcedValueNumber}
						min={min}
						max={max}
					/>
				);
			case DYNAMIC_VALUE_KIND.VARIABLE:
				return (
					<VariableSelector
						variableID={valueVariableID}
						onChange={handleChangeVariable}
						disabled={disabled}
					/>
				);
			case DYNAMIC_VALUE_KIND.TEXT:
			case DYNAMIC_VALUE_KIND.FORMULA:
				return (
					<InputText
						value={valueText}
						onChange={handleChangeText}
						widthType={INPUT_TYPE_WIDTH.FILL}
						disabled={disabled}
					/>
				);
			case DYNAMIC_VALUE_KIND.SWITCH:
				return (
					<Dropdown
						selectedID={valueSwitch ? 0 : 1}
						onChange={handleChangeSwitch}
						options={Model.Base.ON_OFF_OPTIONS}
						disabled={disabled}
						fillWidth
					/>
				);
			case DYNAMIC_VALUE_KIND.KEYBOARD:
				return (
					<Dropdown
						selectedID={valueKeyboardID}
						onChange={handleChangeKeyboard}
						options={Project.current!.keyboard.list}
						disabled={disabled}
						displayIDs
						width={INPUT_WIDTH}
					/>
				);
			case DYNAMIC_VALUE_KIND.PARAMETER:
				return (
					<Dropdown
						selectedID={valueParameterID}
						onChange={handleChangeParameter}
						options={Project.current!.currentMapObjectParameters}
						disabled={disabled}
						displayIDs
						width={INPUT_WIDTH}
					/>
				);
			case DYNAMIC_VALUE_KIND.PROPERTY:
				return (
					<Dropdown
						selectedID={valuePropertyID}
						onChange={handleChangeProperty}
						options={Project.current!.currentMapObjectProperties.map((node) => node.content)}
						disabled={disabled}
						displayIDs
						width={INPUT_WIDTH}
					/>
				);
			case DYNAMIC_VALUE_KIND.DATABASE:
				return (
					<Dropdown
						selectedID={valueDatabase}
						onChange={handleChangeDetabase}
						options={databaseOptions}
						disabled={disabled}
						displayIDs
						width={INPUT_WIDTH}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className='dynamicValueSelector'>
			<Dropdown
				selectedID={kind}
				onChange={handleChangeKind}
				options={getOptions()}
				disabled={disabled}
				translateOptions
			/>
			<Flex one>{getValueDisplay()}</Flex>
		</div>
	);
}

export default DynamicValueSelector;
