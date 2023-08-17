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
	setOpenLoading,
	setUndoRedoIndex,
	triggerImportProject,
	triggerNewProject,
	triggerOpenProject,
	triggerPlay,
	triggerSave,
	triggerTreeMap,
} from '../store';
import DialogNewProject from './dialogs/DialogNewProject';
import Menu from './Menu';
import MenuItem from './MenuItem';
import MenuSub from './MenuSub';
import { LocalFile } from '../core/LocalFile';
import { Manager, Scene } from '../Editor';
import { Project } from '../core/Project';
import { AiOutlineFileAdd, AiOutlineFolderOpen, AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import { BiSave, BiExport, BiImport } from 'react-icons/bi';
import { BsPlay } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import { IoIosUndo, IoIosRedo } from 'react-icons/io';
import { Paths } from '../common/Paths';
import Dialog from './dialogs/Dialog';
import FooterYesNo from './dialogs/footers/FooterYesNo';
import Toolbar from './Toolbar';
import '../styles/MainMenu.css';
import { LocalForage } from '../common/Enum';

function MainMenuBar() {
	const [isDialogNewProjectOpen, setIsDialogNewProjectOpen] = useState(false);
	const [isDialogWarningImportOpen, setIsDialogWarningImportOpen] = useState(false);

	const importFileInputRef = useRef<HTMLInputElement>(null);

	const dispatch = useDispatch();

	const currentTreeMapTag = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag);
	const currentProjectName = useSelector((state: RootState) => state.projects.current);
	const triggers = useSelector((state: RootState) => state.triggers.mainBar);
	const projectNames = useSelector((state: RootState) => state.projects.list).map(({ name, location }) => name);
	const undoRedoIndex = useSelector((state: RootState) => state.mapEditor.undoRedo.index);
	const undoRedoLength = useSelector((state: RootState) => state.mapEditor.undoRedo.length);

	const isProjectOpened = currentProjectName !== '';
	const isInMap = isProjectOpened && !!Scene.Map.current;

	const canUndo = () => isInMap && undoRedoIndex > -1;

	const canRedo = () => isInMap && undoRedoIndex < undoRedoLength - 1;

	const handleKeyDown = async (event: KeyboardEvent) => {
		if (isProjectOpened) {
			const states = {
				alt: event.altKey,
				ctrl: event.ctrlKey,
				meta: event.metaKey,
				shift: event.shiftKey,
			};
			const key = event.key.toUpperCase();
			if (states.ctrl && key === 'S' && isInMap) {
				event.preventDefault();
				await handleSave();
				return false;
			} else if (states.ctrl && states.shift && key === 'Z' && canRedo()) {
				event.preventDefault();
				handleRedo();
				return false;
			} else if (states.ctrl && !states.shift && key === 'Z' && canUndo()) {
				event.preventDefault();
				handleUndo();
				return false;
			}
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
		dispatch(setOpenLoading(true));
		dispatch(setCurrentProjectName(name));
		Project.current = new Project(name);
		await Project.current.load();
		dispatch(setOpenLoading(false));
	};

	const handleSave = async () => {
		if (currentTreeMapTag) {
			await currentTreeMapTag.saveFiles();
			Project.current?.treeMaps.save();
			dispatch(triggerTreeMap());
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

	const handleUndo = () => {
		Manager.UndoRedo.undo();
		dispatch(setUndoRedoIndex(undoRedoIndex - 1));
	};

	const handleRedo = () => {
		Manager.UndoRedo.redo();
		dispatch(setUndoRedoIndex(undoRedoIndex + 1));
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
		} else if (triggers.save) {
			dispatch(triggerSave(false));
			handleSave();
		} else if (triggers.play) {
			dispatch(triggerPlay(false));
			handlePlay();
		}
	});

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
		// eslint-disable-next-line
	});

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
						<MenuItem icon={<BiSave />} onClick={handleSave} disabled={isInMap}>
							Save
						</MenuItem>
						<MenuItem icon={<MdClose />} onClick={handleCloseProject} disabled={!isProjectOpened}>
							Close
						</MenuItem>
						<MenuItem icon={<BiExport />} onClick={handleExport} disabled={!isProjectOpened}>
							Export project
						</MenuItem>
					</MenuSub>
					<MenuSub title='Edition'>
						<MenuItem icon={<IoIosUndo />} onClick={handleUndo} disabled={!canUndo()}>
							Undo
						</MenuItem>
						<MenuItem icon={<IoIosRedo />} onClick={handleRedo} disabled={!canRedo()}>
							Redo
						</MenuItem>
						<MenuItem icon={<AiOutlineZoomIn />} onClick={handleZoomIn} disabled={isInMap}>
							Zoom in
						</MenuItem>
						<MenuItem icon={<AiOutlineZoomOut />} onClick={handleZoomOut} disabled={isInMap}>
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
						<MenuItem icon={<BsPlay />} onClick={handlePlay} disabled={!isProjectOpened}>
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
