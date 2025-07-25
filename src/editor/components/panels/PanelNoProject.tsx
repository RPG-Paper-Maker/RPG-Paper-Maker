/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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
import { openWebsite } from '../../common/Platform';
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
		openWebsite('https://rpg-paper-maker.com/shop/');
	};

	const handleContribute = () => {
		openWebsite('https://rpg-paper-maker.com/contribute/');
	};

	const renderProjectsList = () => {
		return projects.length === 0 ? (
			<div className='textSmallDetail'>{`${t('no.recent.projects.opened')}.`}</div>
		) : (
			projects.map((project) => <ProjectPreview key={project.location} project={project} />)
		);
	};

	useEffect(() => {
		Manager.GL.mainContext.remove();
	}, []);

	return (
		<Flex column one className='paddingLarge'>
			<h2 className='mobileHidden'>{t('recent.projects')}</h2>
			<Flex one spacedLarge className='mobileColumnReverse'>
				<Flex column one>
					<h2 className='mobileOnly textCenter'>{t('recent.projects')}</h2>
					<div className='scrollableFlexOne'>{renderProjectsList()}</div>
				</Flex>
				<Flex column spaced>
					<Button buttonType={BUTTON_TYPE.PRIMARY} big onClick={handleNewProject}>
						<AiOutlineFileAdd />
						{`${t('new.project')}...`}
					</Button>
					{Constants.IS_DESKTOP ? (
						<Button big onClick={handleOpenDialogProject}>
							<AiOutlineFolderOpen />
							{`${t('open.project')}...`}
						</Button>
					) : (
						<Button big onClick={handleImportProject}>
							<BiImport />
							{`${t('import.project')}...`}
						</Button>
					)}
					<Button big onClick={handleDLCs}>
						<MdOutlineAddchart />
						{t('dlcs')}
					</Button>
					<Button buttonType={BUTTON_TYPE.PATREON} big onClick={handleContribute}>
						<FaHandsHelping />
						{t('contribute')}
					</Button>
					{!Constants.IS_DESKTOP && (
						<a
							href={
								'https://rpg-paper-maker.gitbook.io/rpg-paper-maker/others/convert-a-2.0-project-to-3.0'
							}
							target='_blank'
							rel='noreferrer'
						>
							{t('how.convert.project.2.0')}
						</a>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
}

export default PanelNoProject;
