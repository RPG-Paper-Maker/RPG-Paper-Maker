/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

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
};

function SliderDynamic({ dynamic, min, max, step, isVertical = false, unit }: Props) {
	const [valueSlide, setValueSlide] = useStateNumber();
	const [disabled, setDisabled] = useStateBool();

	const canDisable = (k: DYNAMIC_VALUE_KIND) => k !== DYNAMIC_VALUE_KIND.NUMBER;

	const handleChangeKind = (k: DYNAMIC_VALUE_KIND) => {
		setDisabled(canDisable(k));
	};

	const handleChangeValue = (v: unknown) => {
		if (!canDisable(dynamic.kind)) {
			setValueSlide(v as number);
		}
	};

	const handleChangeValueSlide = (v: number) => {
		handleChangeValue(v);
		dynamic.value = v;
	};

	return (
		<Flex column={isVertical} spaced centerV={!isVertical}>
			<Slider
				value={valueSlide}
				onChange={handleChangeValueSlide}
				min={min}
				max={max}
				step={step}
				disabled={disabled}
				fillWidth
			/>
			<Flex spaced centerV>
				<DynamicValueSelector
					value={dynamic}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
					onChangeKind={handleChangeKind}
					onChangeValue={handleChangeValue}
					min={min}
					max={max}
				/>
				{unit}
			</Flex>
		</Flex>
	);
}

export default SliderDynamic;
