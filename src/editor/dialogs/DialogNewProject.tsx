/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState } from 'react';
import FooterYesNo from './footers/FooterYesNo';
import { Enum } from '../common/Enum';
import { LocalFile } from '../core/LocalFile';
import { Model, Scene } from '../Editor';
import { Project } from '../core/Project';
import Dialog from '../components/Dialog';
import { Paths } from '../common/Paths';
import FooterCancelOK from './footers/FooterCancelOK';
import Input from '../components/Input';

type Props = {
	isOpen: boolean;
	onAccept: (data: Record<string, any>) => void;
	onReject: () => void;
};

function DialogNewProject({ isOpen, onAccept, onReject }: Props) {
	const [projectName, setProjectName] = useState('Project without name');
	const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);

	const checkValidAccept: () => Promise<boolean> = async () => {
		let projects = await LocalFile.getFolders(Enum.LocalForage.Projects);
		if (projects.length === 0) {
			await LocalFile.createFolder(Enum.LocalForage.Projects);
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
			projectName: projectName,
		};
		onAccept(data);
	};

	const replaceProject = async () => {
		await LocalFile.removeFolder(Paths.join(Enum.LocalForage.Projects, projectName));
		await createProject();
		setIsDialogConfirmOpen(false);
		accept();
	};

	const cancelCreation = () => {
		setIsDialogConfirmOpen(false);
	};

	const createProject = async () => {
		if (Scene.Map.current) {
			Scene.Map.current.close();
		}
		Scene.Map.current = null;
		let project = new Project(projectName);
		Project.current = project;
		await LocalFile.createFolder(project.getPath());
		await LocalFile.createFolder(project.getPathMaps());
		await Model.Map.createDefault();
		await Project.current.save();
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
				isDisabled={isDialogConfirmOpen}
				footer={<FooterCancelOK onCancel={onReject} onOK={handleAccept} />}
				onClose={onReject}
			>
				<div className='flex-center-vertically'>
					<p className='label'>Name:</p>
					<Input value={projectName} onChange={handleChangeProjectName} />
				</div>
			</Dialog>
			<Dialog
				title='Error'
				isOpen={isDialogConfirmOpen}
				footer={<FooterYesNo onNo={cancelCreation} onYes={replaceProject} />}
				onClose={cancelCreation}
			>
				<p>This project name already exists. Would you like to replace it?</p>
			</Dialog>
		</>
	);
}

export default DialogNewProject;
