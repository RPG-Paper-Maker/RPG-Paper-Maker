/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { INPUT_TYPE_WIDTH } from '../common';
import '../styles/Input.css';

type Props = {
	value: number;
	onChange: (e: number) => void;
	widthType?: INPUT_TYPE_WIDTH;
	max?: number;
	min?: number;
};

function InputNumber({
	value,
	onChange,
	widthType = INPUT_TYPE_WIDTH.NORMAL,
	min = -999999999,
	max = 999999999,
}: Props) {
	const getMaxWidth = () => {
		switch (widthType) {
			case INPUT_TYPE_WIDTH.FILL:
				return '100%';
			case INPUT_TYPE_WIDTH.SMALL:
				return '50px';
			case INPUT_TYPE_WIDTH.NORMAL:
				return '100px';
			case INPUT_TYPE_WIDTH.LARGE:
				return '200px';
		}
	};

	return (
		<input
			type='number'
			value={value}
			min={min}
			max={max}
			onChange={(e) => onChange(Number(e.target.value))}
			style={{ maxWidth: getMaxWidth() }}
		/>
	);
}

export default InputNumber;
