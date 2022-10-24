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
import '../styles/ToolBar.css';

function ToolBar() {

    const handleFloor = () => {

    };
    
    return (
        <div className='toolbar'>
            <Menu mode='horizontal'>
                <MenuItem icon='new-file.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='open-file.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='save.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='save.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='dir.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='datas.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='systems.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='variables.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='collisions.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='inputs.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='scripts.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='lang.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='pictures.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='pause.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='songs.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='object-toolbar.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='fonts.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='autotiles-toolbar.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='walls-toolbar.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='object-toolbar.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='mountains-toolbar.png' onClick={handleFloor}></MenuItem>
                <MenuItem icon='play.png' onClick={handleFloor}></MenuItem>
            </Menu>
        </div>
    );
}

export default ToolBar;