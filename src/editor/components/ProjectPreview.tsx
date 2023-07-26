/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState } from 'react';
import '../styles/MenuSub.css';
import { ProjectState, removeProject, setLoading } from '../store/slices/ProjectsReducer';
import '../styles/ProjectPreview.css';
import { FaTrashAlt } from 'react-icons/fa';
import Dialog from './dialogs/Dialog';
import FooterYesNo from './dialogs/footers/FooterYesNo';
import { useDispatch } from 'react-redux';
import { triggerOpenProject } from '../store';
import { LocalFile } from '../core/LocalFile';
import { Paths } from '../common/Paths';
import { Utils } from '../common/Utils';
import { LocalForage } from '../common/Enum';

type Props = {
	project: ProjectState;
};

function ProjectPreview({ project }: Props) {
	const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);
	const dispatch = useDispatch();

	const handleOpenProject = () => {
		dispatch(triggerOpenProject(project.name));
	};

	const handleRemoveProject = (e: any) => {
		e.stopPropagation();
		setIsDialogConfirmOpen(true);
	};

	const handleRejectRemoveProject = () => {
		setIsDialogConfirmOpen(false);
	};

	const handleAcceptRemoveProject = async () => {
		setIsDialogConfirmOpen(false);
		dispatch(setLoading(true));
		await LocalFile.removeFolder(Paths.join(LocalForage.Projects, project.name));
		dispatch(removeProject(project.name));
		dispatch(setLoading(false));
	};

	return (
		<>
			<div
				className={Utils.getClassName([[isDialogConfirmOpen, 'selected']], ['project-preview'])}
				onClick={handleOpenProject}
			>
				<div className='flex-one'>
					<div className='title'>{project.name}</div>
					{project.location.length > 0 && <div>{project.location}</div>}
				</div>
				<div>
					<FaTrashAlt onClick={handleRemoveProject} />
				</div>
			</div>
			<Dialog
				title='Warning'
				isOpen={isDialogConfirmOpen}
				footer={<FooterYesNo onNo={handleRejectRemoveProject} onYes={handleAcceptRemoveProject} />}
				onClose={handleRejectRemoveProject}
			>
				<div className='warning text-center'>
					Are you sure that you want to delete <b>{project.name}</b>?<div>All will be lost forever.</div>
				</div>
			</Dialog>
		</>
	);
}

export default ProjectPreview;
