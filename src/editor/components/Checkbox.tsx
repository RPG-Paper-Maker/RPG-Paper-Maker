/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import '../styles/Checkox.css';

type Props = {
	children?: any;
	isChecked?: boolean;
	onChange?: (checked: boolean) => void;
};

function Checkbox({ children, isChecked = false, onChange }: Props) {
	const handleChange = () => {
		if (onChange) {
			onChange(!isChecked);
		}
	};

	return (
		<label className='checkbox'>
			<input type='checkbox' checked={isChecked} onChange={handleChange} />
			{children}
		</label>
	);
}

export default Checkbox;
