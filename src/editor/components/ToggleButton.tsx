/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../common';
import '../styles/ToggleButton.css';

type Props = {
	value: boolean;
	onChange: (value: boolean) => void;
	disabled?: boolean;
};

function ToggleButton({ value, onChange, disabled = false }: Props) {
	const handleClick = () => {
		if (!disabled) {
			onChange(!value);
		}
	};

	return (
		<div className={Utils.getClassName({ on: value, disabled }, 'toggleButton')} onClick={handleClick}>
			<div className="toggleButtonTrack">
				<div className="toggleButtonThumb" />
			</div>
		</div>
	);
}

export default ToggleButton;
