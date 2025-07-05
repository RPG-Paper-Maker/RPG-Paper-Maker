/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

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
import { LuLanguages, LuMountain, LuSaveAll } from 'react-icons/lu';
import { MdAutoAwesomeMosaic, MdOutlineAddchart } from 'react-icons/md';
import { TbNumbers } from 'react-icons/tb';
import { TfiVideoClapper } from 'react-icons/tfi';
import { useDispatch, useSelector } from 'react-redux';
import { Constants } from '../common';
import { Project } from '../core/Project';
import {
	RootState,
	triggerAutotiles,
	triggerCollisions,
	triggerData,
	triggerFonts,
	triggerImportProject,
	triggerNewProject,
	triggerOpenDialogProject,
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

function Toolbar() {
	const { t } = useTranslation();

	const dispatch = useDispatch();

	const currentProject = useSelector((state: RootState) => state.projects.current);
	const currentTreeMapTag = useSelector((state: RootState) => state.mapEditor.currentTreeMapTag);
	useSelector((state: RootState) => state.triggers.treeMap); // Force to check can save all

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

	const handlePluginsManager = () => {
		dispatch(triggerPlugins(true));
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

	const handlePlay = () => {
		dispatch(triggerPlay(true));
	};

	const handleFloor = () => {
		// TODO
	};

	return (
		<>
			<div className='toolbar'>
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
						<MenuItem icon={<AiOutlineFolder />} onClick={handleFloor} disabled>
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
					<MenuItem icon={<FaRegKeyboard />} onClick={handleFloor} disabled>
						{t('keyboard.controls.tool')}
					</MenuItem>
					<MenuItem icon={<LuLanguages />} onClick={handleFloor} disabled>
						{t('languages.manager.tool')}
					</MenuItem>
					<MenuItem icon={<FaPlug />} onClick={handlePluginsManager} disabled={!isProjectOpened}>
						{t('plugins')}
					</MenuItem>
					<>
						{Constants.IS_DESKTOP && (
							<MenuItem icon={<MdOutlineAddchart />} onClick={handleFloor} disabled>
								{t('dlcs')}
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
					<MenuItem icon={<BiCube />} onClick={handleFloor} disabled>
						{t('threed.objects.tool')}
					</MenuItem>
					<MenuItem icon={<LuMountain />} onClick={handleFloor} disabled>
						{t('mountains.tool')}
					</MenuItem>
					<MenuItem separator></MenuItem>
					<MenuItem icon={<BsPlay />} onClick={handlePlay} disabled={!isProjectOpened}>
						{t('play')}
					</MenuItem>
				</Menu>
			</div>
			<div className='toolbarMobileSeparator'></div>
		</>
	);
}

export default Toolbar;
