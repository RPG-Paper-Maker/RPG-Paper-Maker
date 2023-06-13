/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import '../styles/MenuItem.css';

type Props = {
    children?: any,
    onClick?: (e:React.MouseEvent<HTMLElement, MouseEvent>) => void,
    disabled?: boolean,
    icon?: string
};

function MenuItem({ children, onClick, disabled = false, icon }: Props) {
    return (
        <div onClick={(e) => {
            if (onClick && !disabled) {
                onClick(e)
            }}} className={'custom-menu-item ' + (disabled ? 'custom-menu-item-disabled' : '')}>
            {icon ? <img alt='menu icon' src={'/assets/icons/' + icon}></img> : null}
            {children}
        </div>
    );
}

export default MenuItem;