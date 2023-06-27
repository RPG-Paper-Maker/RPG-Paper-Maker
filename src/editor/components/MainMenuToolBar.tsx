/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setCurrentProjectName } from '../store';
import DialogNewProject from '../dialogs/DialogNewProject';
import Menu from './Menu';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import { LocalFile } from '../core/LocalFile';
import { Enum } from '../common/Enum';
import { Scene } from '../Editor';
import { Project } from '../core/Project';
import {
	AiOutlineFileAdd,
	AiOutlineFolderOpen,
	AiOutlineFolder,
	AiOutlineDatabase,
	AiOutlinePicture,
	AiOutlineFontSize,
	AiOutlineZoomIn,
	AiOutlineZoomOut,
} from 'react-icons/ai';
import { BiSave, BiPyramid, BiCube } from 'react-icons/bi';
import { LuSaveAll, LuLanguages } from 'react-icons/lu';
import { BsClipboardData, BsMusicNote, BsPlay } from 'react-icons/bs';
import { TbNumbers } from 'react-icons/tb';
import { FaArrowsAlt, FaRegKeyboard, FaPlug, FaMountain } from 'react-icons/fa';
import { MdOutlineAddchart, MdAutoAwesomeMosaic, MdClose } from 'react-icons/md';
import { TfiVideoClapper } from 'react-icons/tfi';
import { GiBrickWall } from 'react-icons/gi';
import 'rc-dialog/assets/index.css';
import '../styles/MainMenuToolBar.css';

function MainMenuBar() {
	const [dialog, setDialog] = React.useState(<React.Fragment></React.Fragment>);
	const [projectNames, setProjectNames] = React.useState<string[]>([]);
	const dispatch = useDispatch();
	const currentProjectName = useSelector((state: RootState) => state.projects.current);

	const loadProjects = async () => {
		let projects = await LocalFile.getFolders(Enum.LocalForage.Projects);
		setProjectNames(projects);
	};

	const handleNewProject = () => {
		let dialog = (
			<DialogNewProject
				setDialog={setDialog}
				onAccept={(data: Record<string, any>) => {
					loadProjects();
					openProject(data.projectName);
				}}
			/>
		);
		setDialog(dialog);
	};

	const openProject = async (name: string) => {
		Project.current = new Project(name);
		await Project.current.load();
		if (Scene.Map.current) {
			Scene.Map.current.close();
		}
		Scene.Map.current = new Scene.Map(1);
		await Scene.Map.current.load();
		dispatch(setCurrentProjectName(name));
	};

	const closeProject = () => {
		if (Scene.Map.current) {
			Scene.Map.current.close();
			Scene.Map.current = null;
		}
		Project.current = null;
		dispatch(setCurrentProjectName(''));
	};

	const zoomIn = () => {
		if (Scene.Map.current) {
			Scene.Map.current.zoomIn();
		}
	};

	const zoomOut = () => {
		if (Scene.Map.current) {
			Scene.Map.current.zoomOut();
		}
	};

	const save = async () => {
		if (Scene.Map.current) {
			await Scene.Map.current.save();
		}
	};

	const play = () => {
		window.open(window.location.origin + '/play/' + currentProjectName, '_blank')?.focus();
	};

	const isProjectOpened = () => {
		return currentProjectName !== '';
	};

	const keypress = (event: KeyboardEvent) => {
		const states = {
			alt: event.altKey,
			ctrl: event.ctrlKey,
			meta: event.metaKey,
			shift: event.shiftKey,
		};
		//const key = event.key;
		const code = event.code;
		if (states.ctrl && code === 'KeyS' && !isProjectOpened()) {
			event.preventDefault();
			save();
			return false;
		}
	};

	const handleFloor = () => {};

	useEffect(() => {
		loadProjects();
		window.addEventListener('keydown', keypress);
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<div className='flex-center-vertically'>
				<img className='main-menu-bar-logo' src={'./favicon.ico'} alt='logo' />
				<Menu mode='horizontal'>
					<SubMenu title='File'>
						<MenuItem icon={<AiOutlineFileAdd />} onClick={handleNewProject}>
							New Project...
						</MenuItem>
						<SubMenu icon={<AiOutlineFolderOpen />} title='Open existing project...'>
							{projectNames.map((name) => {
								return (
									<MenuItem
										key={'project-' + name}
										onClick={() => {
											openProject(name);
										}}
									>
										{name}
									</MenuItem>
								);
							})}
						</SubMenu>
						<MenuItem icon={<BiSave />} onClick={save} disabled={!isProjectOpened()}>
							Save
						</MenuItem>
						<MenuItem icon={<MdClose />} onClick={closeProject} disabled={!isProjectOpened()}>
							Close
						</MenuItem>
					</SubMenu>
					<SubMenu title='Edition'>
						<MenuItem icon={<AiOutlineZoomIn />} onClick={zoomIn} disabled={!isProjectOpened()}>
							Zoom in
						</MenuItem>
						<MenuItem icon={<AiOutlineZoomOut />} onClick={zoomOut} disabled={!isProjectOpened()}>
							Zoom out
						</MenuItem>
					</SubMenu>
					<SubMenu title='Management'></SubMenu>
					<SubMenu title='Special elements'></SubMenu>
					<SubMenu title='Options'></SubMenu>
					<SubMenu title='Display'></SubMenu>
					<SubMenu title='Test'>
						<MenuItem icon={<BsPlay />} onClick={play} disabled={!isProjectOpened()}>
							Play
						</MenuItem>
					</SubMenu>
					<SubMenu title='Help'></SubMenu>
				</Menu>
				{dialog}
			</div>

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
		</>
	);
}

export default MainMenuBar;
