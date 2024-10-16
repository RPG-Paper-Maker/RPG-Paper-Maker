/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

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
};

function RadioButton({ value, children }: Props) {
	const { selected, onChange } = React.useContext(RadioGroupContext);

	const checked = value === selected;

	const handleChange = () => {
		onChange(value);
	};

	return (
		<label className='radiobutton'>
			<Flex spaced centerV>
				<input
					type='radio'
					value={value}
					checked={checked}
					onChange={handleChange}
					className={Utils.getClassName({ checked })}
				/>
				<p>{children}</p>
			</Flex>
		</label>
	);
}

export default RadioButton;
