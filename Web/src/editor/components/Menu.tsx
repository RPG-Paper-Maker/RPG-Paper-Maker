/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import '../styles/Menu.css';

type Props = {
    mode: string,
    children: JSX.Element | JSX.Element[]
};

function Menu({ children, mode }: Props) {
    return (
        <div className={'custom-menu ' + (mode === 'horizontal' ? ' custom-menu-horizontal' : '')}>
            {children}
        </div>
    );
}

export default Menu;