/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ChangeEvent } from 'react';

type Props = {
	value: number;
	onChange: (v: number) => void;
	min: number;
	max: number;
	step?: number;
	disabled?: boolean;
	fillWidth?: boolean;
};

function Slider({ value, onChange, min, max, step = 1, disabled = false, fillWidth = false }: Props) {
	const getWidth = () => (Math.abs(min) + Math.abs(max)) / step;

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = Number(e.target.value);
		onChange(newValue);
	};

	return (
		<input
			type='range'
			min={min}
			max={max}
			step={step}
			value={value}
			onChange={handleChange}
			style={{ width: fillWidth ? '100%' : `${getWidth()}px` }}
			disabled={disabled}
		/>
	);
}

export default Slider;
