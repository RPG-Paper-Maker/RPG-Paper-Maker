/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState } from 'react';
import FooterNoYes from './footers/FooterNoYes';
import { LocalFile } from '../../core/LocalFile';
import { Model, Scene } from '../../Editor';
import { Project } from '../../core/Project';
import Dialog from './Dialog';
import { Paths } from '../../common/Paths';
import FooterCancelOK from './footers/FooterCancelOK';
import Input from '../Input';
import Loader from '../Loader';
import { useDispatch } from 'react-redux';
import { removeProject } from '../../store';
import { ElementMapKind, LocalForage } from '../../common/Enum';
import { Rectangle } from '../../core/Rectangle';

type Props = {
	isOpen: boolean;
	onAccept: (data: Record<string, any>) => void;
	onReject: () => void;
};

function DialogNewProject({ isOpen, onAccept, onReject }: Props) {
	const [projectName, setProjectName] = useState('Project without name');
	const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();

	const checkValidAccept: () => Promise<boolean> = async () => {
		const projects = await LocalFile.getFolders(LocalForage.Projects);
		if (projects.length === 0) {
			await LocalFile.createFolder(LocalForage.Projects);
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
		await LocalFile.removeFolder(Paths.join(LocalForage.Projects, projectName));
		dispatch(removeProject(projectName));
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
		await Model.Map.createDefaultMap(1);
		await Model.Map.createDefaultMap(2);
		Scene.Map.currentSelectedTexture = new Rectangle();
		Scene.Map.currentSelectedMapElementKind = ElementMapKind.Floors;
		for (const file of Paths.ALL_JSON) {
			await LocalFile.copyPublicFile(
				Paths.join(Paths.ROOT_DIRECTORY_LOCAL, Paths.DEFAULT, file),
				Paths.join(project.getPath(), file)
			);
		}
		await Project.current.save();
		setIsLoading(false);
	};

	const handleChangeProjectName = (e: any) => {
		setProjectName(e.target.value);
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
				<Loader isLoading={isLoading} />
				<div className='flex-center-vertically'>
					<p className='label'>Name:</p>
					<Input value={projectName} onChange={handleChangeProjectName} />
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