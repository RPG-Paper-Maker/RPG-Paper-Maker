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
import { Constants, Utils } from '../common';
import { Model } from '../Editor';
import { EngineSettings } from '../data/EngineSettings';
import { Platform } from '../common/Platform';
import { RxCross2 } from 'react-icons/rx';
import FooterOK from './dialogs/footers/FooterOK';
import { useTranslation } from 'react-i18next';

type Props = {
	project: Model.ProjectPreview;
};

function ProjectPreview({ project }: Props) {
	const { t } = useTranslation();

	const [isDialogWarningLocationOpen, setIsDialogWarningLocationOpen] = useState(false);
	const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);

	const projects = useSelector((state: RootState) => state.projects.list);

	const dispatch = useDispatch();

	const handleOpenProject = () => {
		dispatch(triggerOpenProject(project));
	};

	const handleClickCloseProject = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
		e.stopPropagation();
		const newList = projects.filter((p) => project.location !== p.location);
		dispatch(setProjects(newList));
		EngineSettings.current.recentProjects = newList;
		await EngineSettings.current.save();
	};

	const handleClickRemoveProject = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
		e.stopPropagation();
		if (await Platform.checkFileExists(project.location)) {
			setIsDialogConfirmOpen(true);
		} else {
			setIsDialogWarningLocationOpen(true);
		}
	};

	const handleCloseWarningLocation = () => {
		setIsDialogWarningLocationOpen(false);
	};

	const handleRejectRemoveProject = () => {
		setIsDialogConfirmOpen(false);
	};

	const handleAcceptRemoveProject = async () => {
		setIsDialogConfirmOpen(false);
		dispatch(setLoading(true));
		const newList = projects.filter((p) => project.location !== p.location);
		dispatch(setProjects(newList));
		await Platform.removeFolder(project.location);
		EngineSettings.current.recentProjects = newList;
		await EngineSettings.current.save();
		dispatch(setLoading(false));
	};

	return (
		<>
			<div
				className={Utils.getClassName({ selected: isDialogConfirmOpen }, 'project-preview')}
				onClick={handleOpenProject}
			>
				<div className='flex-column flex-one gap-small'>
					<div className='title'>{project.name}</div>
					{project.location.length > 0 && <div className='text-small-detail'>{project.location}</div>}
				</div>
				<div className='flex-center-v'>
					{Constants.IS_DESKTOP && <RxCross2 onClick={handleClickCloseProject} />}
					<FaTrashAlt onClick={handleClickRemoveProject} />
				</div>
			</div>
			<Dialog
				title={t('warning')}
				isOpen={isDialogConfirmOpen}
				footer={<FooterNoYes onNo={handleRejectRemoveProject} onYes={handleAcceptRemoveProject} />}
				onClose={handleRejectRemoveProject}
			>
				<div className='warning text-center'>{t('warning.delete.project', { projectName: project.name })}</div>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningLocationOpen}
				footer={<FooterOK onOK={handleCloseWarningLocation} />}
				onClose={handleCloseWarningLocation}
			>
				<div className='text-center'>{t('path.location.doesnt.exists')}.</div>
			</Dialog>
		</>
	);
}

export default ProjectPreview;
