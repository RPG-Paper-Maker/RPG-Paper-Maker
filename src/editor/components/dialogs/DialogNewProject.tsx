/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState } from 'react';
import FooterNoYes from './footers/FooterNoYes';
import { Model, Scene } from '../../Editor';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import { useDispatch, useSelector } from 'react-redux';
import { Project } from '../../core';
import { Constants, ELEMENT_MAP_KIND, INPUT_TYPE_WIDTH, IO, Paths, Utils } from '../../common';
import InputText from '../InputText';
import { RootState, setProjects } from '../../store';
import { EngineSettings } from '../../data/EngineSettings';
import Button from '../Button';
import Checkbox from '../Checkbox';
import { Platform } from '../../common/Platform';

type Props = {
	isOpen: boolean;
	onAccept: (data: Model.ProjectPreview) => void;
	onReject: () => void;
};

function DialogNewProject({ isOpen, onAccept, onReject }: Props) {
	const [projectName, setProjectName] = useState('Project without name');
	const [folderName, setFolderName] = useState('project-without-name');
	const [isAutoGenerate, setIsAutoGenerate] = useState(true);
	const [location, setLocation] = useState(Paths.getRPMGamesFolder());
	const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const projects = useSelector((state: RootState) => state.projects.list);

	const dispatch = useDispatch();

	const getcompleteLocation = () => Paths.join(location, folderName);

	const checkValidAccept: () => Promise<boolean> = async () => {
		// Check if folder name already exists in this folder location
		const projectsFolders = await Platform.getFolders(location);
		if (projectsFolders.find((name) => folderName === name)) {
			setIsDialogConfirmOpen(true);
			return false;
		}
		return true;
	};

	const accept = () => {
		onAccept(Model.ProjectPreview.create(projectName, getcompleteLocation()));
	};

	const replaceProject = async () => {
		setIsDialogConfirmOpen(false);
		const newList = projects.filter((p) => projectName !== p.name);
		dispatch(setProjects(newList));
		await Platform.removeFolder(Paths.join(location, projectName));
		EngineSettings.current.recentProjects = newList;
		await EngineSettings.current.save();
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
		const project = new Project(projectName, getcompleteLocation());
		Project.current = project;
		await Platform.createFolder(project.getPath());
		await Platform.createFolder(project.getPathSaves());
		await Platform.createFolder(project.getPathMaps());
		await Model.Map.createDefaultMap(1, 'Starting map');
		await Model.Map.createDefaultMap(2, 'Default');
		Scene.Map.currentSelectedMapElementKind = ELEMENT_MAP_KIND.FLOOR;
		for (const file of Paths.ALL_JSON) {
			await Platform.copyPublicFile(Paths.join(Paths.DEFAULT, file), Paths.join(project.getPath(), file));
		}
		project.settings.projectVersion = Project.VERSION;
		if (Constants.IS_MOBILE) {
			project.settings.projectMenuIndex = 2;
		}
		await project.settings.save();
		await Project.current.save();
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
		const folderName = await IO.openFolderDialog();
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

	return (
		<>
			<Dialog
				title='New project...'
				isOpen={isOpen}
				isLoading={isLoading}
				isDisabled={isDialogConfirmOpen}
				footer={<FooterCancelOK onCancel={onReject} onOK={handleAccept} />}
				onClose={onReject}
			>
				<div className='flex-column gap-small'>
					<div className='flex gap-small'>
						<div>Name:</div>
						<InputText value={projectName} onChange={handleChangeProjectName} />
						{Constants.IS_DESKTOP && (
							<div className='flex-columns'>
								<div className='flex gap-small'>
									<div>Folder name:</div>
									<InputText value={folderName} onChange={handleChangeFolderName} />
								</div>
								<div className='flex-right-horizontally'>
									<Checkbox isChecked={isAutoGenerate} onChange={setIsAutoGenerate}>
										Auto-generate
									</Checkbox>
								</div>
							</div>
						)}
					</div>
					{Constants.IS_DESKTOP && (
						<div className='flex-column gap-small'>
							<div>Location:</div>
							<div className='flex gap-small'>
								<InputText widthType={INPUT_TYPE_WIDTH.FILL} value={location} onChange={setLocation} />
								<Button onClick={handleClickLocation}>...</Button>
							</div>
						</div>
					)}
				</div>
			</Dialog>
			<Dialog
				title='Warning'
				isOpen={isDialogConfirmOpen}
				footer={<FooterNoYes onNo={cancelCreation} onYes={replaceProject} />}
				onClose={cancelCreation}
			>
				<p>This project name already exists. Would you like to replace it?</p>
			</Dialog>
		</>
	);
}

export default DialogNewProject;
