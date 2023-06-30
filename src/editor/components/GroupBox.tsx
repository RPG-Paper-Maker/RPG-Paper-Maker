/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import '../styles/GroupBox.css';

type Props = {
	children?: any;
	title?: string;
};

function Groupbox({ children, title = '' }: Props) {
	return (
		<fieldset>
			<legend>{title}</legend>
			<div>{children}</div>
		</fieldset>
	);
}

export default Groupbox;
