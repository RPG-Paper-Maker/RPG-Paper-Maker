/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { INPUT_TYPE_WIDTH, Mathf } from '../common';
import { Inputs } from '../managers';
import '../styles/Input.css';

type Props = {
	value: number;
	onChange: (e: number) => void;
	widthType?: INPUT_TYPE_WIDTH;
	max?: number;
	min?: number;
	decimals?: boolean;
	disabled?: boolean;
	suffixPlaceholder?: string;
};

function InputNumber({
	value,
	onChange,
	widthType = INPUT_TYPE_WIDTH.NORMAL,
	min = -999999999,
	max = 999999999,
	decimals = false,
	disabled = false,
	suffixPlaceholder,
}: Props) {
	const transformValue = (v: number) => (decimals ? Mathf.forceDecimals(v) : Mathf.forceInteger(v));

	const transformValueToText = (v: number) =>
		decimals ? Mathf.forceDecimalsText(v) : Mathf.forceInteger(v).toString();

	const [displayedValue, setDisplayedValue] = useState(transformValueToText(value));
	const [isTyping, setIsTyping] = useState(false);
	const [focused, setFocused] = useState(false);

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

	const handleFocus = () => {
		Inputs.isMapFocused = false;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsTyping(true);
		Inputs.isMapFocused = false;
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
		setIsTyping(false);
		Inputs.isMapFocused = document.getElementsByClassName('dialog').length === 0;
		Inputs.keys = [];
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
		if (!isTyping) {
			setDisplayedValue(transformValueToText(value));
		}
	}, [value, isTyping]);

	useEffect(() => {
		if (isTyping) {
			const handleMouseUp = () => {
				Inputs.isMapFocused = document.getElementsByClassName('dialog').length === 0;
			};
			document.addEventListener('mouseup', handleMouseUp);
			return () => {
				document.removeEventListener('mouseup', handleMouseUp);
			};
		}
	}, [isTyping]);

	if (suffixPlaceholder) {
		return (
			<div className='inputSuffixWrapper' style={{ minWidth: width, maxWidth: width }}>
				<input
					type='number'
					min={min}
					max={max}
					value={displayedValue}
					onFocus={() => {
						setFocused(true);
						handleFocus();
					}}
					onBlur={() => {
						setFocused(false);
						handleBlur();
					}}
					onChange={handleChange}
					step='any'
					style={{ minWidth: width, maxWidth: width }}
					disabled={disabled}
				/>
				{!focused && (
					<div className='inputSuffixOverlay'>
						{displayedValue}
						<span className='inputSuffix'>{suffixPlaceholder}</span>
					</div>
				)}
			</div>
		);
	}

	return (
		<input
			type='number'
			min={min}
			max={max}
			value={displayedValue}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onChange={handleChange}
			step='any'
			style={{ minWidth: width, maxWidth: width }}
			disabled={disabled}
		/>
	);
}

export default InputNumber;
