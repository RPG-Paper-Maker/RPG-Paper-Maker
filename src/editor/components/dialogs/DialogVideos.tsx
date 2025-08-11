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
import { useDispatch } from 'react-redux';
import { BUTTON_TYPE, Constants } from '../../common';
import { getAllFilesFromFolder, getFiles } from '../../common/Platform';
import { DynamicValue } from '../../core/DynamicValue';
import { LocalFile } from '../../core/LocalFile';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import { showWarning } from '../../store';
import Button from '../Button';
import Flex from '../Flex';
import Loader from '../Loader';
import PanelAssetsPreviewer from '../panels/PanelAssetsPreviewer';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

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

	const [isInitiating, setIsInitiating] = useState(false);
	const [videos, setVideos] = useState<Node[]>([]);
	const [videosAvailable, setVideosAvailable] = useState<Node[]>([]);
	const [selectedVideo, setSelectedVideo] = useState<Model.Video | null>(null);
	const [isSelectedLeftList, setIsSelectedLeftList] = useState(true);
	const [newDynamicVideoID, setNewDynamicVideoID] = useState(dynamicVideoID);
	const [loading, setLoading] = useState(false);

	const playerRef = useRef<HTMLVideoElement>(null);
	const sourceRef = useRef<HTMLSourceElement>(null);

	const dispatch = useDispatch();

	const folders = useMemo(() => (manager ? [Node.create(Model.TreeMapTag.create(-1, 'Videos'))] : []), [manager]);
	const isVideoPlayable = useMemo(
		() => !!selectedVideo && selectedVideo.id !== -1 && !loading,
		[selectedVideo, loading]
	);

	const initialize = async () => {
		setIsInitiating(true);
		setNewDynamicVideoID(dynamicVideoID?.clone());
		setIsSelectedLeftList(true);
		setVideos(Node.createList(Project.current!.videos.list));
		if (videoID !== undefined) {
			const video = Project.current!.videos.getByID(videoID);
			await updateVideo(video);
		}
		await handleRefresh();
	};

	const reset = () => {
		setSelectedVideo(null);
		setVideos([]);
		setVideosAvailable([]);
	};

	const updateVideo = async (video: Model.Video | null) => {
		setSelectedVideo(video);
		if (video) {
			setLoading(video.id !== -1);
			if (playerRef.current && sourceRef.current) {
				const path = video.getPath();
				sourceRef.current.src = Constants.IS_DESKTOP ? path : (await LocalFile.readFile(path)) ?? '';
				playerRef.current.load();
				playerRef.current.onloadeddata = () => {
					setLoading(false);
				};
			}
		} else {
			setLoading(false);
		}
	};

	const handleChangeSelectedVideo = async (node: Node | null) => {
		await updateVideo((node?.content ?? null) as Model.Video | null);
	};

	const handleRefresh = async () => {
		const files = await getAllFilesFromFolder(Model.Video.getFolder(true, ''));
		const customNames = await getFiles(Model.Video.getFolder(false, ''));
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

	const handleClickPlay = async () => {
		if (playerRef.current && isVideoPlayable) {
			await playerRef.current.play();
		}
	};

	const handleAccept = async () => {
		if (manager) {
			setIsOpen(false);
			reset();
			await Project.current!.videos.save();
		} else {
			if (selectedVideo === null || !isSelectedLeftList) {
				dispatch(showWarning(t('warning.asset.selection')));
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
			initialize().catch(console.error);
		}
	}, [isOpen]);

	const getPreviewerContent = () => {
		if (selectedVideo) {
			return (
				<Flex column fillWidth>
					<Flex one />
					<Loader isLoading={loading} />
					<video ref={playerRef} width='100%' height={loading ? 0 : undefined}>
						<source ref={sourceRef} type='video/mp4' />
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
					<Button
						buttonType={BUTTON_TYPE.RED}
						icon={<FaStop />}
						onClick={handleClickStop}
						disabled={!isVideoPlayable}
					/>
					<Button
						buttonType={BUTTON_TYPE.PRIMARY_TEXT}
						icon={<FaPause />}
						onClick={handleClickPause}
						disabled={!isVideoPlayable}
					/>
					<Button
						buttonType={BUTTON_TYPE.PRIMARY}
						icon={<FaPlay />}
						onClick={handleClickPlay}
						disabled={!isVideoPlayable}
					/>
				</Flex>
			);
		}
	};

	return (
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
							constructorType={Model.TreeMapTag}
							list={folders}
							minWidth={TREES_MIN_WIDTH}
							cannotAdd
							cannotEdit
							cannotDragDrop
							cannotDelete
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
	);
}

export default DialogVideos;
