/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useState } from 'react';
import '../styles/MenuSub.css';
import { setLoading, setProjects } from '../store/slices/ProjectsReducer';
import '../styles/ProjectPreview.css';
import { FaTrashAlt } from 'react-icons/fa';
import Dialog from './dialogs/Dialog';
import FooterNoYes from './dialogs/footers/FooterNoYes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, triggerOpenProject } from '../store';
import { LocalFile } from '../core';
import { Constants, LOCAL_FORAGE, Paths, Utils } from '../common';
import { Model } from '../Editor';
import { EngineSettings } from '../data/EngineSettings';

type Props = {
	project: Model.ProjectPreview;
};

function ProjectPreview({ project }: Props) {
	const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);

	const projects = useSelector((state: RootState) => state.projects.list);

	const dispatch = useDispatch();

	const handleOpenProject = () => {
		dispatch(triggerOpenProject(project.name));
	};

	const handleClickRemoveProject = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
		e.stopPropagation();
		setIsDialogConfirmOpen(true);
	};

	const handleRejectRemoveProject = () => {
		setIsDialogConfirmOpen(false);
	};

	const handleAcceptRemoveProject = async () => {
		setIsDialogConfirmOpen(false);
		dispatch(setLoading(true));
		const newList = projects.filter((p) => project.name !== p.name);
		dispatch(setProjects(newList));
		if (Constants.IS_DESKTOP) {
			await LocalFile.removeFolder(project.location);
		} else {
			await LocalFile.removeFolder(Paths.join(LOCAL_FORAGE.PROJECTS, project.name));
		}
		EngineSettings.current.recentProjects = newList;
		await EngineSettings.current.save();
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
					<FaTrashAlt onClick={handleClickRemoveProject} />
				</div>
			</div>
			<Dialog
				title='Warning'
				isOpen={isDialogConfirmOpen}
				footer={<FooterNoYes onNo={handleRejectRemoveProject} onYes={handleAcceptRemoveProject} />}
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
