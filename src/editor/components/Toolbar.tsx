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
import {
	AiFillFileAdd,
	AiOutlineFileAdd,
	AiOutlineFolderOpen,
	AiOutlineFolder,
	AiOutlineDatabase,
	AiOutlinePicture,
	AiOutlineFontSize,
} from 'react-icons/ai';
import { BiSave, BiPyramid, BiCube } from 'react-icons/bi';
import { LuSaveAll, LuLanguages } from 'react-icons/lu';
import { BsClipboardData, BsMusicNote, BsPlay } from 'react-icons/bs';
import { TbNumbers } from 'react-icons/tb';
import { FaArrowsAlt, FaRegKeyboard, FaPlug, FaMountain } from 'react-icons/fa';
import { MdOutlineAddchart, MdAutoAwesomeMosaic } from 'react-icons/md';
import { TfiVideoClapper } from 'react-icons/tfi';
import { GiBrickWall } from 'react-icons/gi';

import '../styles/ToolBar.css';

function ToolBar() {
	const handleFloor = () => {};

	return (
		<div className='toolbar'>
			<Menu mode='horizontal'>
				<MenuItem icon={<AiOutlineFileAdd />} onClick={handleFloor}>
					New
				</MenuItem>
				<MenuItem icon={<AiOutlineFolderOpen />} onClick={handleFloor}>
					Open
				</MenuItem>
				<MenuItem icon={<BiSave />} onClick={handleFloor}>
					Save
				</MenuItem>
				<MenuItem icon={<LuSaveAll />} onClick={handleFloor}>
					All
				</MenuItem>
				<MenuItem icon={<AiOutlineFolder />} onClick={handleFloor}>
					Folder
				</MenuItem>
				<MenuItem type='separator'></MenuItem>
				<MenuItem icon={<BsClipboardData />} onClick={handleFloor}>
					Data
				</MenuItem>
				<MenuItem icon={<AiOutlineDatabase />} onClick={handleFloor}>
					Systems
				</MenuItem>
				<MenuItem icon={<TbNumbers />} onClick={handleFloor}>
					Variables
				</MenuItem>
				<MenuItem icon={<FaArrowsAlt />} onClick={handleFloor}>
					Collisions
				</MenuItem>
				<MenuItem icon={<FaRegKeyboard />} onClick={handleFloor}>
					Keyboard
				</MenuItem>
				<MenuItem icon={<LuLanguages />} onClick={handleFloor}>
					Languages
				</MenuItem>
				<MenuItem icon={<FaPlug />} onClick={handleFloor}>
					Plugins
				</MenuItem>
				<MenuItem icon={<MdOutlineAddchart />} onClick={handleFloor}>
					DLCs
				</MenuItem>
				<MenuItem type='separator'></MenuItem>
				<MenuItem icon={<AiOutlinePicture />} onClick={handleFloor}>
					Pictures
				</MenuItem>
				<MenuItem icon={<TfiVideoClapper />} onClick={handleFloor}>
					Videos
				</MenuItem>
				<MenuItem icon={<BsMusicNote />} onClick={handleFloor}>
					Songs
				</MenuItem>
				<MenuItem icon={<BiPyramid />} onClick={handleFloor}>
					Shapes
				</MenuItem>
				<MenuItem icon={<AiOutlineFontSize />} onClick={handleFloor}>
					Fonts
				</MenuItem>
				<MenuItem type='separator'></MenuItem>
				<MenuItem icon={<MdAutoAwesomeMosaic />} onClick={handleFloor}>
					Autotiles
				</MenuItem>
				<MenuItem icon={<GiBrickWall />} onClick={handleFloor}>
					Walls
				</MenuItem>
				<MenuItem icon={<BiCube />} onClick={handleFloor}>
					3D objects
				</MenuItem>
				<MenuItem icon={<FaMountain />} onClick={handleFloor}>
					Mountains
				</MenuItem>
				<MenuItem type='separator'></MenuItem>
				<MenuItem icon={<BsPlay />} onClick={handleFloor}>
					Play
				</MenuItem>
			</Menu>
		</div>
	);
}

export default ToolBar;
