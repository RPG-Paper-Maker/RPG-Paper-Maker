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
import { FaDiscord, FaHandsHelping, FaRegPlayCircle } from 'react-icons/fa';
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

type YoutubeVideos = {
	video?: string;
	short?: string;
};

function getYoutubeVideoId(url: unknown): string | null {
	if (typeof url !== 'string') return null;
	const value = url.trim();
	return (
		value.match(/(?:v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{11})/)?.[1] ??
		(/^[A-Za-z0-9_-]{11}$/.test(value) ? value : null)
	);
}

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
	const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
	const [youtubeShortId, setYoutubeShortId] = useState<string | null>(null);
	const [youtubeShortTitle, setYoutubeShortTitle] = useState<string | null>(null);
	const [youtubeShortThumbnailUrl, setYoutubeShortThumbnailUrl] = useState<string | null>(null);

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

	const fetchYoutubeVideos = async () => {
		try {
			const response = await fetch(
				'https://raw.githubusercontent.com/RPG-Paper-Maker/RPG-Paper-Maker/refs/heads/develop/youtube.json',
				{ cache: 'no-store' },
			);
			if (!response.ok) return;
			const videos = (await response.json()) as YoutubeVideos;
			const videoId = getYoutubeVideoId(videos.video);
			const shortId = getYoutubeVideoId(videos.short);
			if (videoId) setYoutubeVideoId(videoId);
			if (shortId) {
				setYoutubeShortId(shortId);
				setYoutubeShortThumbnailUrl(`https://i.ytimg.com/vi/${shortId}/frame0.jpg`);
			}
		} catch {
			// No internet: leave the previews hidden
		}
	};

	useEffect(() => {
		Manager.GL.mainContext.remove();
		void fetchChangelog();
		void fetchYoutubeVideos();
	}, []);

	useEffect(() => {
		if (!youtubeShortId) return;
		setYoutubeShortTitle(null);
		const controller = new AbortController();
		const fetchYoutubeShortTitle = async () => {
			try {
				const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/shorts/${youtubeShortId}`)}&format=json`;
				const response = await fetch(url, { signal: controller.signal });
				if (!response.ok) return;
				const data = (await response.json()) as { title?: unknown };
				if (typeof data.title === 'string' && data.title.trim()) {
					setYoutubeShortTitle(data.title.trim());
				}
			} catch {
				// No internet: leave the title hidden
			}
		};
		void fetchYoutubeShortTitle();
		return () => controller.abort();
	}, [youtubeShortId]);

	return (
		<Flex column one className='paddingLarge'>
			<Flex one spacedLarge className='mobileColumn'>
				<Flex column two>
					<h2 className='mobileHidden'>{t('recent.projects')}</h2>
					<div className='scrollableFlexOne'>{renderProjectsList()}</div>
				</Flex>
				<Flex column one spaced>
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
					{(youtubeVideoId !== null || youtubeShortId !== null) && (
						<div className='youtubePreviews'>
							{youtubeVideoId !== null && (
								<div className='youtubePreview'>
									<div className='youtubePreviewTitle'>{t('latest.video')}</div>
									<button
										type='button'
										className='youtubePreviewThumbnail'
										aria-label={t('latest.video')}
										onClick={async () =>
											await openWebsite(`https://www.youtube.com/watch?v=${youtubeVideoId}`)
										}
									>
										<img
											className='youtubePreviewFrame'
											src={`https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`}
											alt=''
										/>
										<FaRegPlayCircle className='youtubePlayIcon' />
									</button>
								</div>
							)}
							{youtubeShortId !== null && (
								<div className='youtubePreview youtubeShortPreview'>
									<div className='youtubePreviewTitle'>{t('latest.short')}</div>
									<button
										type='button'
										className='youtubePreviewThumbnail'
										aria-label={t('latest.short')}
										onClick={async () =>
											await openWebsite(`https://www.youtube.com/shorts/${youtubeShortId}`)
										}
									>
										{youtubeShortThumbnailUrl && (
											<img
												className='youtubePreviewFrame youtubeShortFrame'
												src={youtubeShortThumbnailUrl}
												alt=''
												onError={() => {
													const fallback = `https://i.ytimg.com/vi/${youtubeShortId}/hqdefault.jpg`;
													setYoutubeShortThumbnailUrl(
														youtubeShortThumbnailUrl === fallback ? null : fallback,
													);
												}}
											/>
										)}
										<FaRegPlayCircle className='youtubePlayIcon' />
									</button>
									{youtubeShortTitle && (
										<div className='youtubeShortTitle' title={youtubeShortTitle}>
											{youtubeShortTitle}
										</div>
									)}
								</div>
							)}
						</div>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
}

export default PanelNoProject;
