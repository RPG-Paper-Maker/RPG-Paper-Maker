/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	RootState,
	addProject,
	setCurrentProjectName,
	setLoading,
	triggerImportProject,
	triggerNewProject,
	triggerOpenProject,
	triggerPlay,
} from '../store';
import DialogNewProject from './dialogs/DialogNewProject';
import Menu from './Menu';
import MenuItem from './MenuItem';
import MenuSub from './MenuSub';
import { LocalFile } from '../core/LocalFile';
import { Scene } from '../Editor';
import { Project } from '../core/Project';
import { AiOutlineFileAdd, AiOutlineFolderOpen, AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import { BiSave, BiExport, BiImport } from 'react-icons/bi';
import { BsPlay } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import { Paths } from '../common/Paths';
import Dialog from './dialogs/Dialog';
import FooterYesNo from './dialogs/footers/FooterYesNo';
import Toolbar from './Toolbar';
import '../styles/MainMenu.css';
import { LocalForage } from '../common/Enum';

function MainMenuBar() {
	const [isDialogNewProjectOpen, setIsDialogNewProjectOpen] = useState(false);
	const [isDialogWarningImportOpen, setIsDialogWarningImportOpen] = useState(false);
	const dispatch = useDispatch();
	const currentProjectName = useSelector((state: RootState) => state.projects.current);
	const triggers = useSelector((state: RootState) => state.triggers.mainBar);
	const projectNames = useSelector((state: RootState) => state.projects.list).map(({ name, location }) => name);
	const importFileInputRef = useRef<HTMLInputElement>(null);

	const isProjectOpened = () => {
		return currentProjectName !== '';
	};

	const keypress = async (event: KeyboardEvent) => {
		const states = {
			alt: event.altKey,
			ctrl: event.ctrlKey,
			meta: event.metaKey,
			shift: event.shiftKey,
		};
		const code = event.code;
		if (states.ctrl && code === 'KeyS' && !isProjectOpened()) {
			event.preventDefault();
			await handleSave();
			return false;
		}
	};

	const handleNewProject = () => {
		setIsDialogNewProjectOpen(true);
	};

	const handleAcceptNewProject = async (data: Record<string, any>) => {
		dispatch(addProject({ name: data.projectName, location: '' }));
		setIsDialogNewProjectOpen(false);
		await handleOpenProject(data.projectName);
	};

	const handleRejectNewProject = () => {
		setIsDialogNewProjectOpen(false);
	};

	const handleOpenProject = async (name: string) => {
		dispatch(setLoading(true));
		dispatch(setCurrentProjectName(name));
		Project.current = new Project(name);
		await Project.current.load();
		if (Scene.Map.current) {
			Scene.Map.current.close();
		}
		Scene.Map.current = new Scene.Map(1);
		await Scene.Map.current.load();
		dispatch(setLoading(false));
	};

	const handleSave = async () => {
		if (Scene.Map.current) {
			await Scene.Map.current.save();
		}
	};

	const handleImport = () => {
		importFileInputRef.current?.click();
	};

	const handleImportFileChange = async () => {
		if (!importFileInputRef.current) {
			return;
		}
		const file = Array.from(importFileInputRef.current.files || [])[0];
		const projectName = file.name.substring(0, file.name.length - 4);
		if (projectNames.indexOf(projectName) === -1) {
			importFileInputRef.current.value = '';
			dispatch(setLoading(true));
			await LocalFile.loadZip(file, LocalForage.Projects);
			dispatch(addProject({ name: projectName, location: '' }));
			await handleOpenProject(projectName);
		} else {
			setIsDialogWarningImportOpen(true);
		}
	};

	const handleAcceptImport = async () => {
		if (!importFileInputRef.current) {
			return;
		}
		setIsDialogWarningImportOpen(false);
		dispatch(setLoading(true));
		const file = Array.from(importFileInputRef.current.files || [])[0];
		importFileInputRef.current.value = '';
		const projectName = file.name.substring(0, file.name.length - 4);
		await LocalFile.removeFolder(Paths.join(LocalForage.Projects, projectName));
		await LocalFile.loadZip(file, LocalForage.Projects);
		dispatch(addProject({ name: projectName, location: '' }));
		await handleOpenProject(projectName);
	};

	const handleRejectImport = () => {
		setIsDialogWarningImportOpen(false);
		if (importFileInputRef.current) {
			importFileInputRef.current.value = '';
		}
	};

	const handleExport = async () => {
		await LocalFile.downloadZip(Paths.join(LocalForage.Projects, currentProjectName));
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

	const handlePlay = () => {
		window.open(window.location.origin + '/play/' + currentProjectName, '_blank')?.focus();
	};

	// Triggers handling
	useEffect(() => {
		if (triggers.newProject) {
			dispatch(triggerNewProject(false));
			handleNewProject();
		} else if (triggers.importProject) {
			dispatch(triggerImportProject(false));
			handleImport();
		} else if (triggers.openProject) {
			dispatch(triggerOpenProject(''));
			handleOpenProject(triggers.openProject).catch(console.error);
		} else if (triggers.play) {
			dispatch(triggerPlay(false));
			handlePlay();
		}
	});

	useEffect(() => {
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
					<MenuSub title='File'>
						<MenuItem icon={<AiOutlineFileAdd />} onClick={handleNewProject}>
							New Project...
						</MenuItem>
						<MenuSub icon={<AiOutlineFolderOpen />} title='Open existing project...'>
							{projectNames.map((name) => {
								return (
									<MenuItem key={'project-' + name} onClick={() => handleOpenProject(name)}>
										{name}
									</MenuItem>
								);
							})}
						</MenuSub>
						<MenuItem icon={<BiImport />} onClick={handleImport}>
							<>
								Import project...
								<input
									ref={importFileInputRef}
									type='file'
									hidden
									onChange={handleImportFileChange}
									accept='.zip'
								/>
							</>
						</MenuItem>
						<MenuItem icon={<BiSave />} onClick={handleSave} disabled={!isProjectOpened()}>
							Save
						</MenuItem>
						<MenuItem icon={<MdClose />} onClick={handleCloseProject} disabled={!isProjectOpened()}>
							Close
						</MenuItem>
						<MenuItem icon={<BiExport />} onClick={handleExport} disabled={!isProjectOpened()}>
							Export project
						</MenuItem>
					</MenuSub>
					<MenuSub title='Edition'>
						<MenuItem icon={<AiOutlineZoomIn />} onClick={handleZoomIn} disabled={!isProjectOpened()}>
							Zoom in
						</MenuItem>
						<MenuItem icon={<AiOutlineZoomOut />} onClick={handleZoomOut} disabled={!isProjectOpened()}>
							Zoom out
						</MenuItem>
					</MenuSub>
					<MenuSub title='Management' disabled>
						<MenuItem>Coming soon...</MenuItem>
					</MenuSub>
					<MenuSub title='Special elements' disabled>
						<MenuItem>Coming soon...</MenuItem>
					</MenuSub>
					<MenuSub title='Options' disabled>
						<MenuItem>Coming soon...</MenuItem>
					</MenuSub>
					<MenuSub title='Display' disabled>
						<MenuItem>Coming soon...</MenuItem>
					</MenuSub>
					<MenuSub title='Test'>
						<MenuItem icon={<BsPlay />} onClick={handlePlay} disabled={!isProjectOpened()}>
							Play
						</MenuItem>
					</MenuSub>
					<MenuSub title='Help' disabled>
						<MenuItem>Coming soon...</MenuItem>
					</MenuSub>
				</Menu>
			</div>

			<Toolbar />

			<DialogNewProject
				isOpen={isDialogNewProjectOpen}
				onAccept={handleAcceptNewProject}
				onReject={handleRejectNewProject}
			/>

			<Dialog
				title='Warning'
				isOpen={isDialogWarningImportOpen}
				footer={<FooterYesNo onNo={handleRejectImport} onYes={handleAcceptImport} />}
				onClose={handleRejectImport}
			>
				<p>This project name already exists. Would you like to replace it?</p>
			</Dialog>
		</>
	);
}

export default MainMenuBar;
