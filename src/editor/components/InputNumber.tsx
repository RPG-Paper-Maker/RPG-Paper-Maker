/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { INPUT_TYPE_WIDTH, Mathf } from '../common';
import '../styles/Input.css';

type Props = {
	value: number;
	onChange: (e: number) => void;
	widthType?: INPUT_TYPE_WIDTH;
	max?: number;
	min?: number;
	decimals?: boolean;
	disabled?: boolean;
};

function InputNumber({
	value,
	onChange,
	widthType = INPUT_TYPE_WIDTH.NORMAL,
	min = -999999999,
	max = 999999999,
	decimals = false,
	disabled = false,
}: Props) {
	const transformValue = (v: number) => (decimals ? Mathf.forceDecimals(v) : Mathf.forceInteger(v));

	const transformValueToText = (v: number) =>
		decimals ? Mathf.forceDecimalsText(v) : Mathf.forceInteger(v).toString();

	const [displayedValue, setDisplayedValue] = useState(transformValueToText(value));

	const width = (() => {
		switch (widthType) {
			case INPUT_TYPE_WIDTH.FILL:
				return '100%';
			case INPUT_TYPE_WIDTH.SMALL:
				return '50px';
			case INPUT_TYPE_WIDTH.NORMAL:
				return '100px';
			case INPUT_TYPE_WIDTH.LARGE:
				return '195px';
		}
	})();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const v = transformValue(Number(e.target.value));
		setDisplayedValue(e.target.value);
		if (v < min) {
			onChange(min);
		} else if (v > max) {
			onChange(max);
		} else {
			onChange(v);
		}
	};

	const handleBlur = () => {
		let v = value;
		if (value < min) {
			v = min;
		} else if (value > max) {
			v = max;
		}
		if (v !== value) {
			onChange(v);
		}
		setDisplayedValue(transformValueToText(v));
	};

	useEffect(() => {
		setDisplayedValue(transformValueToText(value));
	}, [value]);

	return (
		<input
			type='number'
			min={min}
			max={max}
			value={displayedValue}
			onBlur={handleBlur}
			onChange={handleChange}
			step='any'
			style={{ minWidth: width, maxWidth: width }}
			disabled={disabled}
		/>
	);
}

export default InputNumber;
