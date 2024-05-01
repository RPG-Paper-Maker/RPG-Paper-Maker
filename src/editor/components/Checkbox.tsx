/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import '../styles/Checkbox.css';
import { Utils } from '../common';

type Props = {
	children?: ReactNode;
	isChecked?: boolean;
	onChange?: (checked: boolean) => void;
};

function Checkbox({ children, isChecked = false, onChange }: Props) {
	const handleClick = () => {
		if (onChange) {
			onChange(!isChecked);
		}
	};

	return (
		<label className='checkbox' onClick={handleClick}>
			<div className={Utils.getClassName([[isChecked, 'checked']], ['square'])} />
			{children}
		</label>
	);
}

export default Checkbox;
