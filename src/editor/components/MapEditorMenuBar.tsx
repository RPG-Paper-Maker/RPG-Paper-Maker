/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import Menu from './menu/Menu';
import MenuItem from './menu/MenuItem';
import MenuSub from './menu/MenuSub';
import { BiSolidRectangle } from 'react-icons/bi';

function MapEditorMenuBar() {
	const handleFloor = () => {};

	return (
		<>
			<Menu horizontal>
				<MenuSub icon={<BiSolidRectangle />}>
					<MenuItem onClick={handleFloor}>Floor</MenuItem>
				</MenuSub>
				<MenuSub icon={<BiSolidRectangle />}>
					<MenuItem onClick={handleFloor} disabled>
						Floor
					</MenuItem>
				</MenuSub>
				<MenuSub icon={<BiSolidRectangle />}>
					<MenuItem onClick={handleFloor} disabled>
						Floor
					</MenuItem>
				</MenuSub>
				<MenuSub icon={<BiSolidRectangle />}>
					<MenuItem onClick={handleFloor} disabled>
						Floor
					</MenuItem>
				</MenuSub>
				<MenuSub icon={<BiSolidRectangle />}>
					<MenuItem onClick={handleFloor} disabled>
						Floor
					</MenuItem>
				</MenuSub>
				<MenuSub icon={<BiSolidRectangle />}>
					<MenuItem onClick={handleFloor} disabled>
						Floor
					</MenuItem>
				</MenuSub>
			</Menu>
		</>
	);
}

export default MapEditorMenuBar;
