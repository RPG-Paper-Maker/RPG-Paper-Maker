/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPause, FaPlay, FaStop } from 'react-icons/fa';
import { Platform } from '../../common/Platform';
import { Node, Project } from '../../core';
import { DynamicValue } from '../../core/DynamicValue';
import { Model } from '../../Editor';
import Button from '../Button';
import Flex from '../Flex';
import PanelAssetsPreviewer from '../panels/PanelAssetsPreviewer';
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
};

function DialogVideosPreview({
	isOpen,
	setIsOpen,
	videoID,
	dynamicVideoID,
	onAccept,
	onReject,
	active = false,
}: Props) {
	const { t } = useTranslation();

	const [isDialogWarningSelectionOpen, setIsDialogWarningSelectionOpen] = useState(false);
	const [isInitiating, setIsInitiating] = useState(false);
	const [videos, setVideos] = useState<Node[]>([]);
	const [videosAvailable, setVideosAvailable] = useState<Node[]>([]);
	const [selectedVideo, setSelectedVideo] = useState<Model.Video | null>(null);
	const [isSelectedLeftList, setIsSelectedLeftList] = useState(true);
	const [newDynamicVideoID, setNewDynamicVideoID] = useState(dynamicVideoID);

	const initialize = () => {
		setIsInitiating(true);
		setNewDynamicVideoID(dynamicVideoID?.clone());
		setIsSelectedLeftList(true);
		setVideos(Node.createList(Project.current!.videos.list));
		if (videoID !== undefined) {
			const video = Project.current!.videos.getByID(videoID);
			setSelectedVideo(video);
		}
		handleRefresh();
	};

	const reset = () => {
		setSelectedVideo(null);
		setVideos([]);
		setVideosAvailable([]);
	};

	const handleChangeSelectedVideo = (node: Node | null) => {
		setSelectedVideo((node?.content ?? null) as Model.Video | null);
	};

	const handleRefresh = async () => {
		const path = Model.Video.getFolder(true, '');
		const files = Platform.getAllFilesFromFolder(path);
		setVideosAvailable(
			Node.createList(
				files.map((name, index) => {
					const video = new Model.Video();
					video.id = index + 1;
					video.name = name;
					video.isBR = true;
					return video;
				}),
				false
			)
		);
	};

	const handleCloseWarningSelectionOpen = () => {
		setIsDialogWarningSelectionOpen(false);
	};

	const handleAccept = async () => {
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
			return null;
		}
	};

	const getPreviewerOptionsContent = () => {
		if (selectedVideo) {
			return (
				<Flex column spaced>
					<Flex one />
					<Flex spaced centerH>
						<Button icon={<FaPause />} disabled />
						<Button icon={<FaStop />} disabled />
						<Button icon={<FaPlay />} disabled />
					</Flex>
				</Flex>
			);
		}
	};

	return (
		<>
			<Dialog
				title={`${t('select.video')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				initialWidth='70%'
				initialHeight='70%'
				onClose={handleReject}
				zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			>
				<PanelAssetsPreviewer
					assetID={videoID}
					dynamicValueID={newDynamicVideoID}
					list={videos}
					setList={setVideos}
					itemsAvailable={videosAvailable}
					selectedItem={selectedVideo}
					isSelectedLeftList={isSelectedLeftList}
					setIsSelectedLeftList={setIsSelectedLeftList}
					isInitiating={isInitiating}
					setIsInitiating={setIsInitiating}
					onChangeSelectedItem={handleChangeSelectedVideo}
					onRefresh={handleRefresh}
					content={getPreviewerContent()}
					options={getPreviewerOptionsContent()}
					active={active}
				/>
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

export default DialogVideosPreview;
