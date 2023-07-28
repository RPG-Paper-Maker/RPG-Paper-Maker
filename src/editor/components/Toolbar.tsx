/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, triggerNewProject, triggerPlay } from '../store';
import Menu from './Menu';
import MenuItem from './MenuItem';
import {
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
import '../styles/Toolbar.css';

function Toolbar() {
	const dispatch = useDispatch();
	const currentProjectName = useSelector((state: RootState) => state.projects.current);

	const isProjectOpened = () => {
		return currentProjectName !== '';
	};

	const handleNewProject = () => {
		dispatch(triggerNewProject(true));
	};

	const handlePlay = () => {
		dispatch(triggerPlay(true));
	};

	const handleFloor = () => {
		// TODO
	};

	return (
		<div className='toolbar'>
			<Menu horizontal>
				<MenuItem icon={<AiOutlineFileAdd />} onClick={handleNewProject}>
					New
				</MenuItem>
				<MenuItem icon={<AiOutlineFolderOpen />} onClick={handleFloor} disabled>
					Open
				</MenuItem>
				<MenuItem icon={<BiSave />} onClick={handleFloor} disabled>
					Save
				</MenuItem>
				<MenuItem icon={<LuSaveAll />} onClick={handleFloor} disabled>
					All
				</MenuItem>
				<MenuItem icon={<AiOutlineFolder />} onClick={handleFloor} disabled>
					Folder
				</MenuItem>
				<MenuItem separator></MenuItem>
				<MenuItem icon={<BsClipboardData />} onClick={handleFloor} disabled>
					Data
				</MenuItem>
				<MenuItem icon={<AiOutlineDatabase />} onClick={handleFloor} disabled>
					Systems
				</MenuItem>
				<MenuItem icon={<TbNumbers />} onClick={handleFloor} disabled>
					Variables
				</MenuItem>
				<MenuItem icon={<FaArrowsAlt />} onClick={handleFloor} disabled>
					Collisions
				</MenuItem>
				<MenuItem icon={<FaRegKeyboard />} onClick={handleFloor} disabled>
					Keyboard
				</MenuItem>
				<MenuItem icon={<LuLanguages />} onClick={handleFloor} disabled>
					Languages
				</MenuItem>
				<MenuItem icon={<FaPlug />} onClick={handleFloor} disabled>
					Plugins
				</MenuItem>
				<MenuItem icon={<MdOutlineAddchart />} onClick={handleFloor} disabled>
					DLCs
				</MenuItem>
				<MenuItem separator></MenuItem>
				<MenuItem icon={<AiOutlinePicture />} onClick={handleFloor} disabled>
					Pictures
				</MenuItem>
				<MenuItem icon={<TfiVideoClapper />} onClick={handleFloor} disabled>
					Videos
				</MenuItem>
				<MenuItem icon={<BsMusicNote />} onClick={handleFloor} disabled>
					Songs
				</MenuItem>
				<MenuItem icon={<BiPyramid />} onClick={handleFloor} disabled>
					Shapes
				</MenuItem>
				<MenuItem icon={<AiOutlineFontSize />} onClick={handleFloor} disabled>
					Fonts
				</MenuItem>
				<MenuItem separator></MenuItem>
				<MenuItem icon={<MdAutoAwesomeMosaic />} onClick={handleFloor} disabled>
					Autotiles
				</MenuItem>
				<MenuItem icon={<GiBrickWall />} onClick={handleFloor} disabled>
					Walls
				</MenuItem>
				<MenuItem icon={<BiCube />} onClick={handleFloor} disabled>
					3D objects
				</MenuItem>
				<MenuItem icon={<FaMountain />} onClick={handleFloor} disabled>
					Mountains
				</MenuItem>
				<MenuItem separator></MenuItem>
				<MenuItem icon={<BsPlay />} onClick={handlePlay} disabled={!isProjectOpened()}>
					Play
				</MenuItem>
			</Menu>
		</div>
	);
}

export default Toolbar;
