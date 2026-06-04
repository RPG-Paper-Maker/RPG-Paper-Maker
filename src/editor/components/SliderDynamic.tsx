/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import useStateBool from '../hooks/useStateBool';
import useStateNumber from '../hooks/useStateNumber';
import DynamicValueSelector from './DynamicValueSelector';
import Flex from './Flex';
import Slider from './Slider';

type Props = {
	dynamic: DynamicValue;
	min: number;
	max: number;
	step?: number;
	isVertical?: boolean;
	unit?: string;
	disableDynamic?: boolean;
	decimals?: boolean;
	disabled?: boolean;
	onChange?: () => void;
};

function SliderDynamic({
	dynamic,
	min,
	max,
	step,
	isVertical = false,
	unit,
	disableDynamic = false,
	decimals = false,
	disabled = false,
	onChange,
}: Props) {
	const [valueSlide, setValueSlide] = useStateNumber();
	const [kindDisabled, setKindDisabled] = useStateBool();

	const numberKind = decimals ? DYNAMIC_VALUE_KIND.NUMBER_DECIMAL : DYNAMIC_VALUE_KIND.NUMBER;
	const optionsType = decimals ? DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL : DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER;

	const canDisable = (k: DYNAMIC_VALUE_KIND) => k !== numberKind;

	const handleChangeKind = (k: DYNAMIC_VALUE_KIND) => {
		setKindDisabled(canDisable(k));
		onChange?.();
	};

	const handleChangeValue = (v: unknown) => {
		if (!canDisable(dynamic.kind)) {
			setValueSlide(v as number);
		}
		onChange?.();
	};

	const handleChangeValueSlide = (v: number) => {
		if (!canDisable(dynamic.kind)) {
			setValueSlide(v);
		}
		dynamic.value = v;
		onChange?.();
	};

	return (
		<Flex column={isVertical} spaced centerV={!isVertical}>
			<Slider
				value={valueSlide}
				onChange={handleChangeValueSlide}
				min={min}
				max={max}
				step={step}
				disabled={disabled || kindDisabled}
				fillWidth
			/>
			<Flex spaced centerV>
				<DynamicValueSelector
					value={dynamic}
					optionsType={optionsType}
					onChangeKind={handleChangeKind}
					onChangeValue={handleChangeValue}
					min={min}
					max={max}
					disabled={disabled}
					disableDynamic={disableDynamic}
				/>
				{unit}
			</Flex>
		</Flex>
	);
}

export default SliderDynamic;
