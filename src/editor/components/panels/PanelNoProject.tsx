/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineFileAdd, AiOutlineFolderOpen } from 'react-icons/ai';
import { BiImport } from 'react-icons/bi';
import { FaHandsHelping } from 'react-icons/fa';
import { MdOutlineAddchart } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { BUTTON_TYPE, Constants } from '../../common';
import { Manager } from '../../Editor';
import { RootState, triggerImportProject, triggerNewProject, triggerOpenDialogProject } from '../../store';
import Button from '../Button';
import Flex from '../Flex';
import ProjectPreview from '../ProjectPreview';

function PanelNoProject() {
	const { t } = useTranslation();

	const dispatch = useDispatch();

	const projects = useSelector((state: RootState) => state.projects.list);

	const handleNewProject = () => {
		dispatch(triggerNewProject(true));
	};

	const handleOpenDialogProject = () => {
		dispatch(triggerOpenDialogProject(true));
	};

	const handleImportProject = () => {
		dispatch(triggerImportProject(true));
	};

	const handleDLCs = () => {
		window.open('https://rpg-paper-maker.com/shop/', '_blank');
	};

	const handleContribute = () => {
		window.open('https://rpg-paper-maker.com/contribute/', '_blank');
	};

	const renderProjectsList = () => {
		return projects.length === 0 ? (
			<div className='text-small-detail'>{`${t('no.recent.projects.opened')}.`}</div>
		) : (
			projects.map((project) => <ProjectPreview key={project.location} project={project} />)
		);
	};

	useEffect(() => {
		Manager.GL.mainContext.remove();
	}, []);

	return (
		<Flex column one className='padding-large'>
			<h2 className='mobile-hidden'>{t('recent.projects')}</h2>
			<Flex one spacedLarge className='mobile-column-reverse'>
				<Flex column one>
					<h2 className='mobile-only text-center'>{t('recent.projects')}</h2>
					<div className='scrollable-flex-one'>{renderProjectsList()}</div>
				</Flex>
				<Flex column spaced>
					<Button buttonType={BUTTON_TYPE.PRIMARY} big onClick={handleNewProject}>
						<AiOutlineFileAdd />
						{`${t('new.project')}...`}
					</Button>
					{Constants.IS_DESKTOP && (
						<Button big onClick={handleOpenDialogProject}>
							<AiOutlineFolderOpen />
							{`${t('open.project')}...`}
						</Button>
					)}
					<Button big onClick={handleImportProject}>
						<BiImport />
						{`${Constants.IS_DESKTOP ? t('import.web.project') : t('import.project')}...`}
					</Button>
					<Button big onClick={handleDLCs}>
						<MdOutlineAddchart />
						{t('dlcs')}
					</Button>
					<Button buttonType={BUTTON_TYPE.PATREON} big onClick={handleContribute}>
						<FaHandsHelping />
						{t('contribute')}
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
}

export default PanelNoProject;
