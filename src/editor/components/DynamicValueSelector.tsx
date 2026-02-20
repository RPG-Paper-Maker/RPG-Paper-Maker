/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrayUtils, DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, INPUT_TYPE_WIDTH, Utils } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Project } from '../core/Project';
import { Model } from '../Editor';
import '../styles/DynamicValueSelector.css';
import DialogInfoFormulas from './dialogs/DialogInfoFormulas';
import Dropdown from './Dropdown';
import Flex from './Flex';
import InputNumber from './InputNumber';
import InputText from './InputText';
import TextArea from './TextArea';
import TooltipInformation from './TooltipInformation';
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
	addNoneOption?: boolean;
	fillWidth?: boolean;
	isTextarea?: boolean;
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
	addNoneOption = false,
	fillWidth = false,
	isTextarea = false,
}: Props) {
	const { t } = useTranslation();
	const [isDialogInfoFormulasOpen, setIsDialogInfoFormulasOpen] = useState(false);
	const [kind, setKind] = useState(value.kind);
	const [valueNumber, setValueNumber] = useState(
		value.kind === DYNAMIC_VALUE_KIND.NUMBER || value.kind === DYNAMIC_VALUE_KIND.NUMBER_DECIMAL
			? (value.value as number)
			: 0,
	);
	const [valueText, setValueText] = useState(
		value.kind === DYNAMIC_VALUE_KIND.TEXT || value.kind === DYNAMIC_VALUE_KIND.FORMULA
			? (value.value as string)
			: '',
	);
	const [valueSwitch, setValueSwitch] = useState(
		value.kind === DYNAMIC_VALUE_KIND.SWITCH ? (value.value as boolean) : true,
	);
	const [valueVariableID, setValueVariableID] = useState(
		value.kind === DYNAMIC_VALUE_KIND.VARIABLE ? (value.value as number) : 1,
	);
	const [forcedVariableID, setForcedVariabledID] = useState<number | null>(null);
	const [valueKeyboardID, setValueKeyboardID] = useState(
		value.kind === DYNAMIC_VALUE_KIND.KEYBOARD ? (value.value as number) : Project.current!.keyboard.list[0]?.id,
	);
	const [valueParameterID, setValueParameterID] = useState(
		value.kind === DYNAMIC_VALUE_KIND.PARAMETER
			? (value.value as number)
			: Project.current!.currentMapObjectParameters[0]?.id,
	);
	const [valuePropertyID, setValuePropertyID] = useState(
		value.kind === DYNAMIC_VALUE_KIND.PROPERTY
			? (value.value as number)
			: Project.current!.currentMapObjectProperties[0]?.content?.id,
	);
	const [valueDatabase, setValueDatabase] = useState(
		[
			DYNAMIC_VALUE_KIND.CLASS,
			DYNAMIC_VALUE_KIND.HERO,
			DYNAMIC_VALUE_KIND.MONSTER,
			DYNAMIC_VALUE_KIND.TROOP,
			DYNAMIC_VALUE_KIND.ITEM,
			DYNAMIC_VALUE_KIND.WEAPON,
			DYNAMIC_VALUE_KIND.ARMOR,
			DYNAMIC_VALUE_KIND.SKILL,
			DYNAMIC_VALUE_KIND.ANIMATION,
			DYNAMIC_VALUE_KIND.STATUS,
			DYNAMIC_VALUE_KIND.TILESET,
			DYNAMIC_VALUE_KIND.FONT_SIZE,
			DYNAMIC_VALUE_KIND.FONT_NAME,
			DYNAMIC_VALUE_KIND.COLOR,
			DYNAMIC_VALUE_KIND.WINDOW_SKIN,
			DYNAMIC_VALUE_KIND.CURRENCY,
			DYNAMIC_VALUE_KIND.SPEED,
			DYNAMIC_VALUE_KIND.DETECTION,
			DYNAMIC_VALUE_KIND.CAMERA_PROPERTY,
			DYNAMIC_VALUE_KIND.FREQUENCY,
			DYNAMIC_VALUE_KIND.SKYBOX,
			DYNAMIC_VALUE_KIND.BATTLE_MAP,
			DYNAMIC_VALUE_KIND.ELEMENT,
			DYNAMIC_VALUE_KIND.COMMON_STATISTIC,
			DYNAMIC_VALUE_KIND.WEAPONS_KIND,
			DYNAMIC_VALUE_KIND.ARMORS_KIND,
			DYNAMIC_VALUE_KIND.COMMON_BATTLECOMMAND,
			DYNAMIC_VALUE_KIND.COMMON_EQUIPMENT,
			DYNAMIC_VALUE_KIND.EVENT,
			DYNAMIC_VALUE_KIND.STATE,
			DYNAMIC_VALUE_KIND.COMMON_REACTION,
			DYNAMIC_VALUE_KIND.MODEL,
			DYNAMIC_VALUE_KIND.BARS,
			DYNAMIC_VALUE_KIND.ICONS,
			DYNAMIC_VALUE_KIND.AUTOTILES,
			DYNAMIC_VALUE_KIND.CHARACTERS,
			DYNAMIC_VALUE_KIND.MOUNTAINS,
			DYNAMIC_VALUE_KIND.TILESETS,
			DYNAMIC_VALUE_KIND.WALLS,
			DYNAMIC_VALUE_KIND.BATTLERS,
			DYNAMIC_VALUE_KIND.FACESETS,
			DYNAMIC_VALUE_KIND.WINDOW_SKINS,
			DYNAMIC_VALUE_KIND.TITLE_SCREEN,
			DYNAMIC_VALUE_KIND.OBJECT3D,
			DYNAMIC_VALUE_KIND.PICTURES,
			DYNAMIC_VALUE_KIND.ANIMATIONS,
			DYNAMIC_VALUE_KIND.SKYBOXES,
			DYNAMIC_VALUE_KIND.MUSIC,
			DYNAMIC_VALUE_KIND.BACKGROUND_SOUND,
			DYNAMIC_VALUE_KIND.SOUND,
			DYNAMIC_VALUE_KIND.MUSIC_EFFECT,
		].includes(value.kind)
			? (value.value as number)
			: 1,
	);

	const getOptionsKind = () => {
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
			case DYNAMIC_VALUE_OPTIONS_TYPE.CREATE_PARAMETER:
				list = [
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
			case DYNAMIC_VALUE_OPTIONS_TYPE.PROPERTY_PARAM_PROP:
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
				if (databaseOptions.length > 0) {
					list.push(DYNAMIC_VALUE_KIND.DATABASE);
				}
				list.push(DYNAMIC_VALUE_KIND.NUMBER);
				list.push(DYNAMIC_VALUE_KIND.VARIABLE);
				break;
			case DYNAMIC_VALUE_OPTIONS_TYPE.SWITCH:
				list = [DYNAMIC_VALUE_KIND.SWITCH, DYNAMIC_VALUE_KIND.VARIABLE];
				break;
			case DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA:
				list = [DYNAMIC_VALUE_KIND.FORMULA, DYNAMIC_VALUE_KIND.VARIABLE];
				break;
			case DYNAMIC_VALUE_OPTIONS_TYPE.VARIABLE_PARAM_PROP:
				list.push(DYNAMIC_VALUE_KIND.VARIABLE);
				break;
			case DYNAMIC_VALUE_OPTIONS_TYPE.PLUGIN_VALUE:
				list = [
					DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE,
					DYNAMIC_VALUE_KIND.CUSTOM_LIST,
					DYNAMIC_VALUE_KIND.VECTOR2,
					DYNAMIC_VALUE_KIND.VECTOR3,
					DYNAMIC_VALUE_KIND.VARIABLE,
					DYNAMIC_VALUE_KIND.NUMBER_DECIMAL,
					DYNAMIC_VALUE_KIND.SWITCH,
					DYNAMIC_VALUE_KIND.TEXT,
					DYNAMIC_VALUE_KIND.CLASS,
					DYNAMIC_VALUE_KIND.HERO,
					DYNAMIC_VALUE_KIND.MONSTER,
					DYNAMIC_VALUE_KIND.TROOP,
					DYNAMIC_VALUE_KIND.ITEM,
					DYNAMIC_VALUE_KIND.WEAPON,
					DYNAMIC_VALUE_KIND.ARMOR,
					DYNAMIC_VALUE_KIND.SKILL,
					DYNAMIC_VALUE_KIND.ANIMATION,
					DYNAMIC_VALUE_KIND.STATUS,
					DYNAMIC_VALUE_KIND.TILESET,
					DYNAMIC_VALUE_KIND.FONT_SIZE,
					DYNAMIC_VALUE_KIND.FONT_NAME,
					DYNAMIC_VALUE_KIND.COLOR,
					DYNAMIC_VALUE_KIND.WINDOW_SKIN,
					DYNAMIC_VALUE_KIND.CURRENCY,
					DYNAMIC_VALUE_KIND.SPEED,
					DYNAMIC_VALUE_KIND.DETECTION,
					DYNAMIC_VALUE_KIND.CAMERA_PROPERTY,
					DYNAMIC_VALUE_KIND.FREQUENCY,
					DYNAMIC_VALUE_KIND.SKYBOX,
					DYNAMIC_VALUE_KIND.BATTLE_MAP,
					DYNAMIC_VALUE_KIND.ELEMENT,
					DYNAMIC_VALUE_KIND.COMMON_STATISTIC,
					DYNAMIC_VALUE_KIND.WEAPONS_KIND,
					DYNAMIC_VALUE_KIND.ARMORS_KIND,
					DYNAMIC_VALUE_KIND.COMMON_BATTLECOMMAND,
					DYNAMIC_VALUE_KIND.COMMON_EQUIPMENT,
					DYNAMIC_VALUE_KIND.EVENT,
					DYNAMIC_VALUE_KIND.STATE,
					DYNAMIC_VALUE_KIND.COMMON_REACTION,
					DYNAMIC_VALUE_KIND.MODEL,
					DYNAMIC_VALUE_KIND.BARS,
					DYNAMIC_VALUE_KIND.ICONS,
					DYNAMIC_VALUE_KIND.AUTOTILES,
					DYNAMIC_VALUE_KIND.CHARACTERS,
					DYNAMIC_VALUE_KIND.MOUNTAINS,
					DYNAMIC_VALUE_KIND.TILESETS,
					DYNAMIC_VALUE_KIND.WALLS,
					DYNAMIC_VALUE_KIND.BATTLERS,
					DYNAMIC_VALUE_KIND.FACESETS,
					DYNAMIC_VALUE_KIND.WINDOW_SKINS,
					DYNAMIC_VALUE_KIND.TITLE_SCREEN,
					DYNAMIC_VALUE_KIND.OBJECT3D,
					DYNAMIC_VALUE_KIND.PICTURES,
					DYNAMIC_VALUE_KIND.ANIMATIONS,
					DYNAMIC_VALUE_KIND.SKYBOXES,
					DYNAMIC_VALUE_KIND.MUSIC,
					DYNAMIC_VALUE_KIND.BACKGROUND_SOUND,
					DYNAMIC_VALUE_KIND.SOUND,
					DYNAMIC_VALUE_KIND.MUSIC_EFFECT,
				];
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
			case DYNAMIC_VALUE_OPTIONS_TYPE.VARIABLE_PARAM_PROP:
			case DYNAMIC_VALUE_OPTIONS_TYPE.PROPERTY_PARAM_PROP:
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
		if (addNoneOption) {
			ArrayUtils.insertFirst(list, DYNAMIC_VALUE_KIND.NONE);
		}
		return list;
	};

	const getOptions = () => getOptionsKind().map((k) => Model.Base.DYNAMIC_VALUE_KIND_OPTIONS[k]);

	const databaseList = useMemo(() => {
		DynamicValue.getDatabase(kind);
		switch (kind) {
			case DYNAMIC_VALUE_KIND.DATABASE:
				return databaseOptions;
			default:
				return DynamicValue.getDatabase(kind);
		}
	}, [kind, databaseOptions]);

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
			case DYNAMIC_VALUE_KIND.CLASS:
			case DYNAMIC_VALUE_KIND.HERO:
			case DYNAMIC_VALUE_KIND.MONSTER:
			case DYNAMIC_VALUE_KIND.TROOP:
			case DYNAMIC_VALUE_KIND.ITEM:
			case DYNAMIC_VALUE_KIND.WEAPON:
			case DYNAMIC_VALUE_KIND.ARMOR:
			case DYNAMIC_VALUE_KIND.SKILL:
			case DYNAMIC_VALUE_KIND.ANIMATION:
			case DYNAMIC_VALUE_KIND.STATUS:
			case DYNAMIC_VALUE_KIND.TILESET:
			case DYNAMIC_VALUE_KIND.FONT_SIZE:
			case DYNAMIC_VALUE_KIND.FONT_NAME:
			case DYNAMIC_VALUE_KIND.COLOR:
			case DYNAMIC_VALUE_KIND.WINDOW_SKIN:
			case DYNAMIC_VALUE_KIND.CURRENCY:
			case DYNAMIC_VALUE_KIND.SPEED:
			case DYNAMIC_VALUE_KIND.DETECTION:
			case DYNAMIC_VALUE_KIND.CAMERA_PROPERTY:
			case DYNAMIC_VALUE_KIND.FREQUENCY:
			case DYNAMIC_VALUE_KIND.SKYBOX:
			case DYNAMIC_VALUE_KIND.BATTLE_MAP:
			case DYNAMIC_VALUE_KIND.ELEMENT:
			case DYNAMIC_VALUE_KIND.COMMON_STATISTIC:
			case DYNAMIC_VALUE_KIND.WEAPONS_KIND:
			case DYNAMIC_VALUE_KIND.ARMORS_KIND:
			case DYNAMIC_VALUE_KIND.COMMON_BATTLECOMMAND:
			case DYNAMIC_VALUE_KIND.COMMON_EQUIPMENT:
			case DYNAMIC_VALUE_KIND.EVENT:
			case DYNAMIC_VALUE_KIND.STATE:
			case DYNAMIC_VALUE_KIND.COMMON_REACTION:
			case DYNAMIC_VALUE_KIND.MODEL:
			case DYNAMIC_VALUE_KIND.BARS:
			case DYNAMIC_VALUE_KIND.ICONS:
			case DYNAMIC_VALUE_KIND.AUTOTILES:
			case DYNAMIC_VALUE_KIND.CHARACTERS:
			case DYNAMIC_VALUE_KIND.MOUNTAINS:
			case DYNAMIC_VALUE_KIND.TILESETS:
			case DYNAMIC_VALUE_KIND.WALLS:
			case DYNAMIC_VALUE_KIND.BATTLERS:
			case DYNAMIC_VALUE_KIND.FACESETS:
			case DYNAMIC_VALUE_KIND.WINDOW_SKINS:
			case DYNAMIC_VALUE_KIND.TITLE_SCREEN:
			case DYNAMIC_VALUE_KIND.OBJECT3D:
			case DYNAMIC_VALUE_KIND.PICTURES:
			case DYNAMIC_VALUE_KIND.ANIMATIONS:
			case DYNAMIC_VALUE_KIND.SKYBOXES:
			case DYNAMIC_VALUE_KIND.MUSIC:
			case DYNAMIC_VALUE_KIND.BACKGROUND_SOUND:
			case DYNAMIC_VALUE_KIND.SOUND:
			case DYNAMIC_VALUE_KIND.MUSIC_EFFECT:
				value.value = valueDatabase;
				break;
			case DYNAMIC_VALUE_KIND.CUSTOM_STRUCTURE:
			case DYNAMIC_VALUE_KIND.CUSTOM_LIST:
			case DYNAMIC_VALUE_KIND.VECTOR2:
			case DYNAMIC_VALUE_KIND.VECTOR3:
				value.value = null;
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

	const handleChangeDatabase = (id: number) => {
		setValueDatabase(id);
		value.value = id;
	};

	useLayoutEffect(() => {
		if (
			(value.kind === DYNAMIC_VALUE_KIND.DATABASE && databaseOptions.length === 0) ||
			(value.kind === DYNAMIC_VALUE_KIND.PARAMETER && Project.current!.currentMapObjectParameters.length === 0) ||
			(value.kind === DYNAMIC_VALUE_KIND.PROPERTY && Project.current!.currentMapObjectProperties.length === 0)
		) {
			value.kind = getOptionsKind()[0];
		}
		if (value.kind === DYNAMIC_VALUE_KIND.TEXT && optionsType === DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA) {
			value.kind = DYNAMIC_VALUE_KIND.FORMULA;
		}
		setKind(value.kind);
		onChangeKind?.(value.kind);
	}, [value.kind]);

	useLayoutEffect(() => {
		switch (value.kind) {
			case DYNAMIC_VALUE_KIND.NUMBER:
			case DYNAMIC_VALUE_KIND.NUMBER_DECIMAL:
				setValueNumber(value.value as number);
				break;
			case DYNAMIC_VALUE_KIND.TEXT:
			case DYNAMIC_VALUE_KIND.FORMULA:
				setValueText(value.value as string);
				break;
			case DYNAMIC_VALUE_KIND.VARIABLE:
				setValueVariableID(value.value as number);
				if (valueVariableID !== value.value) {
					setForcedVariabledID(value.value as number);
				}
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
			case DYNAMIC_VALUE_KIND.CLASS:
			case DYNAMIC_VALUE_KIND.HERO:
			case DYNAMIC_VALUE_KIND.MONSTER:
			case DYNAMIC_VALUE_KIND.TROOP:
			case DYNAMIC_VALUE_KIND.ITEM:
			case DYNAMIC_VALUE_KIND.WEAPON:
			case DYNAMIC_VALUE_KIND.ARMOR:
			case DYNAMIC_VALUE_KIND.SKILL:
			case DYNAMIC_VALUE_KIND.ANIMATION:
			case DYNAMIC_VALUE_KIND.STATUS:
			case DYNAMIC_VALUE_KIND.TILESET:
			case DYNAMIC_VALUE_KIND.FONT_SIZE:
			case DYNAMIC_VALUE_KIND.FONT_NAME:
			case DYNAMIC_VALUE_KIND.COLOR:
			case DYNAMIC_VALUE_KIND.WINDOW_SKIN:
			case DYNAMIC_VALUE_KIND.CURRENCY:
			case DYNAMIC_VALUE_KIND.SPEED:
			case DYNAMIC_VALUE_KIND.DETECTION:
			case DYNAMIC_VALUE_KIND.CAMERA_PROPERTY:
			case DYNAMIC_VALUE_KIND.FREQUENCY:
			case DYNAMIC_VALUE_KIND.SKYBOX:
			case DYNAMIC_VALUE_KIND.BATTLE_MAP:
			case DYNAMIC_VALUE_KIND.ELEMENT:
			case DYNAMIC_VALUE_KIND.COMMON_STATISTIC:
			case DYNAMIC_VALUE_KIND.WEAPONS_KIND:
			case DYNAMIC_VALUE_KIND.ARMORS_KIND:
			case DYNAMIC_VALUE_KIND.COMMON_BATTLECOMMAND:
			case DYNAMIC_VALUE_KIND.COMMON_EQUIPMENT:
			case DYNAMIC_VALUE_KIND.EVENT:
			case DYNAMIC_VALUE_KIND.STATE:
			case DYNAMIC_VALUE_KIND.COMMON_REACTION:
			case DYNAMIC_VALUE_KIND.MODEL:
			case DYNAMIC_VALUE_KIND.BARS:
			case DYNAMIC_VALUE_KIND.ICONS:
			case DYNAMIC_VALUE_KIND.AUTOTILES:
			case DYNAMIC_VALUE_KIND.CHARACTERS:
			case DYNAMIC_VALUE_KIND.MOUNTAINS:
			case DYNAMIC_VALUE_KIND.TILESETS:
			case DYNAMIC_VALUE_KIND.WALLS:
			case DYNAMIC_VALUE_KIND.BATTLERS:
			case DYNAMIC_VALUE_KIND.FACESETS:
			case DYNAMIC_VALUE_KIND.WINDOW_SKINS:
			case DYNAMIC_VALUE_KIND.TITLE_SCREEN:
			case DYNAMIC_VALUE_KIND.OBJECT3D:
			case DYNAMIC_VALUE_KIND.PICTURES:
			case DYNAMIC_VALUE_KIND.ANIMATIONS:
			case DYNAMIC_VALUE_KIND.SKYBOXES:
			case DYNAMIC_VALUE_KIND.MUSIC:
			case DYNAMIC_VALUE_KIND.BACKGROUND_SOUND:
			case DYNAMIC_VALUE_KIND.SOUND:
			case DYNAMIC_VALUE_KIND.MUSIC_EFFECT:
				setValueDatabase(value.value as number);
				break;
			case DYNAMIC_VALUE_KIND.SWITCH:
				setValueSwitch(value.value as boolean);
				break;
		}
		onChangeValue?.(value.value);
	}, [value.value]);

	useEffect(() => {
		if (min !== undefined && valueNumber < min) {
			setValueNumber(min);
		}
	}, [min]);

	useEffect(() => {
		if (max !== undefined && valueNumber > max) {
			setValueNumber(max);
		}
	}, [max]);

	const getValueDisplay = () => {
		switch (kind) {
			case DYNAMIC_VALUE_KIND.NUMBER:
			case DYNAMIC_VALUE_KIND.NUMBER_DECIMAL:
				return (
					<InputNumber
						value={valueNumber}
						onChange={handleChangeNumber}
						widthType={fillWidth ? INPUT_TYPE_WIDTH.FILL : INPUT_TYPE_WIDTH.LARGE}
						decimals={kind === DYNAMIC_VALUE_KIND.NUMBER_DECIMAL}
						disabled={disabled}
						min={min}
						max={max}
					/>
				);
			case DYNAMIC_VALUE_KIND.VARIABLE:
				return (
					<VariableSelector
						variableID={valueVariableID}
						forcedVariableID={forcedVariableID}
						setForcedVariableID={setForcedVariabledID}
						onChange={handleChangeVariable}
						disabled={disabled}
						fillWidth={fillWidth}
					/>
				);
			case DYNAMIC_VALUE_KIND.TEXT:
			case DYNAMIC_VALUE_KIND.FORMULA:
				return isTextarea ? (
					<TextArea text={valueText} onChange={handleChangeText} disabled={disabled} />
				) : (
					<InputText
						value={valueText}
						onChange={handleChangeText}
						widthType={fillWidth ? INPUT_TYPE_WIDTH.FILL : INPUT_TYPE_WIDTH.NORMAL}
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
						width={INPUT_WIDTH}
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
			case DYNAMIC_VALUE_KIND.CLASS:
			case DYNAMIC_VALUE_KIND.HERO:
			case DYNAMIC_VALUE_KIND.MONSTER:
			case DYNAMIC_VALUE_KIND.TROOP:
			case DYNAMIC_VALUE_KIND.ITEM:
			case DYNAMIC_VALUE_KIND.WEAPON:
			case DYNAMIC_VALUE_KIND.ARMOR:
			case DYNAMIC_VALUE_KIND.SKILL:
			case DYNAMIC_VALUE_KIND.ANIMATION:
			case DYNAMIC_VALUE_KIND.STATUS:
			case DYNAMIC_VALUE_KIND.TILESET:
			case DYNAMIC_VALUE_KIND.FONT_SIZE:
			case DYNAMIC_VALUE_KIND.FONT_NAME:
			case DYNAMIC_VALUE_KIND.COLOR:
			case DYNAMIC_VALUE_KIND.WINDOW_SKIN:
			case DYNAMIC_VALUE_KIND.CURRENCY:
			case DYNAMIC_VALUE_KIND.SPEED:
			case DYNAMIC_VALUE_KIND.DETECTION:
			case DYNAMIC_VALUE_KIND.CAMERA_PROPERTY:
			case DYNAMIC_VALUE_KIND.FREQUENCY:
			case DYNAMIC_VALUE_KIND.SKYBOX:
			case DYNAMIC_VALUE_KIND.BATTLE_MAP:
			case DYNAMIC_VALUE_KIND.ELEMENT:
			case DYNAMIC_VALUE_KIND.COMMON_STATISTIC:
			case DYNAMIC_VALUE_KIND.WEAPONS_KIND:
			case DYNAMIC_VALUE_KIND.ARMORS_KIND:
			case DYNAMIC_VALUE_KIND.COMMON_BATTLECOMMAND:
			case DYNAMIC_VALUE_KIND.COMMON_EQUIPMENT:
			case DYNAMIC_VALUE_KIND.EVENT:
			case DYNAMIC_VALUE_KIND.STATE:
			case DYNAMIC_VALUE_KIND.COMMON_REACTION:
			case DYNAMIC_VALUE_KIND.MODEL:
			case DYNAMIC_VALUE_KIND.BARS:
			case DYNAMIC_VALUE_KIND.ICONS:
			case DYNAMIC_VALUE_KIND.AUTOTILES:
			case DYNAMIC_VALUE_KIND.CHARACTERS:
			case DYNAMIC_VALUE_KIND.MOUNTAINS:
			case DYNAMIC_VALUE_KIND.TILESETS:
			case DYNAMIC_VALUE_KIND.WALLS:
			case DYNAMIC_VALUE_KIND.BATTLERS:
			case DYNAMIC_VALUE_KIND.FACESETS:
			case DYNAMIC_VALUE_KIND.WINDOW_SKINS:
			case DYNAMIC_VALUE_KIND.TITLE_SCREEN:
			case DYNAMIC_VALUE_KIND.OBJECT3D:
			case DYNAMIC_VALUE_KIND.PICTURES:
			case DYNAMIC_VALUE_KIND.ANIMATIONS:
			case DYNAMIC_VALUE_KIND.SKYBOXES:
			case DYNAMIC_VALUE_KIND.MUSIC:
			case DYNAMIC_VALUE_KIND.BACKGROUND_SOUND:
			case DYNAMIC_VALUE_KIND.SOUND:
			case DYNAMIC_VALUE_KIND.MUSIC_EFFECT:
				return (
					<Dropdown
						selectedID={valueDatabase}
						onChange={handleChangeDatabase}
						options={databaseList}
						disabled={disabled}
						displayIDs
						width={INPUT_WIDTH}
					/>
				);
			default:
				return <div style={{ width: INPUT_WIDTH }}></div>;
		}
	};

	return (
		<>
			<div className={Utils.getClassName({ fillWidth }, 'dynamicValueSelector')}>
				<Dropdown
					selectedID={kind}
					onChange={handleChangeKind}
					options={getOptions()}
					disabled={disabled}
					translateOptions
				/>
				<Flex one spaced>
					{getValueDisplay()}
					{kind === DYNAMIC_VALUE_KIND.FORMULA && (
						<TooltipInformation
							text={t('tooltip.click.formulas.overview')}
							onClick={() => setIsDialogInfoFormulasOpen(true)}
							disabled={disabled}
						/>
					)}
				</Flex>
			</div>
			{isDialogInfoFormulasOpen && <DialogInfoFormulas setIsOpen={setIsDialogInfoFormulasOpen} />}
		</>
	);
}

export default DynamicValueSelector;
