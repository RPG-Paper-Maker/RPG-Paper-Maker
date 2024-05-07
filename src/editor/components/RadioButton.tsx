/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import '../styles/RadioButton.css';
import { Utils } from '../common';

type Props = {
	children?: ReactNode;
	isChecked?: boolean;
	onChange?: (checked: boolean) => void;
	additionalChange?: (checked: boolean) => void;
	allOnChanges?: ((checked: boolean) => void)[];
};

function RadioButton({ children, isChecked = false, onChange, additionalChange, allOnChanges }: Props) {
	const handleClick = () => {
		if (onChange && !isChecked) {
			onChange(true);
			additionalChange?.(true);
			if (allOnChanges) {
				for (const onChangeOther of allOnChanges) {
					if (onChange !== onChangeOther) {
						onChangeOther(false);
					}
				}
			}
		}
	};

	return (
		<label className='radiobutton' onClick={handleClick}>
			<div className={Utils.getClassName([[isChecked, 'checked']], ['square'])} />
			{children}
		</label>
	);
}

export default RadioButton;
