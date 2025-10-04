/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Constants, ELEMENT_MAP_KIND, INPUT_TYPE_WIDTH, IO, Paths, Utils } from '../../common';
import { copyPublicFile, createFile, createFolder, getFolders, removeFolder } from '../../common/Platform';
import { Project } from '../../core/Project';
import { EngineSettings } from '../../data/EngineSettings';
import { Model, Scene } from '../../Editor';
import { RootState, setProjects } from '../../store';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Flex from '../Flex';
import InputText from '../InputText';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import FooterNoYes from './footers/FooterNoYes';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	onAccept: (data: Model.ProjectPreview) => void;
};

function DialogNewProject({ isOpen, setIsOpen, onAccept }: Props) {
	const { t } = useTranslation();

	const [focusFirst, setFocustFirst] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [projectName, setProjectName] = useState(t('project.without.name'));
	const [folderName, setFolderName] = useState(t('project.without.name.folder'));
	const [isAutoGenerate, setIsAutoGenerate] = useState(true);
	const [location, setLocation] = useState(Paths.getRPMGamesFolder());
	const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);

	const projects = useSelector((state: RootState) => state.projects.list);

	const dispatch = useDispatch();

	const getcompleteLocation = () => Paths.join(location, folderName);

	const checkValidAccept: () => Promise<boolean> = async () => {
		// Check if folder name already exists in this folder location
		const projectsFolders = await getFolders(location);
		if (projectsFolders.find((name) => folderName === name)) {
			setIsDialogConfirmOpen(true);
			return false;
		}
		return true;
	};

	const accept = () => {
		onAccept(Model.ProjectPreview.create(projectName, getcompleteLocation()));
		setIsOpen(false);
	};

	const replaceProject = async () => {
		setIsDialogConfirmOpen(false);
		await removeFolder(getcompleteLocation());
		await createProject();
		accept();
	};

	const cancelCreation = () => {
		setIsDialogConfirmOpen(false);
	};

	const createProject = async () => {
		setIsLoading(true);
		if (Scene.Map.current) {
			Scene.Map.current.close();
		}
		Scene.Map.current = null;
		const completeLocation = getcompleteLocation();
		const project = new Project(completeLocation);
		Project.current = project;
		const folderPath = project.getPath();
		await createFolder(project.getPath());
		await createFile(Paths.join(folderPath, Paths.FILE_GAME_RPMG), '');
		await createFolder(project.getPathSaves());
		await createFolder(project.getPathMaps());
		Scene.Map.currentSelectedMapElementKind = ELEMENT_MAP_KIND.FLOOR;
		for (const file of Paths.ALL_JSON) {
			await copyPublicFile(Paths.join(Paths.DEFAULT, file), Paths.join(project.getPath(), file));
		}
		await createFolder(Paths.join(project.getPath(), Paths.PICTURES));
		await createFolder(Paths.join(project.getPath(), Paths.HUD));
		await createFolder(Paths.join(project.getPath(), Paths.ANIMATIONS));
		await createFolder(Paths.join(project.getPath(), Paths.BARS));
		await createFolder(Paths.join(project.getPath(), Paths.FACESETS));
		await createFolder(Paths.join(project.getPath(), Paths.ICONS));
		await createFolder(Paths.join(project.getPath(), Paths.HUD_PICTURES));
		await createFolder(Paths.join(project.getPath(), Paths.TITLE_SCREEN));
		await createFolder(Paths.join(project.getPath(), Paths.WINDOW_SKINS));
		await createFolder(Paths.join(project.getPath(), Paths.GAME_OVER));
		await createFolder(Paths.join(project.getPath(), Paths.TEXTURES2D));
		await createFolder(Paths.join(project.getPath(), Paths.AUTOTILES));
		await createFolder(Paths.join(project.getPath(), Paths.BATTLERS));
		await createFolder(Paths.join(project.getPath(), Paths.CHARACTERS));
		await createFolder(Paths.join(project.getPath(), Paths.MOUNTAINS));
		await createFolder(Paths.join(project.getPath(), Paths.OBJECTS_3D));
		await createFolder(Paths.join(project.getPath(), Paths.TILESETS));
		await createFolder(Paths.join(project.getPath(), Paths.WALLS));
		await createFolder(Paths.join(project.getPath(), Paths.SKYBOXES));
		await createFolder(Paths.join(project.getPath(), Paths.PARTICLES));
		await createFolder(Paths.join(project.getPath(), Paths.VIDEOS));
		await createFolder(Paths.join(project.getPath(), Paths.SONGS));
		await createFolder(Paths.join(project.getPath(), Paths.MUSICS));
		await createFolder(Paths.join(project.getPath(), Paths.BACKGROUND_SOUNDS));
		await createFolder(Paths.join(project.getPath(), Paths.SOUNDS));
		await createFolder(Paths.join(project.getPath(), Paths.MUSIC_EFFECTS));
		await createFolder(Paths.join(project.getPath(), Paths.SHAPES));
		await createFolder(Paths.join(project.getPath(), Paths.OBJ_COLLISIONS));
		await createFolder(Paths.join(project.getPath(), Paths.MTL));
		await createFolder(Paths.join(project.getPath(), Paths.OBJ));
		await createFolder(Paths.join(project.getPath(), Paths.FONTS));
		await createFolder(Paths.join(project.getPath(), Paths.STYLES));
		await createFolder(Paths.join(project.getPath(), Paths.PLUGINS));
		await createFolder(Paths.join(project.getPath(), Paths.TEST));
		await project.load();
		if (Constants.IS_DESKTOP) {
			project.systems.PATH_BR = Paths.join(window.__dirname, Paths.BR);
			project.systems.PATH_DLCS = Paths.join(window.__dirname, Paths.DLCS);
		}
		await Model.Map.createDefaultMap(1, t('starting.map'));
		await Model.Map.createDefaultMap(2, t('default'));
		project.translateDefaults();
		project.settings.projectVersion = Project.VERSION;
		if (Constants.IS_MOBILE) {
			project.settings.projectMenuIndex = 2;
		}
		project.systems.projectName.updateMainName(projectName);
		await project.save();

		// Update recent projects
		let newList = projects.filter((p) => completeLocation !== p.location);
		newList = [Model.ProjectPreview.create(projectName, completeLocation), ...newList];
		dispatch(setProjects(newList));
		EngineSettings.current.recentProjects = newList;
		await EngineSettings.current.save();
		setIsLoading(false);
	};

	const handleChangeProjectName = (name: string) => {
		if (isAutoGenerate) {
			setFolderName(Utils.formatProjectFolderName(name));
		}
		setProjectName(name);
	};

	const handleChangeFolderName = (name: string) => {
		setFolderName(Utils.formatProjectFolderName(name));
	};

	const handleClickLocation = async () => {
		const folderName = await IO.openFolderDialog(Paths.getRPMGamesFolder());
		if (folderName) {
			setLocation(folderName);
		}
	};

	const handleAccept = async (): Promise<boolean> => {
		if (await checkValidAccept()) {
			await createProject();
			accept();
			return true;
		}
		return false;
	};

	const handleReject = () => {
		setIsOpen(false);
	};

	return (
		<>
			<Dialog
				title={`${t('new.project')}...`}
				isOpen={isOpen}
				isLoading={isLoading}
				isDisabled={isDialogConfirmOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
			>
				<Flex column spaced>
					<Flex spaced>
						<div>{t('name')}:</div>
						<InputText
							focusFirst={focusFirst}
							setFocustFirst={setFocustFirst}
							value={projectName}
							onChange={handleChangeProjectName}
						/>
						{Constants.IS_DESKTOP && (
							<Flex column spaced>
								<Flex spaced>
									<div>{t('folder.name')}:</div>
									<InputText value={folderName} onChange={handleChangeFolderName} />
								</Flex>
								<Flex rightH>
									<Checkbox isChecked={isAutoGenerate} onChange={setIsAutoGenerate}>
										{t('auto.generate')}
									</Checkbox>
								</Flex>
							</Flex>
						)}
					</Flex>
					{Constants.IS_DESKTOP && (
						<Flex column spaced>
							<div>{t('location')}:</div>
							<Flex spaced>
								<InputText widthType={INPUT_TYPE_WIDTH.FILL} value={location} onChange={setLocation} />
								<Button onClick={handleClickLocation}>...</Button>
							</Flex>
						</Flex>
					)}
				</Flex>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogConfirmOpen}
				footer={<FooterNoYes onNo={cancelCreation} onYes={replaceProject} />}
				onClose={cancelCreation}
			>
				<p>{t('warning.project.exist.overwrite', { path: getcompleteLocation() })}</p>
			</Dialog>
		</>
	);
}

export default DialogNewProject;
