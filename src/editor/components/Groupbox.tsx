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
import '../styles/Groupbox.css';

type Props = {
	children?: ReactNode;
	title?: string;
	fillWidth?: boolean;
	disabled?: boolean;
};

function Groupbox({ children, title = '', fillWidth = false, disabled = false }: Props) {
	return (
		<fieldset className={Utils.getClassName({ 'fill-width': fillWidth, disabled })}>
			<legend>{title}</legend>
			{children}
		</fieldset>
	);
}

export default Groupbox;
