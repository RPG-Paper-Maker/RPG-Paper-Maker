/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
	AiOutlineFileAdd,
	AiOutlineFolder,
	AiOutlineFolderOpen,
	AiOutlineFontSize,
	AiOutlinePicture,
} from 'react-icons/ai';
import { BiCube, BiImport, BiPyramid, BiSave } from 'react-icons/bi';
import { BsClipboardData, BsDatabase, BsMusicNote, BsPlay } from 'react-icons/bs';
import { FaArrowsAlt, FaPlug, FaRegKeyboard } from 'react-icons/fa';
import { GiBrickWall } from 'react-icons/gi';
import { IoWarning } from 'react-icons/io5';
import { LuLanguages, LuMountain, LuSaveAll } from 'react-icons/lu';
import { MdAutoAwesomeMosaic, MdOutlineAddchart } from 'react-icons/md';
import { TbNumbers } from 'react-icons/tb';
import { TfiVideoClapper } from 'react-icons/tfi';
import { useDispatch, useSelector } from 'react-redux';
import { Constants } from '../common';
import { Project } from '../core/Project';
import { updateLegacyCount } from '../data/Legacy';
import {
	RootState,
	setLegacyCount,
	triggerAutotiles,
	triggerCollisions,
	triggerData,
	triggerDLCs,
	triggerFonts,
	triggerImportProject,
	triggerKeyboard,
	triggerLanguages,
	triggerMountains,
	triggerNewProject,
	triggerObjects3D,
	triggerOpenDialogProject,
	triggerOpenProjectFolder,
	triggerPictures,
	triggerPlay,
	triggerPlugins,
	triggerSave,
	triggerSaveAll,
	triggerShapes,
	triggerSongs,
	triggerSystems,
	triggerVariables,
	triggerVideos,
	triggerWalls,
} from '../store';
import '../styles/Toolbar.css';
import Menu from './Menu';
import MenuItem from './MenuItem';
import DialogLegacy from './dialogs/DialogLegacy';

function Toolbar() {
	const { t } = useTranslation();

	const dispatch = useDispatch();

	const toolbarRef = useRef<HTMLDivElement>(null);
	const retryRef = useRef(0);

	const updateScale = useCallback(() => {
		const toolbar = toolbarRef.current;
		const menu = toolbar?.querySelector<HTMLElement>('.menu');
		if (!toolbar || !menu) {
			return;
		}
		const warning = toolbar.querySelector<HTMLElement>('.toolbarLegacyWarning');
		const available = toolbar.clientWidth - (warning?.offsetWidth ?? 0);
		const natural = menu.scrollWidth;
		if (available <= 0 || natural <= 0) {
			if (retryRef.current < 30) {
				retryRef.current += 1;
				requestAnimationFrame(updateScale);
			}
			return;
		}
		retryRef.current = 0;
		const scale = Math.min(1, available / natural);
		toolbar.style.setProperty('--toolbar-scale', String(scale));
	}, []);

	useLayoutEffect(() => {
		updateScale();
	});

	useLayoutEffect(() => {
		const toolbar = toolbarRef.current;
		if (!toolbar) {
			return;
		}
		const frame = requestAnimationFrame(() => updateScale());
		const observer = new ResizeObserver(() => updateScale());
		observer.observe(toolbar);
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		};
	}, [updateScale]);

	const currentProject = useSelector((state: RootState) => state.projects.current);
	const currentTreeMapTag = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag);
	const treeMapTrigger = useSelector((state: RootState) => state.triggers.treeMap); // Force to check can save all
	const dialogsOpen = useSelector((state: RootState) => state.projects.dialogsOpen);
	const legacyCount = useSelector((state: RootState) => state.projects.legacyCount);

	const [isDialogLegacyOpen, setIsDialogLegacyOpen] = useState(false);
	const [legacyBubblePosition, setLegacyBubblePosition] = useState<{ top: number; right: number } | null>(null);
	const [isLegacyBubbleClosed, setIsLegacyBubbleClosed] = useState(false);
	const legacyWarningRef = useRef<HTMLButtonElement>(null);

	const isProjectOpened = currentProject !== null;

	const isInMap = isProjectOpened && currentTreeMapTag !== null;

	const canSave = isInMap && !currentTreeMapTag.saved;

	const canSaveAll = isProjectOpened && !Project.current?.treeMaps.isAllMapsSaved();

	const handleNewProject = () => {
		dispatch(triggerNewProject(true));
	};

	const handleImport = async () => {
		dispatch(triggerImportProject(true));
	};

	const handleOpenDialogProject = async () => {
		dispatch(triggerOpenDialogProject(true));
	};

	const handleSave = () => {
		dispatch(triggerSave(true));
	};

	const handleSaveAll = () => {
		dispatch(triggerSaveAll(true));
	};

	const handleOpenProjectFolder = () => {
		dispatch(triggerOpenProjectFolder(true));
	};

	const handleDataManager = () => {
		dispatch(triggerData(true));
	};

	const handleSystemsManager = () => {
		dispatch(triggerSystems(true));
	};

	const handleVariablesManager = () => {
		dispatch(triggerVariables(true));
	};

	const handleCollisionsManager = () => {
		dispatch(triggerCollisions(true));
	};

	const handleKeyboardManager = () => {
		dispatch(triggerKeyboard(true));
	};

	const handleLanguagesManager = () => {
		dispatch(triggerLanguages(true));
	};

	const handlePluginsManager = () => {
		dispatch(triggerPlugins(true));
	};

	const handleDLCsManager = () => {
		dispatch(triggerDLCs(true));
	};

	const handlePicturesManager = () => {
		dispatch(triggerPictures(true));
	};

	const handleVideosManager = () => {
		dispatch(triggerVideos(true));
	};

	const handleSongsManager = () => {
		dispatch(triggerSongs(true));
	};

	const handleShapesManager = () => {
		dispatch(triggerShapes(true));
	};

	const handleFontsManager = () => {
		dispatch(triggerFonts(true));
	};

	const handleAutotiles = () => {
		dispatch(triggerAutotiles(true));
	};

	const handleWalls = () => {
		dispatch(triggerWalls(true));
	};

	const handleObjects3D = () => {
		dispatch(triggerObjects3D(true));
	};

	const handleMountains = () => {
		dispatch(triggerMountains(true));
	};

	const handlePlay = () => {
		dispatch(triggerPlay(true));
	};

	useLayoutEffect(() => {
		if (!isProjectOpened || legacyCount === 0 || isLegacyBubbleClosed) {
			setLegacyBubblePosition(null);
			return;
		}
		const updatePosition = () => {
			const rect = legacyWarningRef.current?.getBoundingClientRect();
			if (rect) {
				setLegacyBubblePosition({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
			}
		};
		updatePosition();
		window.addEventListener('resize', updatePosition);
		return () => window.removeEventListener('resize', updatePosition);
	}, [isProjectOpened, legacyCount, isLegacyBubbleClosed]);

	useEffect(() => {
		setIsLegacyBubbleClosed(false);
	}, [currentProject]);

	const refreshLegacyCount = useCallback(async () => {
		if (Project.current) {
			dispatch(setLegacyCount(await updateLegacyCount()));
		}
	}, []);

	useEffect(() => {
		dispatch(setLegacyCount(currentProject ? (Project.current?.settings.legacyCount ?? 0) : 0));
		if (currentProject) {
			refreshLegacyCount().catch(console.error);
		}
	}, [currentProject]);

	useEffect(() => {
		if (!currentProject || dialogsOpen || legacyCount === 0) {
			return;
		}
		const timeout = setTimeout(() => refreshLegacyCount().catch(console.error), 500);
		return () => clearTimeout(timeout);
	}, [treeMapTrigger, dialogsOpen]);

	return (
		<>
			<div className='toolbar' ref={toolbarRef}>
				<Menu horizontal>
					<MenuItem icon={<AiOutlineFileAdd />} onClick={handleNewProject}>
						{t('new.project.tool')}
					</MenuItem>
					<MenuItem
						icon={Constants.IS_DESKTOP ? <AiOutlineFolderOpen /> : <BiImport />}
						onClick={Constants.IS_DESKTOP ? handleOpenDialogProject : handleImport}
					>
						{Constants.IS_DESKTOP ? t('open.project.tool') : t('import.project.tool')}
					</MenuItem>
					<MenuItem icon={<BiSave />} onClick={handleSave} disabled={!canSave}>
						{t('save.tool')}
					</MenuItem>
					<MenuItem icon={<LuSaveAll />} onClick={handleSaveAll} disabled={!canSaveAll}>
						{t('all')}
					</MenuItem>
					{Constants.IS_DESKTOP ? (
						<MenuItem
							icon={<AiOutlineFolder />}
							onClick={handleOpenProjectFolder}
							disabled={!isProjectOpened}
						>
							{t('folder')}
						</MenuItem>
					) : (
						<></>
					)}
					<MenuItem separator></MenuItem>
					<MenuItem icon={<BsDatabase />} onClick={handleDataManager} disabled={!isProjectOpened}>
						{t('data.manager.tool')}
					</MenuItem>
					<MenuItem icon={<BsClipboardData />} onClick={handleSystemsManager} disabled={!isProjectOpened}>
						{t('systems.manager.tool')}
					</MenuItem>
					<MenuItem icon={<TbNumbers />} onClick={handleVariablesManager} disabled={!isProjectOpened}>
						{t('variables.manager.tool')}
					</MenuItem>
					<MenuItem icon={<FaArrowsAlt />} onClick={handleCollisionsManager} disabled={!isProjectOpened}>
						{t('collisions.manager.tool')}
					</MenuItem>
					<MenuItem icon={<FaRegKeyboard />} onClick={handleKeyboardManager} disabled={!isProjectOpened}>
						{t('keyboard.controls.tool')}
					</MenuItem>
					<MenuItem icon={<LuLanguages />} onClick={handleLanguagesManager} disabled={!isProjectOpened}>
						{t('languages.manager.tool')}
					</MenuItem>
					<MenuItem icon={<FaPlug />} onClick={handlePluginsManager} disabled={!isProjectOpened}>
						{t('plugins')}
					</MenuItem>
					<>
						{Constants.IS_DESKTOP && (
							<MenuItem
								icon={<MdOutlineAddchart />}
								onClick={handleDLCsManager}
								disabled={!isProjectOpened}
							>
								DLCs
							</MenuItem>
						)}
					</>
					<MenuItem separator></MenuItem>
					<MenuItem icon={<AiOutlinePicture />} onClick={handlePicturesManager} disabled={!isProjectOpened}>
						{t('pictures.manager.tool')}
					</MenuItem>
					<MenuItem icon={<TfiVideoClapper />} onClick={handleVideosManager} disabled={!isProjectOpened}>
						{t('videos.manager.tool')}
					</MenuItem>
					<MenuItem icon={<BsMusicNote />} onClick={handleSongsManager} disabled={!isProjectOpened}>
						{t('songs.manager.tool')}
					</MenuItem>
					<MenuItem icon={<BiPyramid />} onClick={handleShapesManager} disabled={!isProjectOpened}>
						{t('shapes.manager.tool')}
					</MenuItem>
					<MenuItem icon={<AiOutlineFontSize />} onClick={handleFontsManager} disabled={!isProjectOpened}>
						{t('fonts.manager.tool')}
					</MenuItem>
					<MenuItem separator></MenuItem>
					<MenuItem icon={<MdAutoAwesomeMosaic />} onClick={handleAutotiles} disabled={!isProjectOpened}>
						{t('autotiles.tool')}
					</MenuItem>
					<MenuItem icon={<GiBrickWall />} onClick={handleWalls} disabled={!isProjectOpened}>
						{t('walls.tool')}
					</MenuItem>
					<MenuItem icon={<BiCube />} onClick={handleObjects3D} disabled={!isProjectOpened}>
						{t('threed.objects.tool')}
					</MenuItem>
					<MenuItem icon={<LuMountain />} onClick={handleMountains} disabled={!isProjectOpened}>
						{t('mountains.tool')}
					</MenuItem>
					<MenuItem separator></MenuItem>
					<MenuItem icon={<BsPlay />} onClick={handlePlay} disabled={!isProjectOpened}>
						{t('play')}
					</MenuItem>
				</Menu>
				{isProjectOpened && legacyCount > 0 && (
					<button
						type='button'
						ref={legacyWarningRef}
						className='toolbarLegacyWarning'
						aria-label={`${t('legacy.warning.bubble')} (${legacyCount})`}
						onClick={() => {
							setIsLegacyBubbleClosed(true);
							setIsDialogLegacyOpen(true);
						}}
					>
						<IoWarning />
						<span>{legacyCount}</span>
					</button>
				)}
				{isProjectOpened &&
					legacyCount > 0 &&
					!isLegacyBubbleClosed &&
					legacyBubblePosition &&
					createPortal(
						<div
							className='toolbarLegacyBubble'
							style={legacyBubblePosition}
							onClick={() => setIsLegacyBubbleClosed(true)}
						>
							{t('legacy.warning.bubble')}
						</div>,
						document.body,
					)}
			</div>
			<div className='toolbarMobileSeparator'></div>
			{isDialogLegacyOpen && <DialogLegacy setIsOpen={setIsDialogLegacyOpen} />}
		</>
	);
}

export default Toolbar;
