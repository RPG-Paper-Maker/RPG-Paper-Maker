/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

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
	clearProjects,
	setCurrentProjectName,
	setLoading,
	setOpenLoading,
	setProjectMenuIndex,
	setUndoRedoIndex,
	triggerImportProject,
	triggerNewProject,
	triggerOpenProject,
	triggerPlay,
	triggerSave,
	triggerSaveAll,
	triggerTreeMap,
} from '../store';
import DialogNewProject from './dialogs/DialogNewProject';
import Menu from './Menu';
import MenuItem from './MenuItem';
import { Manager, Scene } from '../Editor';
import {
	AiOutlineArrowDown,
	AiOutlineArrowUp,
	AiOutlineClear,
	AiOutlineFileAdd,
	AiOutlineFolderOpen,
	AiOutlineZoomIn,
	AiOutlineZoomOut,
} from 'react-icons/ai';
import { BiSave, BiExport, BiImport } from 'react-icons/bi';
import { BsPlay } from 'react-icons/bs';
import { MdClose, MdOutlineWallpaper } from 'react-icons/md';
import { IoIosUndo, IoIosRedo, IoMdArrowBack } from 'react-icons/io';
import { FiMap } from 'react-icons/fi';
import Toolbar from './Toolbar';
import '../styles/MainMenu.css';
import { RxHamburgerMenu } from 'react-icons/rx';
import { LuFolders, LuSaveAll } from 'react-icons/lu';
import Loader from './Loader';
import FooterCancelNoYes from './dialogs/footers/FooterCancelNoYes';
import { KEY, SPECIAL_KEY, LOCAL_FORAGE, Paths, MenuItemType } from '../common';
import { LocalFile, Project } from '../core';
import Dialog from './dialogs/Dialog';
import FooterNoYes from './dialogs/footers/FooterNoYes';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import FooterOK from './dialogs/footers/FooterOK';
import MenuCustom from './MenuCustom';

function MainMenuBar() {
	const [isDialogNewProjectOpen, setIsDialogNewProjectOpen] = useState(false);
	const [isDialogWarningProjectVersionOpen, setIsDialogWarningProjectVersionOpen] = useState(false);
	const [isDialogWarningImportOpen, setIsDialogWarningImportOpen] = useState(false);
	const [isDialogWarningClearAllCacheOpen, setIsDialogWarningClearAllCacheOpen] = useState(false);
	const [isDialogWarningSavePlayOpen, setIsDialogSavePlayOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
	const [hamburgerStates, setHamburgerStates] = useState<number[]>([]);

	const importFileInputRef = useRef<HTMLInputElement>(null);

	const dispatch = useDispatch();

	const currentTreeMapTag = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag);
	const currentProjectName = useSelector((state: RootState) => state.projects.current);
	const triggers = useSelector((state: RootState) => state.triggers.mainBar);
	const projectNames = useSelector((state: RootState) => state.projects.list).map(({ name, location }) => name);
	const undoRedoIndex = useSelector((state: RootState) => state.mapEditor.undoRedo.index);
	const undoRedoLength = useSelector((state: RootState) => state.mapEditor.undoRedo.length);
	const projectMenuIndex = useSelector((state: RootState) => state.projects.menuIndex);
	useSelector((state: RootState) => state.triggers.treeMap); // Force to check can save all

	const isProjectOpened = currentProjectName !== '';

	const isInMap = isProjectOpened && currentTreeMapTag !== null;

	const canUndo = isInMap && undoRedoIndex > -1;

	const canRedo = isInMap && undoRedoIndex < undoRedoLength - 1;

	const canSave = isInMap && !currentTreeMapTag.saved;

	const canSaveAll = isProjectOpened && !Project.current?.treeMaps.isAllMapsSaved();

	const updateProjectMenuIndex = async (index: number) => {
		dispatch(setProjectMenuIndex(index));
		Project.current!.settings.projectMenuIndex = index;
		await Project.current!.settings.save();
	};

	const handleNewProject = async () => {
		setIsDialogNewProjectOpen(true);
	};

	const handleAcceptNewProject = async (data: Record<string, any>) => {
		dispatch(addProject({ name: data.projectName, location: '' }));
		setIsDialogNewProjectOpen(false);
		await handleOpenProject(data.projectName);
	};

	const handleRejectNewProject = async () => {
		setIsDialogNewProjectOpen(false);
	};

	const handleOpenProject = async (name: string) => {
		dispatch(setOpenLoading(true));
		Project.current = new Project(name);
		await Project.current.load();
		if (Project.current.settings.projectVersion !== Project.VERSION) {
			setIsDialogWarningProjectVersionOpen(true);
			Project.current = null;
		} else {
			dispatch(setCurrentProjectName(name));
		}
		dispatch(setOpenLoading(false));
	};

	const handleCloseWarningProjectVersionOpen = () => {
		setIsDialogWarningProjectVersionOpen(false);
	};

	const handleSave = async () => {
		if (currentTreeMapTag) {
			await currentTreeMapTag.saveFiles();
			Project.current?.treeMaps.save();
			dispatch(triggerTreeMap());
		}
	};

	const handleSaveAll = async () => {
		if (Project.current) {
			await Project.current?.treeMaps.saveAllTags();
			dispatch(triggerTreeMap());
		}
	};

	const handleImport = async () => {
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
			await LocalFile.loadZip(file, LOCAL_FORAGE.PROJECTS);
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
		await LocalFile.removeFolder(Paths.join(LOCAL_FORAGE.PROJECTS, projectName));
		await LocalFile.loadZip(file, LOCAL_FORAGE.PROJECTS);
		dispatch(addProject({ name: projectName, location: '' }));
		await handleOpenProject(projectName);
	};

	const handleRejectImport = async () => {
		setIsDialogWarningImportOpen(false);
		if (importFileInputRef.current) {
			importFileInputRef.current.value = '';
		}
	};

	const handleExport = async () => {
		await LocalFile.downloadZip(Paths.join(LOCAL_FORAGE.PROJECTS, currentProjectName));
	};

	const handleCloseProject = async () => {
		if (Scene.Map.current) {
			Scene.Map.current.close();
			Scene.Map.current = null;
		}
		Project.current = null;
		dispatch(setCurrentProjectName(''));
	};

	const handleClearAllCache = async () => {
		setIsDialogWarningClearAllCacheOpen(true);
	};

	const handleRejectClearAllCache = async () => {
		setIsDialogWarningClearAllCacheOpen(false);
	};

	const handleAcceptClearAllCache = async () => {
		setIsLoading(true);
		await handleCloseProject();
		dispatch(clearProjects());
		const all = await LocalFile.allStorage();
		for (const path of all) {
			await LocalFile.brutRemove(path);
		}
		setIsDialogWarningClearAllCacheOpen(false);
		setIsLoading(false);
	};

	const handleUndo = async () => {
		const update = await Manager.UndoRedo.undo();
		if (update) {
			dispatch(setUndoRedoIndex(undoRedoIndex - 1));
		}
	};

	const handleRedo = async () => {
		const update = await Manager.UndoRedo.redo();
		if (update) {
			dispatch(setUndoRedoIndex(undoRedoIndex + 1));
		}
	};

	const handleMoveCursorSquareUp = async () => {
		Scene.Map.current!.loading = true;
		await Scene.Map.current!.moveCursorSquareUp();
		Scene.Map.current!.loading = false;
	};

	const handleMoveCursorPixelUp = async () => {
		await Scene.Map.current!.moveCursorPixelUp();
	};

	const handleMoveCursorSquareDown = async () => {
		Scene.Map.current!.loading = true;
		await Scene.Map.current!.moveCursorSquareDown();
		Scene.Map.current!.loading = false;
	};

	const handleMoveCursorPixelDown = async () => {
		await Scene.Map.current!.moveCursorPixelDown();
	};

	const handleZoomIn = async () => {
		Scene.Map.current!.zoomIn();
	};

	const handleZoomOut = async () => {
		Scene.Map.current!.zoomOut();
	};

	const getPlayURL = () => window.location.pathname + '?project=' + currentProjectName;

	const play = () => window.open(getPlayURL(), '_blank');

	const handlePlay = async () => {
		if (canSaveAll) {
			setIsDialogSavePlayOpen(true);
		} else {
			play();
		}
	};

	const handleCancelSavePlay = async () => {
		setIsDialogSavePlayOpen(false);
	};

	const handleRejectSavePlay = async () => {
		setIsDialogSavePlayOpen(false);
		play();
	};

	const handleAcceptSavePlay = async () => {
		const w = window.open('', '_blank');
		setIsLoading(true);
		await handleSaveAll();
		setIsLoading(false);
		setIsDialogSavePlayOpen(false);
		if (w) {
			w.location = getPlayURL();
			w.focus();
		}
	};

	const handleClickHamburgerBack = () => {
		setHamburgerStates((value) => {
			const newList = [...value];
			newList.pop();
			return newList;
		});
	};

	const handleClickHamburger = () => {
		setIsHamburgerOpen((value) => !value);
		setHamburgerStates([]);
	};

	const items: MenuItemType[] = [
		{
			title: 'File',
			children: [
				{
					title: 'New Project...',
					icon: <AiOutlineFileAdd />,
					onClick: handleNewProject,
					shortcut: [SPECIAL_KEY.CTRL, SPECIAL_KEY.ALT, KEY.N],
				},
				{
					title: 'Open existing project...',
					icon: <AiOutlineFolderOpen />,
					children: projectNames.map((name) => ({ title: name, onClick: () => handleOpenProject(name) })),
				},
				{
					title: (
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
					),
					icon: <BiImport />,
					onClick: handleImport,
					shortcut: [SPECIAL_KEY.CTRL, KEY.I],
				},
				{
					title: 'Export project',
					icon: <BiExport />,
					disabled: !isProjectOpened,
					onClick: handleExport,
					shortcut: [SPECIAL_KEY.CTRL, KEY.E],
				},
				{
					title: 'Save',
					icon: <BiSave />,
					disabled: !canSave,
					onClick: handleSave,
					shortcut: [SPECIAL_KEY.CTRL, KEY.S],
				},
				{
					title: 'Save all',
					icon: <LuSaveAll />,
					disabled: !canSaveAll,
					onClick: handleSaveAll,
					shortcut: [SPECIAL_KEY.CTRL, SPECIAL_KEY.SHIFT, KEY.S],
				},
				{
					title: 'Close',
					icon: <MdClose />,
					disabled: !isProjectOpened,
					onClick: handleCloseProject,
					shortcut: [SPECIAL_KEY.CTRL, KEY.Q],
				},
				{
					title: 'Clear all cache',
					icon: <AiOutlineClear />,
					onClick: handleClearAllCache,
				},
			],
		},
		{
			title: 'Edition',
			children: [
				{
					title: 'Undo',
					icon: <IoIosUndo />,
					disabled: !canUndo,
					onClick: handleUndo,
					shortcut: [SPECIAL_KEY.CTRL, KEY.Z],
				},
				{
					title: 'Redo',
					icon: <IoIosRedo />,
					disabled: !canRedo,
					onClick: handleRedo,
					shortcut: [SPECIAL_KEY.CTRL, SPECIAL_KEY.SHIFT, KEY.Z],
				},
				{
					title: 'Move cursor square up',
					icon: <FaArrowUp />,
					disabled: !isInMap,
					onClick: handleMoveCursorSquareUp,
					shortcut: [SPECIAL_KEY.CTRL, KEY.UP],
				},
				{
					title: 'Move cursor pixel up',
					icon: <AiOutlineArrowUp />,
					disabled: !isInMap,
					onClick: handleMoveCursorPixelUp,
					shortcut: [SPECIAL_KEY.CTRL, SPECIAL_KEY.SHIFT, KEY.UP],
				},
				{
					title: 'Move cursor square down',
					icon: <FaArrowDown />,
					disabled: !isInMap,
					onClick: handleMoveCursorSquareDown,
					shortcut: [SPECIAL_KEY.CTRL, KEY.DOWN],
				},
				{
					title: 'Move cursor pixel down',
					icon: <AiOutlineArrowDown />,
					disabled: !isInMap,
					onClick: handleMoveCursorPixelDown,
					shortcut: [SPECIAL_KEY.CTRL, SPECIAL_KEY.SHIFT, KEY.DOWN],
				},
				{
					title: 'Zoom in',
					icon: <AiOutlineZoomIn />,
					disabled: !isInMap,
					onClick: handleZoomIn,
					shortcut: [SPECIAL_KEY.SHIFT, KEY.UP],
				},
				{
					title: 'Zoom out',
					icon: <AiOutlineZoomOut />,
					disabled: !isInMap,
					onClick: handleZoomOut,
					shortcut: [SPECIAL_KEY.SHIFT, KEY.DOWN],
				},
			],
		},
		{
			title: 'Management',
			disabled: true,
		},
		{
			title: 'Special elements',
			disabled: true,
		},
		{
			title: 'Options',
			disabled: true,
		},
		{
			title: 'Display',
			disabled: true,
		},
		{
			title: 'Test',
			children: [
				{
					title: 'Play',
					icon: <BsPlay />,
					disabled: !isProjectOpened,
					onClick: handlePlay,
					shortcut: [KEY.P],
				},
			],
		},
		{
			title: 'Help',
			disabled: true,
		},
	];

	// Triggers handling
	useEffect(() => {
		if (triggers.newProject) {
			dispatch(triggerNewProject(false));
			handleNewProject().catch(console.error);
		} else if (triggers.importProject) {
			dispatch(triggerImportProject(false));
			handleImport().catch(console.error);
		} else if (triggers.openProject) {
			dispatch(triggerOpenProject(''));
			handleOpenProject(triggers.openProject).catch(console.error);
		} else if (triggers.save) {
			dispatch(triggerSave(false));
			handleSave().catch(console.error);
		} else if (triggers.saveAll) {
			dispatch(triggerSaveAll(false));
			handleSaveAll().catch(console.error);
		} else if (triggers.play) {
			dispatch(triggerPlay(false));
			handlePlay().catch(console.error);
		}
	});

	const getMenuHamburger = () => {
		let list = items;
		for (const state of hamburgerStates) {
			const { children } = list[state];
			if (children) {
				list = children;
			}
		}
		return (
			<Menu>
				{list.map((item: any, index: number) => {
					const handleClick = () => {
						if (item.onClick) {
							item.onClick();
							setIsHamburgerOpen(false);
							setHamburgerStates([]);
						} else {
							setHamburgerStates((value) => [...value, index]);
						}
					};
					return (
						<MenuItem key={index} icon={item.icon} disabled={item.disabled} onClick={handleClick}>
							{item.title}
						</MenuItem>
					);
				})}
			</Menu>
		);
	};

	return (
		<>
			<div className='flex-center-vertically'>
				<img className='main-menu-bar-logo' src={'./favicon.ico'} alt='logo' />
				{isProjectOpened && (
					<div className='mobile-only'>
						<Menu
							horizontal
							isActivable
							activeIndex={projectMenuIndex}
							setActiveIndex={updateProjectMenuIndex}
						>
							<MenuItem icon={<LuFolders />}></MenuItem>
							<MenuItem icon={<MdOutlineWallpaper />}></MenuItem>
							<MenuItem icon={<FiMap />}></MenuItem>
						</Menu>
					</div>
				)}
				<div className='mobile-hidden'>
					<MenuCustom items={items} horizontal />
				</div>
				<div className='flex-one' />
				{hamburgerStates.length > 0 && (
					<div className='main-menu-hamburger' onClick={handleClickHamburgerBack}>
						<IoMdArrowBack />
					</div>
				)}
				<div className='main-menu-hamburger' onClick={handleClickHamburger}>
					<RxHamburgerMenu />
				</div>
				{isHamburgerOpen && (
					<div className='relative'>
						<div className='main-menu-hamburger-open menu-sub-content'>{getMenuHamburger()}</div>
					</div>
				)}
			</div>
			<Toolbar />
			<DialogNewProject
				isOpen={isDialogNewProjectOpen}
				onAccept={handleAcceptNewProject}
				onReject={handleRejectNewProject}
			/>
			<Dialog
				title='Warning'
				isOpen={isDialogWarningProjectVersionOpen}
				footer={<FooterOK onOK={handleCloseWarningProjectVersionOpen} />}
				onClose={handleCloseWarningProjectVersionOpen}
			>
				<p>
					This project version is from a previous version. Retro versions compatibility is not handled yet for
					this proto web version. Please create a new project.
				</p>
			</Dialog>
			<Dialog
				title='Warning'
				isOpen={isDialogWarningImportOpen}
				footer={<FooterNoYes onNo={handleRejectImport} onYes={handleAcceptImport} />}
				onClose={handleRejectImport}
			>
				<p>This project name already exists. Would you like to replace it?</p>
			</Dialog>
			<Dialog
				title='Warning'
				isOpen={isDialogWarningClearAllCacheOpen}
				footer={<FooterNoYes onNo={handleRejectClearAllCache} onYes={handleAcceptClearAllCache} />}
				onClose={handleRejectClearAllCache}
			>
				<Loader isLoading={isLoading} />
				<div className='warning text-center'>
					This action will delete all your projects, and every settings you changed. Are you sure that you
					want to continue?
				</div>
			</Dialog>
			<Dialog
				title='Warning'
				isOpen={isDialogWarningSavePlayOpen}
				footer={
					<FooterCancelNoYes
						onCancel={handleCancelSavePlay}
						onNo={handleRejectSavePlay}
						onYes={handleAcceptSavePlay}
					/>
				}
				onClose={handleRejectSavePlay}
			>
				<Loader isLoading={isLoading} />
				<div className='text-center'>You have some maps that are not saved. Do you want to save all?</div>
			</Dialog>
		</>
	);
}

export default MainMenuBar;
