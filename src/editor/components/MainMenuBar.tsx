/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState, useEffect, useRef, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	RootState,
	clearProjects,
	setCurrentProject,
	setCurrentTreeMapTag,
	setLoading,
	setNeedsReloadPageClearCache,
	setOpenLoading,
	setProjectMenuIndex,
	setProjects,
	setUndoRedoIndex,
	triggerImportProject,
	triggerNewProject,
	triggerOpenDialogProject,
	triggerOpenProject,
	triggerPlay,
	triggerSave,
	triggerSaveAll,
	triggerTreeMap,
	triggerVariables,
} from '../store';
import DialogNewProject from './dialogs/DialogNewProject';
import Menu from './Menu';
import MenuItem from './MenuItem';
import { Data, Manager, Model, Scene } from '../Editor';
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
import { KEY, SPECIAL_KEY, Paths, MenuItemType, Utils, Constants, IO, EXTENSION_KIND, BUTTON_TYPE } from '../common';
import { LocalFile, Project } from '../core';
import Dialog from './dialogs/Dialog';
import FooterNoYes from './dialogs/footers/FooterNoYes';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import FooterOK from './dialogs/footers/FooterOK';
import MenuCustom from './MenuCustom';
import { EngineSettings } from '../data/EngineSettings';
import { Platform } from '../common/Platform';
import Button from './Button';
import { VscChromeClose, VscChromeMaximize, VscChromeMinimize, VscChromeRestore } from 'react-icons/vsc';
import { useTranslation } from 'react-i18next';
import DialogChangeLanguage from './dialogs/DialogChangeLanguage';
import { TbNumbers } from 'react-icons/tb';
import DialogVariables from './dialogs/DialogVariables';

function MainMenuBar() {
	const { t } = useTranslation();

	const [needDialogNewProjectOpen, setNeedDialogNewProjectOpen] = useState(false);
	const [needDialogVariablesOpen, setNeedDialogVariablesOpen] = useState(false);
	const [needDialogChangeLanguageOpen, setNeedDialogChangeLanguageOpen] = useState(false);
	const [isDialogWarningProjectVersionOpen, setIsDialogWarningProjectVersionOpen] = useState(false);
	const [isDialogWarningImportOpen, setIsDialogWarningImportOpen] = useState(false);
	const [isDialogWarningProjectLocationExist, setIsDialogWarningProjectLocationExist] = useState(false);
	const [isDialogWarningClearAllCacheOpen, setIsDialogWarningClearAllCacheOpen] = useState(false);
	const [isDialogWarningSavePlayOpen, setIsDialogSavePlayOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
	const [hamburgerStates, setHamburgerStates] = useState<number[]>([]);
	const [isMaximized, setIsMaximized] = useState(true);

	const importFileInputRef = useRef<HTMLInputElement>(null);

	const dispatch = useDispatch();

	const currentTreeMapTag = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag);
	const currentProject = useSelector((state: RootState) => state.projects.current);
	const triggers = useSelector((state: RootState) => state.triggers.mainBar);
	const projects = useSelector((state: RootState) => state.projects.list);
	const undoRedoIndex = useSelector((state: RootState) => state.mapEditor.undoRedo.index);
	const undoRedoLength = useSelector((state: RootState) => state.mapEditor.undoRedo.length);
	const projectMenuIndex = useSelector((state: RootState) => state.projects.menuIndex);
	useSelector((state: RootState) => state.triggers.treeMap); // Force to check can save all

	const isProjectOpened = currentProject !== null;

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

	const addProject = async (project: Model.ProjectPreview) => {
		let newList = projects.filter((p) => project.location !== p.location);
		newList = [project, ...newList];
		dispatch(setProjects(newList));
		EngineSettings.current.recentProjects = newList;
		await EngineSettings.current.save();
	};

	const handleNewProject = async () => {
		setNeedDialogNewProjectOpen(true);
	};

	const handleAcceptNewProject = async (project: Model.ProjectPreview) => {
		await handleOpenProject(project);
	};

	const handleOpenDialogProject = async () => {
		if (Constants.IS_DESKTOP) {
			const filesPath = await IO.openFileDialog({
				defaultPath: Paths.getRPMGamesFolder(),
				extensions: [EXTENSION_KIND.RPMG],
			});
			if (filesPath) {
				const filePath = Paths.normalize(filesPath[0]);
				const folders = filePath.split('/');
				folders.pop();
				const folderPath = folders.join('/');
				await handleOpenProject(
					Model.ProjectPreview.create(
						await Data.System.getProjectName(folderPath),
						Paths.normalize(folderPath)
					)
				);
			}
		}
	};

	const handleOpenProject = async (project: Model.ProjectPreview) => {
		dispatch(setOpenLoading(true));
		if (await Platform.checkFileExists(project.location)) {
			await addProject(project);
			Project.current = new Project(project.name, project.location);
			await Project.current.load();
			if (Project.current.settings.projectVersion !== Project.VERSION) {
				setIsDialogWarningProjectVersionOpen(true);
				Project.current = null;
			} else {
				dispatch(setCurrentProject(project));
			}
		} else {
			setIsDialogWarningProjectLocationExist(true);
		}
		dispatch(setOpenLoading(false));
	};

	const handleCloseWarningProjectLocationExist = () => {
		setIsDialogWarningProjectLocationExist(false);
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
		const folderName = Utils.formatProjectFolderName(file.name.substring(0, file.name.length - 4));
		const projectsFolders = await Platform.getFolders(Paths.getRPMGamesFolder());
		if (projectsFolders.includes(folderName)) {
			setIsDialogWarningImportOpen(true);
		} else {
			importFileInputRef.current.value = '';
			dispatch(setLoading(true));
			const path = Paths.join(Paths.getRPMGamesFolder(), folderName);
			await Platform.loadZip(file, path);
			const project = Model.ProjectPreview.create(await Data.System.getProjectName(path), path);
			await addProject(project);
			await handleOpenProject(project);
			dispatch(setLoading(false));
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
		const folderName = Utils.formatProjectFolderName(file.name.substring(0, file.name.length - 4));
		const path = Paths.join(Paths.getRPMGamesFolder(), folderName);
		await Platform.removeFolder(path);
		await Platform.loadZip(file, path);
		const project = Model.ProjectPreview.create(await Data.System.getProjectName(path), path);
		await addProject(project);
		await handleOpenProject(project);
		dispatch(setLoading(false));
	};

	const handleRejectImport = async () => {
		setIsDialogWarningImportOpen(false);
		if (importFileInputRef.current) {
			importFileInputRef.current.value = '';
		}
	};

	const handleExport = async () => {
		if (Constants.IS_DESKTOP) {
			const folderPath = await IO.openFolderDialog();
			if (folderPath) {
				IO.downloadZip(currentProject!.location, folderPath);
			}
		} else {
			await LocalFile.downloadZip(currentProject!.location);
		}
	};

	const handleCloseProject = async () => {
		if (Scene.Map.current) {
			Scene.Map.current.close();
			Scene.Map.current = null;
		}
		Project.current = null;
		dispatch(setCurrentTreeMapTag(null));
		dispatch(setCurrentProject(null));
	};

	const handleClearAllCache = async () => {
		setIsDialogWarningClearAllCacheOpen(true);
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
		dispatch(setNeedsReloadPageClearCache());
	};

	const handleRejectClearAllCache = async () => {
		setIsDialogWarningClearAllCacheOpen(false);
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

	const handleVariablesManager = async () => {
		setNeedDialogVariablesOpen(true);
	};

	const handleChangeLanguage = async () => {
		setNeedDialogChangeLanguageOpen(true);
	};

	const play = async () => await Platform.openGame(currentProject!.location);

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
		setIsLoading(true);
		await handleSaveAll();
		setIsLoading(false);
		setIsDialogSavePlayOpen(false);
		play();
	};

	const handleMinimize = async () => {
		await IO.minimize();
	};

	const handleMaximize = async () => {
		if (isMaximized) {
			await IO.unmaximize();
		} else {
			await IO.maximize();
		}
	};

	const handleClose = async () => {
		await IO.close();
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
			title: t('file'),
			children: [
				{
					title: `${t('new.project')}...`,
					icon: <AiOutlineFileAdd />,
					onClick: handleNewProject,
					shortcut: [SPECIAL_KEY.CTRL, SPECIAL_KEY.ALT, KEY.N],
				},
				{
					title: `${t('open.project')}...`,
					icon: <AiOutlineFolderOpen />,
					onClick: handleOpenDialogProject,
					children: projects.map((project) => ({
						title: project.name,
						onClick: () => handleOpenProject(project),
					})),
				},
				{
					title: (
						<>
							{`${Constants.IS_DESKTOP ? t('import.web.project') : t('import.project')}...`}
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
					title: `${Constants.IS_DESKTOP ? t('export.web.project') : t('export.project')}...`,
					icon: <BiExport />,
					disabled: !isProjectOpened,
					onClick: handleExport,
					shortcut: [SPECIAL_KEY.CTRL, KEY.E],
				},
				{
					title: t('save'),
					icon: <BiSave />,
					disabled: !canSave,
					onClick: handleSave,
					shortcut: [SPECIAL_KEY.CTRL, KEY.S],
				},
				{
					title: t('save.all'),
					icon: <LuSaveAll />,
					disabled: !canSaveAll,
					onClick: handleSaveAll,
					shortcut: [SPECIAL_KEY.CTRL, SPECIAL_KEY.SHIFT, KEY.S],
				},
				{
					title: t('close'),
					icon: <MdClose />,
					disabled: !isProjectOpened,
					onClick: handleCloseProject,
					shortcut: [SPECIAL_KEY.CTRL, KEY.Q],
				},
				{
					title: t('clear.all.cache'),
					icon: <AiOutlineClear />,
					onClick: handleClearAllCache,
				},
			],
		},
		{
			title: t('edition'),
			children: [
				{
					title: t('undo'),
					icon: <IoIosUndo />,
					disabled: !canUndo,
					onClick: handleUndo,
					shortcut: [SPECIAL_KEY.CTRL, KEY.Z],
				},
				{
					title: t('redo'),
					icon: <IoIosRedo />,
					disabled: !canRedo,
					onClick: handleRedo,
					shortcut: [SPECIAL_KEY.CTRL, SPECIAL_KEY.SHIFT, KEY.Z],
				},
				{
					title: t('move.cursor.square.up'),
					icon: <FaArrowUp />,
					disabled: !isInMap,
					onClick: handleMoveCursorSquareUp,
					shortcut: [SPECIAL_KEY.CTRL, KEY.UP],
				},
				{
					title: t('move.cursor.pixel.up'),
					icon: <AiOutlineArrowUp />,
					disabled: !isInMap,
					onClick: handleMoveCursorPixelUp,
					shortcut: [SPECIAL_KEY.CTRL, SPECIAL_KEY.SHIFT, KEY.UP],
				},
				{
					title: t('move.cursor.square.down'),
					icon: <FaArrowDown />,
					disabled: !isInMap,
					onClick: handleMoveCursorSquareDown,
					shortcut: [SPECIAL_KEY.CTRL, KEY.DOWN],
				},
				{
					title: t('move.cursor.pixel.down'),
					icon: <AiOutlineArrowDown />,
					disabled: !isInMap,
					onClick: handleMoveCursorPixelDown,
					shortcut: [SPECIAL_KEY.CTRL, SPECIAL_KEY.SHIFT, KEY.DOWN],
				},
				{
					title: t('zoom.in'),
					icon: <AiOutlineZoomIn />,
					disabled: !isInMap,
					onClick: handleZoomIn,
					shortcut: [SPECIAL_KEY.SHIFT, KEY.UP],
				},
				{
					title: t('zoom.out'),
					icon: <AiOutlineZoomOut />,
					disabled: !isInMap,
					onClick: handleZoomOut,
					shortcut: [SPECIAL_KEY.SHIFT, KEY.DOWN],
				},
			],
		},
		{
			title: t('management'),
			children: [
				{
					title: `${t('variables.manager')}...`,
					icon: <TbNumbers />,
					onClick: handleVariablesManager,
				},
			],
		},
		{
			title: t('special.elements'),
			disabled: true,
		},
		{
			title: t('options'),
			children: [
				{
					title: `${t('change.language')}...`,
					onClick: handleChangeLanguage,
				},
			],
		},
		{
			title: t('display'),
			disabled: true,
		},
		{
			title: t('test'),
			children: [
				{
					title: t('play'),
					icon: <BsPlay />,
					disabled: !isProjectOpened,
					onClick: handlePlay,
					shortcut: [SPECIAL_KEY.CTRL, KEY.P],
				},
			],
		},
		{
			title: t('help'),
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
		} else if (triggers.openDialogProject) {
			dispatch(triggerOpenDialogProject(false));
			handleOpenDialogProject().catch(console.error);
		} else if (triggers.openProject) {
			dispatch(triggerOpenProject(null));
			handleOpenProject(triggers.openProject).catch(console.error);
		} else if (triggers.save) {
			dispatch(triggerSave(false));
			handleSave().catch(console.error);
		} else if (triggers.saveAll) {
			dispatch(triggerSaveAll(false));
			handleSaveAll().catch(console.error);
		} else if (triggers.variables) {
			dispatch(triggerVariables(false));
			handleVariablesManager().catch(console.error);
		} else if (triggers.play) {
			dispatch(triggerPlay(false));
			handlePlay().catch(console.error);
		}
		// eslint-disable-next-line
	}, [triggers]);

	useEffect(() => {
		if (Constants.IS_DESKTOP) {
			IO.onMaximized(() => {
				setIsMaximized(true);
			});
			IO.onUnmaximized(() => {
				setIsMaximized(false);
			});
		}
	}, []);

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
				{list.map((item: MenuItemType, index: number) => {
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
							{item.title as ReactElement}
						</MenuItem>
					);
				})}
			</Menu>
		);
	};

	return (
		<>
			<div className='main-menu-bar'>
				<img className='main-menu-bar-logo' src={'./favicon.ico'} alt='logo' />
				{isProjectOpened && (
					<div className='mobile-only no-title-drag'>
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
				<div className='mobile-hidden no-title-drag'>
					<MenuCustom items={items} horizontal />
				</div>
				<div className='flex-one' />
				{hamburgerStates.length > 0 && (
					<div className='main-menu-hamburger no-title-drag' onClick={handleClickHamburgerBack}>
						<IoMdArrowBack />
					</div>
				)}
				<div className='main-menu-hamburger no-title-drag' onClick={handleClickHamburger}>
					<RxHamburgerMenu />
				</div>
				{isHamburgerOpen && (
					<div className='relative no-title-drag'>
						<div className='main-menu-hamburger-open menu-sub-content'>{getMenuHamburger()}</div>
					</div>
				)}
				{Constants.IS_DESKTOP && (
					<div className='flex fill-height no-title-drag'>
						<Button square backgroundOnHoverOnly onClick={handleMinimize}>
							<VscChromeMinimize />
						</Button>
						<Button square backgroundOnHoverOnly onClick={handleMaximize}>
							{isMaximized ? <VscChromeRestore /> : <VscChromeMaximize />}
						</Button>
						<Button buttonType={BUTTON_TYPE.RED} square backgroundOnHoverOnly onClick={handleClose}>
							<VscChromeClose />
						</Button>
					</div>
				)}
			</div>
			<Toolbar />
			<DialogNewProject
				needOpen={needDialogNewProjectOpen}
				setNeedOpen={setNeedDialogNewProjectOpen}
				onAccept={handleAcceptNewProject}
			/>
			<DialogVariables needOpen={needDialogVariablesOpen} setNeedOpen={setNeedDialogVariablesOpen} />
			<DialogChangeLanguage
				needOpen={needDialogChangeLanguageOpen}
				setNeedOpen={setNeedDialogChangeLanguageOpen}
			/>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningProjectVersionOpen}
				footer={<FooterOK onOK={handleCloseWarningProjectVersionOpen} />}
				onClose={handleCloseWarningProjectVersionOpen}
			>
				<p>{t('warning.project.version')}</p>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningImportOpen}
				footer={<FooterNoYes onNo={handleRejectImport} onYes={handleAcceptImport} />}
				onClose={handleRejectImport}
			>
				<p>{t('warning.project.exist.overwrite')}</p>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningClearAllCacheOpen}
				footer={<FooterNoYes onNo={handleRejectClearAllCache} onYes={handleAcceptClearAllCache} />}
				onClose={handleRejectClearAllCache}
			>
				<Loader isLoading={isLoading} />
				<div className='warning text-center'>{t('warning.clearing.cache')}</div>
			</Dialog>
			<Dialog
				title={t('warning')}
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
				<div className='text-center'>{t('you.have.maps.not.saved')}</div>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningProjectLocationExist}
				footer={<FooterOK onOK={handleCloseWarningProjectLocationExist} />}
				onClose={handleCloseWarningProjectLocationExist}
			>
				<div className='text-center'>{t('path.location.doesnt.exists')}.</div>
			</Dialog>
		</>
	);
}

export default MainMenuBar;
