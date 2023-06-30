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
import Menu from './menu/Menu';
import MenuItem from './menu/MenuItem';
import SubMenu from './menu/SubMenu';
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
import '../styles/MainMenuToolBar.css';

function MainMenuBar() {
	const [isDialogNewProjectOpen, setIsDialogNewProjectOpen] = React.useState(false);
	const [projectNames, setProjectNames] = React.useState<string[]>([]);
	const dispatch = useDispatch();
	const currentProjectName = useSelector((state: RootState) => state.projects.current);

	const isProjectOpened = () => {
		return currentProjectName !== '';
	};

	const loadProjects = async () => {
		let projects = await LocalFile.getFolders(Enum.LocalForage.Projects);
		setProjectNames(projects);
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
			handleSave();
			return false;
		}
	};

	const handleNewProject = () => {
		setIsDialogNewProjectOpen(true);
	};

	const handleAcceptNewProject = (data: Record<string, any>) => {
		loadProjects();
		handleOpenProject(data.projectName);
	};

	const handleRejectNewProject = () => {
		setIsDialogNewProjectOpen(false);
	};

	const handleOpenProject = async (name: string) => {
		Project.current = new Project(name);
		await Project.current.load();
		if (Scene.Map.current) {
			Scene.Map.current.close();
		}
		Scene.Map.current = new Scene.Map(1);
		await Scene.Map.current.load();
		dispatch(setCurrentProjectName(name));
	};

	const handleCloseProject = () => {
		if (Scene.Map.current) {
			Scene.Map.current.close();
			Scene.Map.current = null;
		}
		Project.current = null;
		dispatch(setCurrentProjectName(''));
	};

	const handleZoomIn = () => {
		if (Scene.Map.current) {
			Scene.Map.current.zoomIn();
		}
	};

	const handleZoomOut = () => {
		if (Scene.Map.current) {
			Scene.Map.current.zoomOut();
		}
	};

	const handleSave = async () => {
		if (Scene.Map.current) {
			await Scene.Map.current.save();
		}
	};

	const handlePlay = () => {
		window.open(window.location.origin + '/play/' + currentProjectName, '_blank')?.focus();
	};

	const handleFloor = () => {};

	useEffect(() => {
		loadProjects();
		window.addEventListener('keydown', keypress);
		return () => {
			window.removeEventListener('keydown', keypress);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<div className='flex-center-vertically'>
				<img className='main-menu-bar-logo' src={'./favicon.ico'} alt='logo' />
				<Menu horizontal>
					<SubMenu title='File'>
						<MenuItem icon={<AiOutlineFileAdd />} onClick={handleNewProject}>
							New Project...
						</MenuItem>
						<SubMenu icon={<AiOutlineFolderOpen />} title='Open existing project...'>
							{projectNames.map((name) => {
								return (
									<MenuItem key={'project-' + name} onClick={() => handleOpenProject(name)}>
										{name}
									</MenuItem>
								);
							})}
						</SubMenu>
						<MenuItem icon={<BiSave />} onClick={handleSave} disabled={!isProjectOpened()}>
							Save
						</MenuItem>
						<MenuItem icon={<MdClose />} onClick={handleCloseProject} disabled={!isProjectOpened()}>
							Close
						</MenuItem>
					</SubMenu>
					<SubMenu title='Edition'>
						<MenuItem icon={<AiOutlineZoomIn />} onClick={handleZoomIn} disabled={!isProjectOpened()}>
							Zoom in
						</MenuItem>
						<MenuItem icon={<AiOutlineZoomOut />} onClick={handleZoomOut} disabled={!isProjectOpened()}>
							Zoom out
						</MenuItem>
					</SubMenu>
					<SubMenu title='Management'></SubMenu>
					<SubMenu title='Special elements'></SubMenu>
					<SubMenu title='Options'></SubMenu>
					<SubMenu title='Display'></SubMenu>
					<SubMenu title='Test'>
						<MenuItem icon={<BsPlay />} onClick={handlePlay} disabled={!isProjectOpened()}>
							Play
						</MenuItem>
					</SubMenu>
					<SubMenu title='Help'></SubMenu>
				</Menu>
			</div>

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
					<MenuItem type='separator'></MenuItem>
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
					<MenuItem type='separator'></MenuItem>
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
					<MenuItem type='separator'></MenuItem>
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
					<MenuItem type='separator'></MenuItem>
					<MenuItem icon={<BsPlay />} onClick={handleFloor} disabled>
						Play
					</MenuItem>
				</Menu>
			</div>

			<DialogNewProject
				isOpen={isDialogNewProjectOpen}
				onAccept={handleAcceptNewProject}
				onReject={handleRejectNewProject}
			/>
		</>
	);
}

export default MainMenuBar;
