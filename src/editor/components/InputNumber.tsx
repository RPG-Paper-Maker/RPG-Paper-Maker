/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { INPUT_TYPE_WIDTH, Mathf } from '../common';
import '../styles/Input.css';

type Props = {
	value: number;
	onChange: (e: number) => void;
	widthType?: INPUT_TYPE_WIDTH;
	max?: number;
	min?: number;
	decimals?: boolean;
};

function InputNumber({
	value,
	onChange,
	widthType = INPUT_TYPE_WIDTH.NORMAL,
	min = -999999999,
	max = 999999999,
	decimals = false,
}: Props) {
	const [isEmpty, setIsEmpty] = useState(false);

	const transformValue = (v: number) => (decimals ? Mathf.forceDecimals(v) : Mathf.forceInteger(v));

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

	const handleChange = (e: any) => {
		setIsEmpty(e.target.value === '');
		const v = transformValue(Number(e.target.value));
		if (v < min) {
			onChange(min);
		} else if (v > max) {
			onChange(max);
		} else {
			onChange(v);
		}
	};

	const handleBlur = () => {
		setIsEmpty(false);
		if (value < min) {
			onChange(min);
		} else if (value > max) {
			onChange(max);
		}
	};

	return (
		<input
			type='number'
			min={min}
			max={max}
			value={isEmpty ? '' : transformValue(value).toString()}
			onBlur={handleBlur}
			onChange={handleChange}
			step='any'
			style={{ maxWidth: getMaxWidth() }}
		/>
	);
}

export default InputNumber;
