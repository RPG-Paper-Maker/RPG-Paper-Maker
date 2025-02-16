/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPause, FaPlay, FaStop } from 'react-icons/fa';
import { Platform } from '../../common/Platform';
import { LocalFile, Node, Project } from '../../core';
import { DynamicValue } from '../../core/DynamicValue';
import { Model } from '../../Editor';
import Button from '../Button';
import Flex from '../Flex';
import Loader from '../Loader';
import PanelAssetsPreviewer from '../panels/PanelAssetsPreviewer';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import FooterOK from './footers/FooterOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	videoID?: number;
	dynamicVideoID?: DynamicValue;
	onAccept?: (video: Model.Video) => void;
	onReject?: () => void;
	active?: boolean;
	manager?: boolean;
};

function DialogVideos({
	isOpen,
	setIsOpen,
	videoID,
	dynamicVideoID,
	onAccept,
	onReject,
	active = false,
	manager = false,
}: Props) {
	const { t } = useTranslation();

	const [isDialogWarningSelectionOpen, setIsDialogWarningSelectionOpen] = useState(false);
	const [isInitiating, setIsInitiating] = useState(false);
	const [videos, setVideos] = useState<Node[]>([]);
	const [videosAvailable, setVideosAvailable] = useState<Node[]>([]);
	const [selectedVideo, setSelectedVideo] = useState<Model.Video | null>(null);
	const [isSelectedLeftList, setIsSelectedLeftList] = useState(true);
	const [newDynamicVideoID, setNewDynamicVideoID] = useState(dynamicVideoID);
	const [loading, setLoading] = useState(false);

	const playerRef = useRef<any>(null);
	const sourceRef = useRef<any>(null);

	const folders = useMemo(() => (manager ? [Node.create(Model.TreeMapTag.create(-1, 'Videos'))] : []), [manager]);
	const isVideoPlayable = useMemo(
		() => !!selectedVideo && selectedVideo.id !== -1 && !loading,
		[selectedVideo, loading]
	);

	const initialize = () => {
		setIsInitiating(true);
		setNewDynamicVideoID(dynamicVideoID?.clone());
		setIsSelectedLeftList(true);
		setVideos(Node.createList(Project.current!.videos.list));
		if (videoID !== undefined) {
			const video = Project.current!.videos.getByID(videoID);
			updateVideo(video);
		}
		handleRefresh();
	};

	const reset = () => {
		setSelectedVideo(null);
		setVideos([]);
		setVideosAvailable([]);
	};

	const updateVideo = (video: Model.Video | null) => {
		setSelectedVideo(video);
		if (video) {
			setLoading(video.id !== -1);
			(async () => {
				const path = video.getPath();
				const base64 = (await LocalFile.readFile(path)) ?? '';
				if (playerRef.current && sourceRef.current) {
					sourceRef.current.src = base64;
					playerRef.current.load();
					playerRef.current.onloadeddata = () => {
						setLoading(false);
					};
				}
			})();
		} else {
			setLoading(false);
		}
	};

	const handleChangeSelectedVideo = (node: Node | null) => {
		updateVideo((node?.content ?? null) as Model.Video | null);
	};

	const handleRefresh = async () => {
		const files = Platform.getAllFilesFromFolder(Model.Video.getFolder(true, ''));
		const customNames = await Platform.getFiles(Model.Video.getFolder(false, ''));
		setVideosAvailable([
			...Node.createList(
				files.map((name, index) => {
					const video = new Model.Video();
					video.id = index + 1;
					video.name = name;
					video.isBR = true;
					video.dlc = '';
					return video;
				}),
				false
			),
			...Node.createList(
				customNames.map((name, index) => {
					const video = new Model.Video();
					video.id = files.length + index + 1;
					video.name = name;
					video.isBR = false;
					video.dlc = '';
					return video;
				}),
				false
			),
		]);
	};

	const handleCloseWarningSelectionOpen = () => {
		setIsDialogWarningSelectionOpen(false);
	};

	const handleListUpdated = () => {
		if (manager) {
			Project.current!.videos.list = Node.createListFromNodes(videos);
		}
	};

	const handleClickStop = () => {
		if (playerRef.current && isVideoPlayable) {
			playerRef.current.pause();
			playerRef.current.currentTime = 0;
		}
	};

	const handleClickPause = () => {
		if (playerRef.current && isVideoPlayable) {
			playerRef.current.pause();
		}
	};

	const handleClickPlay = () => {
		if (playerRef.current && isVideoPlayable) {
			playerRef.current.play();
		}
	};

	const handleAccept = async () => {
		if (manager) {
			setIsOpen(false);
			reset();
			await Project.current!.videos.save();
		} else {
			if (selectedVideo === null || !isSelectedLeftList) {
				setIsDialogWarningSelectionOpen(true);
			} else {
				Project.current!.videos.list = videos.map((node) => node.content as Model.Video);
				await Project.current!.videos.save();
				onAccept?.(selectedVideo);
				if (active) {
					if (!newDynamicVideoID!.isActivated) {
						dynamicVideoID!.updateToDefaultNumber(selectedVideo.id);
					} else {
						dynamicVideoID!.copy(newDynamicVideoID!);
					}
				}
				setIsOpen(false);
				reset();
			}
		}
	};

	const handleReject = async () => {
		onReject?.();
		setSelectedVideo(null);
		setIsOpen(false);
		reset();
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	const getPreviewerContent = () => {
		if (selectedVideo) {
			return (
				<Flex column fillWidth>
					<Flex one />
					<Loader isLoading={loading} />
					<video ref={playerRef} width='100%' height={loading ? 0 : undefined}>
						<source ref={sourceRef} src='' type='video/mp4' />
					</video>
					<Flex one />
				</Flex>
			);
		}
	};

	const getPreviewerOptionsContent = () => {
		if (selectedVideo) {
			return (
				<Flex spaced centerH>
					<Button icon={<FaStop />} onClick={handleClickStop} disabled={!isVideoPlayable} />
					<Button icon={<FaPause />} onClick={handleClickPause} disabled={!isVideoPlayable} />
					<Button icon={<FaPlay />} onClick={handleClickPlay} disabled={!isVideoPlayable} />
				</Flex>
			);
		}
	};

	return (
		<>
			<Dialog
				title={`${t(manager ? 'videos.manager' : 'select.video')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				initialWidth='70%'
				initialHeight='70%'
				onClose={handleReject}
				zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			>
				<Flex spacedLarge fillWidth>
					{manager && (
						<Flex>
							<Tree
								list={folders}
								minWidth={TREES_MIN_WIDTH}
								cannotAdd
								cannotEdit
								cannotDragDrop
								cannotDelete
								doNotShowID
							/>
						</Flex>
					)}
					<PanelAssetsPreviewer
						assetID={videoID}
						dynamicValueID={newDynamicVideoID}
						list={videos}
						itemsAvailable={videosAvailable}
						selectedItem={selectedVideo}
						isSelectedLeftList={isSelectedLeftList}
						setIsSelectedLeftList={setIsSelectedLeftList}
						isInitiating={isInitiating}
						setIsInitiating={setIsInitiating}
						onChangeSelectedItem={handleChangeSelectedVideo}
						onRefresh={handleRefresh}
						onListUpdated={handleListUpdated}
						content={getPreviewerContent()}
						options={getPreviewerOptionsContent()}
						active={active}
						basePath={Model.Video.getFolder(false, '')}
						importTypes='video/mp4,video/x-m4v,video/*'
					/>
				</Flex>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningSelectionOpen}
				footer={<FooterOK onOK={handleCloseWarningSelectionOpen} />}
				onClose={handleCloseWarningSelectionOpen}
				zIndex={Z_INDEX_LEVEL.LAYER_TOP}
			>
				<p>{t('warning.asset.selection')}</p>
			</Dialog>
		</>
	);
}

export default DialogVideos;
