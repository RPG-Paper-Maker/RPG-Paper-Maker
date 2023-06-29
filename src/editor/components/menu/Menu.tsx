/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Utils } from '../../common/Utils';
import '../../styles/Menu.css';

type Props = {
	horizontal?: boolean;
	children: JSX.Element | JSX.Element[];
};

function Menu({ children, horizontal = false }: Props) {
	return (
		<div className={Utils.getClassName([[horizontal, 'custom-menu-horizontal']], ['custom-menu'])}>{children}</div>
	);
}

export default Menu;
