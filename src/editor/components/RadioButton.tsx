/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { ReactNode } from 'react';
import { Utils } from '../common';
import '../styles/RadioButton.css';
import Flex from './Flex';
import { RadioGroupContext } from './RadioGroup';

type Props = {
	value: number;
	children?: ReactNode;
	disabled?: boolean;
};

function RadioButton({ value, children, disabled = false }: Props) {
	const { selected, onChange } = React.useContext(RadioGroupContext);

	const checked = value === selected;

	const handleChange = () => {
		if (!disabled) {
			onChange(value);
		}
	};

	return (
		<label className={Utils.getClassName({ disabled }, 'radiobutton')}>
			<Flex spaced centerV>
				<input
					type='radio'
					value={value}
					checked={checked}
					onChange={handleChange}
					className={Utils.getClassName({ checked })}
				/>
				<Flex disabledLabel={disabled}>{children}</Flex>
			</Flex>
		</label>
	);
}

export default RadioButton;
