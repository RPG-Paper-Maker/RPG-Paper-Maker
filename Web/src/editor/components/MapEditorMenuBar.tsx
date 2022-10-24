/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import Menu from './Menu';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';

type Props = {
    kind?: number
};

function MapEditorMenuBar({ kind }: Props) {

    const handleFloor = () => {

    };
    
    return (
        <React.Fragment>
            <Menu mode='horizontal'>
                <SubMenu icon='floor.png'>
                    <MenuItem onClick={handleFloor}>Floor</MenuItem>
                </SubMenu>
                <SubMenu icon='sprite-face.png'>
                    <MenuItem onClick={handleFloor}>Floor</MenuItem>
                </SubMenu>
                <SubMenu icon='mountain.png'>
                    <MenuItem onClick={handleFloor}>Floor</MenuItem>
                </SubMenu>
                <SubMenu icon='object.png'>
                    <MenuItem onClick={handleFloor}>Floor</MenuItem>
                </SubMenu>
                <SubMenu icon='ev.png'>
                    <MenuItem onClick={handleFloor}>Floor</MenuItem>
                </SubMenu>
                <SubMenu icon='view.png'>
                    <MenuItem onClick={handleFloor}>Floor</MenuItem>
                </SubMenu>
            </Menu>
        </React.Fragment>
    );
}

export default MapEditorMenuBar;