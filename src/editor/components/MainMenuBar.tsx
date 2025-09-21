/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	AiOutlineArrowDown,
	AiOutlineArrowUp,
	AiOutlineClear,
	AiOutlineFileAdd,
	AiOutlineFolder,
	AiOutlineFolderOpen,
	AiOutlineFontSize,
	AiOutlinePicture,
	AiOutlineZoomIn,
	AiOutlineZoomOut,
} from 'react-icons/ai';
import { BiCube, BiExport, BiImport, BiPyramid, BiSave } from 'react-icons/bi';
import { BsClipboardData, BsDatabase, BsMusicNote, BsPlay } from 'react-icons/bs';
import { FaArrowDown, FaArrowsAlt, FaArrowUp, FaPlug, FaRegKeyboard } from 'react-icons/fa';
import { FiMap } from 'react-icons/fi';
import { IoIosRedo, IoIosUndo, IoMdArrowBack } from 'react-icons/io';
import { LuFolders, LuLanguages, LuMountain, LuSaveAll } from 'react-icons/lu';
import { MdAutoAwesomeMosaic, MdClose, MdOutlineWallpaper } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import { TbNumbers } from 'react-icons/tb';
import { TfiVideoClapper } from 'react-icons/tfi';
import { VscChromeClose, VscChromeMaximize, VscChromeMinimize, VscChromeRestore } from 'react-icons/vsc';
import { useDispatch, useSelector } from 'react-redux';
import {
	BUTTON_TYPE,
	Constants,
	EXTENSION_KIND,
	IO,
	JSONType,
	KEY,
	MenuItemType,
	Paths,
	PICTURE_KIND,
	SPECIAL_KEY,
	Utils,
} from '../common';
import {
	checkFileExists,
	exportFolder,
	getFolders,
	loadZip,
	openGame,
	readJSON,
	removeFolder,
} from '../common/Platform';
import { Project } from '../core/Project';

import { GiBrickWall } from 'react-icons/gi';
import { LocalFile } from '../core/LocalFile';
import { EngineSettings } from '../data/EngineSettings';
import { Data, Manager, Model, Scene } from '../Editor';
import useStateString from '../hooks/useStateString';
import { ProjectUpdater } from '../projectUpdater/ProjectUpdater';
import {
	clearProjects,
	RootState,
	setCurrentProject,
	setCurrentTreeMapTag,
	setLoading,
	setLoadingBar,
	setNeedsReloadPageClearCache,
	setOpenLoading,
	setProjectMenuIndex,
	setProjects,
	setUndoRedoIndex,
	triggerAutotiles,
	triggerCollisions,
	triggerData,
	triggerFonts,
	triggerImportProject,
	triggerKeyboard,
	triggerLanguages,
	triggerMountains,
	triggerNewProject,
	triggerObjects3D,
	triggerOpenDialogProject,
	triggerOpenProject,
	triggerOpenProjectFolder,
	triggerPictures,
	triggerPlay,
	triggerPlugins,
	triggerSave,
	triggerSaveAll,
	triggerShapes,
	triggerSongs,
	triggerSystems,
	triggerTreeMap,
	triggerVariables,
	triggerVideos,
	triggerWalls,
} from '../store';
import '../styles/MainMenuBar.css';
import Button from './Button';
import Dialog from './dialogs/Dialog';
import DialogChangeLanguage from './dialogs/DialogChangeLanguage';
import DialogCollisions from './dialogs/DialogCollisions';
import DialogData from './dialogs/DialogData';
import DialogFonts from './dialogs/DialogFonts';
import DialogKeyboardControls from './dialogs/DialogKeyboardControls';
import DialogLanguages from './dialogs/DialogLanguages';
import DialogNewProject from './dialogs/DialogNewProject';
import DialogObjects3DPreview from './dialogs/DialogObjects3DPreview';
import DialogPictures from './dialogs/DialogPictures';
import DialogPlugins from './dialogs/DialogPlugins';
import DialogShapes from './dialogs/DialogShapes';
import DialogSongs from './dialogs/DialogSongs';
import DialogSystems from './dialogs/DialogSystems';
import DialogVariables from './dialogs/DialogVariables';
import DialogVideos from './dialogs/DialogVideos';
import FooterCancelNoYes from './dialogs/footers/FooterCancelNoYes';
import FooterNoYes from './dialogs/footers/FooterNoYes';
import FooterOK from './dialogs/footers/FooterOK';
import Flex from './Flex';
import Menu from './Menu';
import MenuCustom from './MenuCustom';
import MenuItem from './MenuItem';
import Toolbar from './Toolbar';

function MainMenuBar() {
	const { t } = useTranslation();

	const [isDialogNewProjectOpen, setIsDialogNewProjectOpen] = useState(false);
	const [isDialogDataOpen, setIsDialogDataOpen] = useState(false);
	const [isDialogSystemsOpen, setIsDialogSystemsOpen] = useState(false);
	const [isDialogVariablesOpen, setIsDialogVariablesOpen] = useState(false);
	const [isDialogCollisionsOpen, setIsDialogCollisionsOpen] = useState(false);
	const [isDialogKeyboardOpen, setIsDialogKeyboardOpen] = useState(false);
	const [isDialogLanguagesOpen, setIsDialogLanguagesOpen] = useState(false);
	const [isDialogPluginsOpen, setIsDialogPluginsOpen] = useState(false);
	const [isDialogPicturesOpen, setIsDialogPicturesOpen] = useState(false);
	const [isDialogVideosOpen, setIsDialogVideosOpen] = useState(false);
	const [isDialogSongsOpen, setIsDialogSongsOpen] = useState(false);
	const [isDialogShapesOpen, setIsDialogShapesOpen] = useState(false);
	const [isDialogFontsOpen, setIsDialogFontsOpen] = useState(false);
	const [isDialogAutotilesOpen, setIsDialogAutotilesOpen] = useState(false);
	const [isDialogWallsOpen, setIsDialogWallsOpen] = useState(false);
	const [isDialogObjects3DOpen, setIsDialogObjects3DOpen] = useState(false);
	const [isDialogMountainsOpen, setIsDialogMountainsOpen] = useState(false);
	const [isDialogChangeLanguageOpen, setIsDialogChangeLanguageOpen] = useState(false);
	const [isDialogWarningProjectVersionOpen, setIsDialogWarningProjectVersionOpen] = useState(false);
	const [warningLocalPluginsMessage, setWarningLocalPluginsMessage] = useStateString();
	const [warningVersionMessage, setWarningVersionMessage] = useStateString();
	const [currentVersion, setCurrentVersion] = useState('');
	const [warningImportPath, setWarningImportPath] = useState('');
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
	const dialogsOpen = useSelector((state: RootState) => state.projects.dialogsOpen);
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
		setIsDialogNewProjectOpen(true);
	};

	const handleAcceptNewProject = async (project: Model.ProjectPreview) => {
		await handleOpenProject(project);
	};

	const handleOpenDialogProject = async () => {
		if (Constants.IS_DESKTOP) {
			const filesPath = await IO.openFileDialog({
				defaultPath: Paths.getRPMGamesFolder(),
				extensions: [[EXTENSION_KIND.RPMG, EXTENSION_KIND.RPM]],
			});
			if (filesPath) {
				const filePath = Paths.normalize(filesPath[0]);
				const folders = filePath.split('/');
				folders.pop();
				const folderPath = folders.join('/');
				await handleOpenProject(
					Model.ProjectPreview.create(
						await Data.System.getProjectName(folderPath),
						Paths.normalize(folderPath),
					),
				);
			}
		}
	};

	const handleOpenProject = async (project: Model.ProjectPreview, addExtraVersion?: string) => {
		dispatch(setLoading(true));
		dispatch(setOpenLoading(true));
		if (await checkFileExists(project.location)) {
			Project.current = new Project(project.location);
			let json = await readJSON(Paths.join(project.location, Paths.FILE_SYSTEM));
			if (json) {
				const name = ((json.pn as JSONType)?.names as JSONType)?.['1'];
				if (name !== undefined) {
					project.name = name as string;
				}
			}
			if (!Constants.IS_DESKTOP && addExtraVersion) {
				await addProject(
					Model.ProjectPreview.create(
						`${project.name}_${addExtraVersion}`,
						`${project.location}_${addExtraVersion}`,
					),
				);
			}
			await addProject(project);
			json = await readJSON(Paths.join(project.location, Paths.FILE_SETTINGS));
			let version = (json?.pv as string) ?? '';
			if (version !== Project.VERSION) {
				if (!version) {
					version = '2.0.11';
					if (Constants.IS_DESKTOP) {
						const fileVersion = await IO.readFile(Paths.join(project.location, 'game.rpm'));
						if (fileVersion !== '2.0.11') {
							setWarningVersionMessage(t('warning.project.2.0.11.version', { version: fileVersion }));
							setIsDialogWarningProjectVersionOpen(true);
							Project.current = null;
							dispatch(setOpenLoading(false));
							dispatch(setLoading(false));
							return;
						}
					}
				}
				if (version.startsWith('proto')) {
					setWarningVersionMessage(t('warning.project.version'));
					setIsDialogWarningProjectVersionOpen(true);
					Project.current = null;
					dispatch(setOpenLoading(false));
					dispatch(setLoading(false));
					return;
				} else if (!ProjectUpdater.checkVersion(version, Project.VERSION)) {
					setWarningVersionMessage(`${t('version.pb.1')} ${version} ${t('version.pb.2')} ${Project.VERSION}`);
					setIsDialogWarningProjectVersionOpen(true);
					Project.current = null;
					dispatch(setOpenLoading(false));
					dispatch(setLoading(false));
					return;
				} else if (ProjectUpdater.isIncompatibleVersion(version)) {
					setCurrentVersion(version);
					dispatch(setOpenLoading(false));
					dispatch(setLoading(false));
					return;
				}
			}
			await Project.current.load();
			if (Constants.IS_DESKTOP) {
				const newBRPath = Paths.join(window.__dirname, Paths.BR);
				if (newBRPath !== Project.current.systems.PATH_BR) {
					Project.current.systems.PATH_BR = newBRPath;
					await Project.current.systems.save();
				}
			}
			const newName = Project.current.systems.projectName.getName();
			if (project.name !== newName) {
				project.name = newName;
				await addProject(project);
			}
			await Project.current.systems.saveStyleCSS();
			dispatch(setCurrentProject(project));
		} else {
			setIsDialogWarningProjectLocationExist(true);
		}
		dispatch(setOpenLoading(false));
		dispatch(setLoading(false));
	};

	const handleCleanRecentProjects = async () => {
		EngineSettings.current.recentProjects = [];
		await EngineSettings.current.save();
		dispatch(setProjects([]));
	};

	const handleOpenProjectFolder = async () => {
		await IO.openFolder(Project.current!.location);
	};

	const handleCloseWarningProjectLocationExist = () => {
		setIsDialogWarningProjectLocationExist(false);
	};

	const handleCloseWarningProjectVersionOpen = () => {
		setIsDialogWarningProjectVersionOpen(false);
	};

	const handleAcceptUpdateProjectVersion = async () => {
		const version = currentVersion;
		setCurrentVersion('');
		dispatch(setLoading(true));
		const warning = await ProjectUpdater.update(version, updateLoadingBar);
		dispatch(setLoadingBar(null));
		if (warning) {
			setWarningLocalPluginsMessage(t('warning.local.plugins.update', { plugins: warning }));
		} else {
			await handleOpenProject(Model.ProjectPreview.create('Unkown', Project.current!.location), currentVersion);
		}
	};

	const handleCloseWarningLocalPluginsMessage = async () => {
		setWarningLocalPluginsMessage('');
		await handleOpenProject(Model.ProjectPreview.create('Unkown', Project.current!.location), currentVersion);
	};

	const handleRejectUpdateProjectVersion = () => {
		Project.current = null;
		setCurrentVersion('');
	};

	const handleSave = async () => {
		if (currentTreeMapTag) {
			await currentTreeMapTag.saveFiles();
			await Project.current?.treeMaps.save();
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

	const updateLoadingBar = (current: number, total: number, label = '', extra = 0) => {
		const stepSize = 100 / total;
		const baseProgress = (current / total) * 100;
		const extraProgress = (extra / 100) * stepSize;
		dispatch(setLoadingBar({ percent: Math.floor(baseProgress + extraProgress), label }));
	};

	const handleImportFileChange = async () => {
		if (!importFileInputRef.current) {
			return;
		}
		const file = Array.from(importFileInputRef.current.files || [])[0];
		const folderName = Utils.formatProjectFolderName(file.name.substring(0, file.name.length - 4));
		const projectsFolders = await getFolders(Paths.getRPMGamesFolder());
		if (projectsFolders.includes(folderName)) {
			setWarningImportPath(Paths.join(Paths.getRPMGamesFolder(), folderName));
		} else {
			importFileInputRef.current.value = '';
			dispatch(setLoading(true));
			dispatch(setLoadingBar({ percent: 0, label: '' }));
			const path = Paths.join(Paths.getRPMGamesFolder(), folderName);
			await loadZip(file, path, updateLoadingBar);
			dispatch(setLoadingBar({ percent: 100, label: '' }));
			const project = Model.ProjectPreview.create(await Data.System.getProjectName(path), path);
			await handleOpenProject(project);
			dispatch(setLoading(false));
			dispatch(setLoadingBar(null));
		}
	};

	const handleAcceptImport = async () => {
		if (!importFileInputRef.current) {
			return;
		}
		setWarningImportPath('');
		dispatch(setLoading(true));
		const file = Array.from(importFileInputRef.current.files || [])[0];
		importFileInputRef.current.value = '';
		const folderName = Utils.formatProjectFolderName(file.name.substring(0, file.name.length - 4));
		const path = Paths.join(Paths.getRPMGamesFolder(), folderName);
		await removeFolder(path);
		await loadZip(file, path);
		const project = Model.ProjectPreview.create(await Data.System.getProjectName(path), path);
		await handleOpenProject(project);
		dispatch(setLoading(false));
	};

	const handleRejectImport = async () => {
		setWarningImportPath('');
		if (importFileInputRef.current) {
			importFileInputRef.current.value = '';
		}
	};

	const handleExport = async () => {
		dispatch(setLoading(true));
		await exportFolder(currentProject!.location);
		dispatch(setLoading(false));
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

	const handleDataManager = async () => {
		setIsDialogDataOpen(true);
	};

	const handleSystemsManager = async () => {
		setIsDialogSystemsOpen(true);
	};

	const handleVariablesManager = async () => {
		setIsDialogVariablesOpen(true);
	};

	const handleCollisionsManager = async () => {
		setIsDialogCollisionsOpen(true);
	};

	const handleKeyboardManager = async () => {
		setIsDialogKeyboardOpen(true);
	};

	const handleLanguagesManager = async () => {
		setIsDialogLanguagesOpen(true);
	};

	const handlePluginsManager = async () => {
		setIsDialogPluginsOpen(true);
	};

	const handlePicturesManager = async () => {
		setIsDialogPicturesOpen(true);
	};

	const handleVideosManager = async () => {
		setIsDialogVideosOpen(true);
	};

	const handleSongsManager = async () => {
		setIsDialogSongsOpen(true);
	};

	const handleShapesManager = async () => {
		setIsDialogShapesOpen(true);
	};

	const handleFontsManager = async () => {
		setIsDialogFontsOpen(true);
	};

	const handleAutotiles = async () => {
		setIsDialogAutotilesOpen(true);
	};

	const handleWalls = async () => {
		setIsDialogWallsOpen(true);
	};

	const handleObjects3D = async () => {
		setIsDialogObjects3DOpen(true);
	};

	const handleMountains = async () => {
		setIsDialogMountainsOpen(true);
	};

	const handleChangeLanguage = async () => {
		setIsDialogChangeLanguageOpen(true);
	};

	const play = async () => await openGame(currentProject!.location);

	const handlePlay = async () => {
		if (canSaveAll) {
			setIsDialogSavePlayOpen(true);
		} else {
			await play();
		}
	};

	const handleCancelSavePlay = async () => {
		setIsDialogSavePlayOpen(false);
	};

	const handleRejectSavePlay = async () => {
		setIsDialogSavePlayOpen(false);
		await play();
	};

	const handleAcceptSavePlay = async () => {
		setIsLoading(true);
		await handleSaveAll();
		setIsLoading(false);
		setIsDialogSavePlayOpen(false);
		await play();
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
					children:
						projects.length === 0
							? undefined
							: projects.map((project) => ({
									title: project.name,
									onClick: () => handleOpenProject(project),
								})),
				},
				...(Constants.IS_DESKTOP
					? [
							{
								title: `${t('clean.recent.projects')}...`,
								icon: <AiOutlineClear />,
								onClick: handleCleanRecentProjects,
							},
							{
								title: `${t('open.project.folder')}...`,
								icon: <AiOutlineFolder />,
								onClick: handleOpenProjectFolder,
								disabled: !isProjectOpened,
							},
						]
					: [
							{
								title: (
									<>
										{`${t('import.project')}...`}
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
								title: `${t('export.project')}...`,
								icon: <BiExport />,
								disabled: !isProjectOpened,
								onClick: handleExport,
								shortcut: [SPECIAL_KEY.CTRL, KEY.E],
							},
						]),
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
				...(Constants.IS_DESKTOP
					? []
					: [
							{
								title: t('clear.all.cache'),
								icon: <AiOutlineClear />,
								onClick: handleClearAllCache,
							},
						]),
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
					shortcut: [SPECIAL_KEY.CTRL, KEY.ARROW_UP],
				},
				{
					title: t('move.cursor.pixel.up'),
					icon: <AiOutlineArrowUp />,
					disabled: !isInMap,
					onClick: handleMoveCursorPixelUp,
					shortcut: [SPECIAL_KEY.CTRL, SPECIAL_KEY.SHIFT, KEY.ARROW_UP],
				},
				{
					title: t('move.cursor.square.down'),
					icon: <FaArrowDown />,
					disabled: !isInMap,
					onClick: handleMoveCursorSquareDown,
					shortcut: [SPECIAL_KEY.CTRL, KEY.ARROW_DOWN],
				},
				{
					title: t('move.cursor.pixel.down'),
					icon: <AiOutlineArrowDown />,
					disabled: !isInMap,
					onClick: handleMoveCursorPixelDown,
					shortcut: [SPECIAL_KEY.CTRL, SPECIAL_KEY.SHIFT, KEY.ARROW_DOWN],
				},
				{
					title: t('zoom.in'),
					icon: <AiOutlineZoomIn />,
					disabled: !isInMap,
					onClick: handleZoomIn,
					shortcut: [SPECIAL_KEY.SHIFT, KEY.ARROW_DOWN],
				},
				{
					title: t('zoom.out'),
					icon: <AiOutlineZoomOut />,
					disabled: !isInMap,
					onClick: handleZoomOut,
					shortcut: [SPECIAL_KEY.SHIFT, KEY.ARROW_DOWN],
				},
			],
		},
		{
			title: t('management'),
			children: [
				{
					title: `${t('data.manager')}...`,
					icon: <BsDatabase />,
					onClick: handleDataManager,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('systems.manager')}...`,
					icon: <BsClipboardData />,
					onClick: handleSystemsManager,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('variables.manager')}...`,
					icon: <TbNumbers />,
					onClick: handleVariablesManager,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('collisions.manager')}...`,
					icon: <FaArrowsAlt />,
					onClick: handleCollisionsManager,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('keyboard.controls')}...`,
					icon: <FaRegKeyboard />,
					onClick: handleKeyboardManager,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('languages.manager')}...`,
					icon: <LuLanguages />,
					onClick: handleLanguagesManager,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('plugins.manager')}...`,
					icon: <FaPlug />,
					onClick: handlePluginsManager,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('pictures.manager')}...`,
					icon: <AiOutlinePicture />,
					onClick: handlePicturesManager,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('videos.manager')}...`,
					icon: <TfiVideoClapper />,
					onClick: handleVideosManager,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('songs.manager')}...`,
					icon: <BsMusicNote />,
					onClick: handleSongsManager,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('shapes.manager')}...`,
					icon: <BiPyramid />,
					onClick: handleShapesManager,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('fonts.manager')}...`,
					icon: <AiOutlineFontSize />,
					onClick: handleFontsManager,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('autotiles.tool')}...`,
					icon: <MdAutoAwesomeMosaic />,
					onClick: handleAutotiles,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('walls.tool')}...`,
					icon: <GiBrickWall />,
					onClick: handleWalls,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('threed.objects.tool')}...`,
					icon: <BiCube />,
					onClick: handleObjects3D,
					disabled: !isProjectOpened,
				},
				{
					title: `${t('mountains.tool')}...`,
					icon: <LuMountain />,
					onClick: handleMountains,
					disabled: !isProjectOpened,
				},
			],
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
		} else if (triggers.openProjectFolder) {
			dispatch(triggerOpenProjectFolder(false));
			handleOpenProjectFolder().catch(console.error);
		} else if (triggers.save) {
			dispatch(triggerSave(false));
			handleSave().catch(console.error);
		} else if (triggers.saveAll) {
			dispatch(triggerSaveAll(false));
			handleSaveAll().catch(console.error);
		} else if (triggers.data) {
			dispatch(triggerData(false));
			handleDataManager().catch(console.error);
		} else if (triggers.systems) {
			dispatch(triggerSystems(false));
			handleSystemsManager().catch(console.error);
		} else if (triggers.variables) {
			dispatch(triggerVariables(false));
			handleVariablesManager().catch(console.error);
		} else if (triggers.collisions) {
			dispatch(triggerCollisions(false));
			handleCollisionsManager().catch(console.error);
		} else if (triggers.plugins) {
			dispatch(triggerPlugins(false));
			handlePluginsManager().catch(console.error);
		} else if (triggers.keyboard) {
			dispatch(triggerKeyboard(false));
			handleKeyboardManager().catch(console.error);
		} else if (triggers.languages) {
			dispatch(triggerLanguages(false));
			handleLanguagesManager().catch(console.error);
		} else if (triggers.pictures) {
			dispatch(triggerPictures(false));
			handlePicturesManager().catch(console.error);
		} else if (triggers.videos) {
			dispatch(triggerVideos(false));
			handleVideosManager().catch(console.error);
		} else if (triggers.songs) {
			dispatch(triggerSongs(false));
			handleSongsManager().catch(console.error);
		} else if (triggers.shapes) {
			dispatch(triggerShapes(false));
			handleShapesManager().catch(console.error);
		} else if (triggers.fonts) {
			dispatch(triggerFonts(false));
			handleFontsManager().catch(console.error);
		} else if (triggers.autotiles) {
			dispatch(triggerAutotiles(false));
			handleAutotiles().catch(console.error);
		} else if (triggers.walls) {
			dispatch(triggerWalls(false));
			handleWalls().catch(console.error);
		} else if (triggers.objects3D) {
			dispatch(triggerObjects3D(false));
			handleObjects3D().catch(console.error);
		} else if (triggers.mountains) {
			dispatch(triggerMountains(false));
			handleMountains().catch(console.error);
		} else if (triggers.play) {
			dispatch(triggerPlay(false));
			handlePlay().catch(console.error);
		}
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
					const handleClick = async () => {
						if (item.onClick) {
							await item.onClick();
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
			<div className='mainMenuBar'>
				<img className='logo' src={'./favicon.ico'} alt='logo' />
				{isProjectOpened && (
					<div className='mobileOnly noTitleDrag'>
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
				<div className='mobileHidden noTitleDrag'>
					<MenuCustom items={items} horizontal allowKeyboard={!dialogsOpen} />
				</div>
				<Flex one />
				{hamburgerStates.length > 0 && (
					<div className='hamburger noTitleDrag' onClick={handleClickHamburgerBack}>
						<IoMdArrowBack />
					</div>
				)}
				<div className='hamburger noTitleDrag' onClick={handleClickHamburger}>
					<RxHamburgerMenu />
				</div>
				{isHamburgerOpen && (
					<div className='relative noTitleDrag'>
						<div className='hamburgerOpen menuSubContent'>{getMenuHamburger()}</div>
					</div>
				)}
				{Constants.IS_DESKTOP && (
					<>
						<div className='textSmallDetail'>{document.title}</div>
						<Flex one />
						<Flex fillHeight className='noTitleDrag'>
							<Button square backgroundOnHoverOnly onClick={handleMinimize}>
								<VscChromeMinimize />
							</Button>
							<Button square backgroundOnHoverOnly onClick={handleMaximize}>
								{isMaximized ? <VscChromeRestore /> : <VscChromeMaximize />}
							</Button>
							<Button buttonType={BUTTON_TYPE.RED} square backgroundOnHoverOnly onClick={handleClose}>
								<VscChromeClose />
							</Button>
						</Flex>
					</>
				)}
			</div>
			<Toolbar />
			{isDialogNewProjectOpen && (
				<DialogNewProject isOpen setIsOpen={setIsDialogNewProjectOpen} onAccept={handleAcceptNewProject} />
			)}
			{isDialogDataOpen && <DialogData isOpen setIsOpen={setIsDialogDataOpen} />}
			{isDialogSystemsOpen && <DialogSystems isOpen setIsOpen={setIsDialogSystemsOpen} />}
			{isDialogVariablesOpen && <DialogVariables isOpen setIsOpen={setIsDialogVariablesOpen} />}
			{isDialogCollisionsOpen && <DialogCollisions isOpen setIsOpen={setIsDialogCollisionsOpen} />}
			{isDialogKeyboardOpen && <DialogKeyboardControls setIsOpen={setIsDialogKeyboardOpen} />}
			{isDialogLanguagesOpen && <DialogLanguages setIsOpen={setIsDialogLanguagesOpen} />}
			{isDialogPluginsOpen && <DialogPlugins isOpen setIsOpen={setIsDialogPluginsOpen} />}
			{isDialogPicturesOpen && <DialogPictures isOpen setIsOpen={setIsDialogPicturesOpen} />}
			{isDialogVideosOpen && <DialogVideos manager isOpen setIsOpen={setIsDialogVideosOpen} />}
			{isDialogSongsOpen && <DialogSongs isOpen setIsOpen={setIsDialogSongsOpen} />}
			{isDialogShapesOpen && <DialogShapes isOpen setIsOpen={setIsDialogShapesOpen} />}
			{isDialogFontsOpen && <DialogFonts manager isOpen setIsOpen={setIsDialogFontsOpen} />}
			{isDialogAutotilesOpen && (
				<DialogCollisions kind={PICTURE_KIND.AUTOTILES} isOpen setIsOpen={setIsDialogAutotilesOpen} />
			)}
			{isDialogWallsOpen && (
				<DialogCollisions kind={PICTURE_KIND.WALLS} isOpen setIsOpen={setIsDialogWallsOpen} />
			)}
			{isDialogObjects3DOpen && <DialogObjects3DPreview manager isOpen setIsOpen={setIsDialogObjects3DOpen} />}
			{isDialogMountainsOpen && (
				<DialogCollisions kind={PICTURE_KIND.MOUNTAINS} isOpen setIsOpen={setIsDialogMountainsOpen} />
			)}
			{isDialogChangeLanguageOpen && <DialogChangeLanguage isOpen setIsOpen={setIsDialogChangeLanguageOpen} />}
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningProjectVersionOpen}
				footer={<FooterOK onOK={handleCloseWarningProjectVersionOpen} />}
				onClose={handleCloseWarningProjectVersionOpen}
			>
				<p>{warningVersionMessage}</p>
			</Dialog>
			<Dialog
				title={t('conversion.needed')}
				isOpen={!!currentVersion}
				footer={
					<FooterNoYes onYes={handleAcceptUpdateProjectVersion} onNo={handleRejectUpdateProjectVersion} />
				}
				onClose={handleRejectUpdateProjectVersion}
			>
				<p>{t('update.project.version', { currentVersion: currentVersion, newVersion: Project.VERSION })}</p>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={!!warningImportPath}
				footer={<FooterNoYes onNo={handleRejectImport} onYes={handleAcceptImport} />}
				onClose={handleRejectImport}
			>
				<p>{t('warning.project.exist.overwrite', { path: warningImportPath })}</p>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningClearAllCacheOpen}
				isLoading={isLoading}
				footer={<FooterNoYes onNo={handleRejectClearAllCache} onYes={handleAcceptClearAllCache} />}
				onClose={handleRejectClearAllCache}
			>
				<div className='warning textCenter'>{t('warning.clearing.cache')}</div>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningSavePlayOpen}
				isLoading={isLoading}
				footer={
					<FooterCancelNoYes
						onCancel={handleCancelSavePlay}
						onNo={handleRejectSavePlay}
						onYes={handleAcceptSavePlay}
					/>
				}
				onClose={handleRejectSavePlay}
			>
				<div className='textCenter'>{t('you.have.maps.not.saved')}</div>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningProjectLocationExist}
				footer={<FooterOK onOK={handleCloseWarningProjectLocationExist} />}
				onClose={handleCloseWarningProjectLocationExist}
			>
				<div className='textCenter'>{t('path.location.doesnt.exists')}.</div>
			</Dialog>
			{warningLocalPluginsMessage && (
				<Dialog
					isOpen
					title={t('warning')}
					footer={<FooterOK onOK={handleCloseWarningLocalPluginsMessage} />}
					onClose={handleCloseWarningLocalPluginsMessage}
				>
					<p>{warningLocalPluginsMessage}</p>
				</Dialog>
			)}
		</>
	);
}

export default MainMenuBar;
