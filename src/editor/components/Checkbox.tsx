/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { Utils } from '../common';
import '../styles/Checkbox.css';

type Props = {
	children?: ReactNode;
	isChecked?: boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
};

function Checkbox({ children, isChecked = false, onChange, disabled = false }: Props) {
	const handleClick = () => {
		if (!disabled && onChange) {
			onChange(!isChecked);
		}
	};

	return (
		<label className={Utils.getClassName({ disabled }, 'checkbox')} onClick={handleClick}>
			<div className={Utils.getClassName({ checked: isChecked, disabled }, 'square')} />
			{children}
		</label>
	);
}

export default Checkbox;
