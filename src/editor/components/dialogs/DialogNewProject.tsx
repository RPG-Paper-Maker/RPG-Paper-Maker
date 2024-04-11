/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useRef, useState } from 'react';
import FooterNoYes from './footers/FooterNoYes';
import { Model, Scene } from '../../Editor';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import { useDispatch, useSelector } from 'react-redux';
import { LocalFile, Project } from '../../core';
import {
	Constants,
	ELEMENT_MAP_KIND,
	ExtendedWindow,
	INPUT_TYPE_WIDTH,
	IO,
	JSONType,
	LOCAL_FORAGE,
	Paths,
} from '../../common';
import InputText from '../InputText';
import { RootState, setProjects } from '../../store';
import { EngineSettings } from '../../data/EngineSettings';
import Button from '../Button';
import Checkbox from '../Checkbox';

type Props = {
	isOpen: boolean;
	onAccept: (data: JSONType) => void;
	onReject: () => void;
};

function DialogNewProject({ isOpen, onAccept, onReject }: Props) {
	const [projectName, setProjectName] = useState('Project without name');
	const [folderName, setFolderName] = useState('project-without-name');
	const [isAutoGenerate, setIsAutoGenerate] = useState(true);
	const [location, setLocation] = useState(Paths.GLOBAL_RPM_GAMES);
	const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const projects = useSelector((state: RootState) => state.projects.list);

	const dispatch = useDispatch();

	const checkValidAccept: () => Promise<boolean> = async () => {
		const projects = await LocalFile.getFolders(LOCAL_FORAGE.PROJECTS);
		if (projects.length === 0) {
			await LocalFile.createFolder(LOCAL_FORAGE.PROJECTS);
		}
		if (
			projects.find((name) => {
				return name === projectName;
			})
		) {
			setIsDialogConfirmOpen(true);
			return false;
		}
		return true;
	};

	const accept = () => {
		// Send data to parent
		const data = {
			projectName,
		};
		onAccept(data);
	};

	const replaceProject = async () => {
		setIsDialogConfirmOpen(false);
		const newList = projects.filter((p) => projectName !== p.name);
		dispatch(setProjects(newList));
		if (Constants.IS_DESKTOP) {
			await LocalFile.removeFolder(location);
		} else {
			await LocalFile.removeFolder(Paths.join(LOCAL_FORAGE.PROJECTS, projectName));
		}
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
		const project = new Project(projectName);
		Project.current = project;
		await LocalFile.createFolder(project.getPath());
		await LocalFile.createFolder(project.getPathMaps());
		await Model.Map.createDefaultMap(1, 'Starting map');
		await Model.Map.createDefaultMap(2, 'Default');
		Scene.Map.currentSelectedMapElementKind = ELEMENT_MAP_KIND.FLOOR;
		for (const file of Paths.ALL_JSON) {
			await LocalFile.copyPublicFile(
				Paths.join(Paths.ROOT_DIRECTORY_LOCAL, Paths.DEFAULT, file),
				Paths.join(project.getPath(), file)
			);
		}
		project.settings.projectVersion = Project.VERSION;
		if (Constants.IS_MOBILE) {
			project.settings.projectMenuIndex = 2;
		}
		await project.settings.save();
		await Project.current.save();
		setIsLoading(false);
	};

	const formatFolderName = (name: string) => {
		return name
			.replace(/ /g, '-')
			.replace(/[^a-zA-Z0-9-]/g, '')
			.toLowerCase();
	};

	const handleChangeProjectName = (name: string) => {
		if (isAutoGenerate) {
			setFolderName(formatFolderName(name));
		}
		setProjectName(name);
	};

	const handleChangeFolderName = (name: string) => {
		setFolderName(formatFolderName(name));
	};

	const handleClickLocation = async () => {
		await IO.openFolderDialog((folderName) => {
			setLocation(folderName);
		});
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
