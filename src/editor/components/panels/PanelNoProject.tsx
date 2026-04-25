/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineFileAdd, AiOutlineFolderOpen } from 'react-icons/ai';
import { BiImport } from 'react-icons/bi';
import { FaDiscord, FaHandsHelping } from 'react-icons/fa';
import { MdOutlineAddchart } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { BUTTON_TYPE, Constants } from '../../common';
import { openWebsite } from '../../common/Platform';
import { Project } from '../../core/Project';
import { Manager } from '../../Editor';
import { RootState, triggerImportProject, triggerNewProject, triggerOpenDialogProject } from '../../store';
import '../../styles/ChangelogPreview.css';
import Button from '../Button';
import Flex from '../Flex';
import ProjectPreview from '../ProjectPreview';

function escInline(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function markdownToHtml(md: string): string {
	const parts: string[] = [];
	let inList = false;
	for (const line of md.split('\n')) {
		const t = line.trim();
		if (!t) {
			if (inList) {
				parts.push('</ul>');
				inList = false;
			}
			continue;
		}
		if (t.startsWith('## ')) {
			if (inList) {
				parts.push('</ul>');
				inList = false;
			}
			parts.push(`<h3>${escInline(t.slice(3))}</h3>`);
		} else if (t.startsWith('### ')) {
			if (inList) {
				parts.push('</ul>');
				inList = false;
			}
			parts.push(`<h4>${escInline(t.slice(4))}</h4>`);
		} else if (t.startsWith('- ') || t.startsWith('* ')) {
			if (!inList) {
				parts.push('<ul>');
				inList = true;
			}
			parts.push(`<li>${escInline(t.slice(2))}</li>`);
		} else {
			if (inList) {
				parts.push('</ul>');
				inList = false;
			}
			parts.push(`<p>${escInline(t)}</p>`);
		}
	}
	if (inList) parts.push('</ul>');
	return parts.join('');
}

function PanelNoProject() {
	const { t } = useTranslation();

	const dispatch = useDispatch();

	const projects = useSelector((state: RootState) => state.projects.list);

	const [changelogHtml, setChangelogHtml] = useState<string | null>(null);

	const handleNewProject = () => {
		dispatch(triggerNewProject(true));
	};

	const handleOpenDialogProject = () => {
		dispatch(triggerOpenDialogProject(true));
	};

	const handleImportProject = () => {
		dispatch(triggerImportProject(true));
	};

	const handleDLCs = async () => {
		await openWebsite('https://rpg-paper-maker.com/shop/');
	};

	const handleContribute = async () => {
		await openWebsite('https://rpg-paper-maker.com/contribute/');
	};

	const renderProjectsList = () => {
		return projects.length === 0 ? (
			<div className='textSmallDetail'>{`${t('no.recent.projects.opened')}.`}</div>
		) : (
			projects.map((project) => <ProjectPreview key={project.location} project={project} />)
		);
	};

	const fetchChangelog = async () => {
		try {
			const response = await fetch(
				`https://raw.githubusercontent.com/RPG-Paper-Maker/RPG-Paper-Maker/refs/heads/master/changelogs/${Project.VERSION}.md`,
			);
			if (response.ok) {
				setChangelogHtml(markdownToHtml(await response.text()));
			}
		} catch {
			// No internet: show nothing
		}
	};

	useEffect(() => {
		Manager.GL.mainContext.remove();
		void fetchChangelog();
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
					<Button
						icon={<FaDiscord />}
						big
						onClick={async () => {
							await openWebsite('https://discord.com/invite/QncEnCE');
						}}
					>
						{t('join.discord')}
					</Button>
					<Button buttonType={BUTTON_TYPE.PATREON} big onClick={handleContribute}>
						<FaHandsHelping />
						{t('contribute')}
					</Button>
					<a
						href=''
						onClick={async () =>
							await openWebsite(
								'https://rpg-paper-maker.gitbook.io/rpg-paper-maker/others/convert-a-2.0-project-to-3.0',
							)
						}
					>
						{t('how.convert.project.2.0')}
					</a>
					{changelogHtml !== null && (
						<div className='changelogPreview'>
							<div className='changelogPreviewTitle'>{t('last.update.changes')}</div>
							<div
								className='changelogPreviewContent'
								dangerouslySetInnerHTML={{ __html: changelogHtml }}
							/>
						</div>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
}

export default PanelNoProject;
