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
import { SONG_KIND } from '../../common';
import { Platform } from '../../common/Platform';
import { Node, Project } from '../../core';
import { DynamicValue } from '../../core/DynamicValue';
import { Model } from '../../Editor';
import PanelAssetsPreviewer from '../panels/PanelAssetsPreviewer';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import FooterOK from './footers/FooterOK';

type Props = {
	kind: SONG_KIND;
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	songID?: number;
	dynamicSongID?: DynamicValue;
	onAccept?: (song: Model.Song) => void;
	onReject?: () => void;
	active?: boolean;
};

function DialogSongsPreview({
	kind,
	isOpen,
	setIsOpen,
	songID,
	dynamicSongID,
	onAccept,
	onReject,
	active = false,
}: Props) {
	const { t } = useTranslation();

	const [isDialogWarningSelectionOpen, setIsDialogWarningSelectionOpen] = useState(false);
	const [isInitiating, setIsInitiating] = useState(false);
	const [songs, setSongs] = useState<Node[]>([]);
	const [songsAvailable, setSongsAvailable] = useState<Node[]>([]);
	const [selectedSong, setSelectedSong] = useState<Model.Song | null>(null);
	const [isSelectedLeftList, setIsSelectedLeftList] = useState(true);
	const [newDynamicSongID, setNewDynamicSongID] = useState(dynamicSongID);

	const initialize = () => {
		setIsInitiating(true);
		setNewDynamicSongID(dynamicSongID?.clone());
		setIsSelectedLeftList(true);
		setSongs(Node.createList(Project.current!.songs.getList(kind)));
		if (songID !== undefined) {
			const song = Project.current!.songs.getByID(kind, songID);
			setSelectedSong(song);
		}
		handleRefresh();
	};

	const reset = () => {
		setSelectedSong(null);
		setSongs([]);
		setSongsAvailable([]);
	};

	const handleChangeSelectedSong = (node: Node | null) => {
		setSelectedSong((node?.content ?? null) as Model.Song | null);
	};

	const handleRefresh = async () => {
		const path = Model.Song.getFolder(kind, true, '');
		const files = Platform.getAllFilesFromFolder(path);
		setSongsAvailable(
			Node.createList(
				files.map((name, index) => {
					const song = new Model.Song(kind);
					song.id = index + 1;
					song.name = name;
					song.isBR = true;
					return song;
				}),
				false
			)
		);
	};

	const handleCloseWarningSelectionOpen = () => {
		setIsDialogWarningSelectionOpen(false);
	};

	const handleAccept = async () => {
		if (selectedSong === null || !isSelectedLeftList) {
			setIsDialogWarningSelectionOpen(true);
		} else {
			Project.current!.songs.list[kind] = songs.map((node) => node.content as Model.Song);
			await Project.current!.songs.save();
			onAccept?.(selectedSong);
			if (active) {
				if (!newDynamicSongID!.isActivated) {
					dynamicSongID!.updateToDefaultNumber(selectedSong.id);
				} else {
					dynamicSongID!.copy(newDynamicSongID!);
				}
			}
			setIsOpen(false);
			reset();
		}
	};

	const handleReject = async () => {
		onReject?.();
		setSelectedSong(null);
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
		if (selectedSong) {
			return null;
		}
	};

	const getPreviewerOptionsContent = () => {
		if (selectedSong) {
			return null;
		}
	};

	return (
		<>
			<Dialog
				title={`${t('select.song')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				initialWidth='70%'
				initialHeight='70%'
				onClose={handleReject}
				zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			>
				<PanelAssetsPreviewer
					assetID={songID}
					dynamicValueID={newDynamicSongID}
					list={songs}
					setList={setSongs}
					itemsAvailable={songsAvailable}
					selectedItem={selectedSong}
					isSelectedLeftList={isSelectedLeftList}
					setIsSelectedLeftList={setIsSelectedLeftList}
					isInitiating={isInitiating}
					setIsInitiating={setIsInitiating}
					onChangeSelectedItem={handleChangeSelectedSong}
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

export default DialogSongsPreview;
