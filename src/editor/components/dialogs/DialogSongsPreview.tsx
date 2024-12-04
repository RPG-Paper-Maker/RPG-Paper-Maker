/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { Howl } from 'howler';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPause, FaPlay, FaStop } from 'react-icons/fa';
import { BUTTON_TYPE, DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, SONG_KIND, Utils } from '../../common';
import { Platform } from '../../common/Platform';
import { Node, Project } from '../../core';
import { DynamicValue } from '../../core/DynamicValue';
import { Model } from '../../Editor';
import useStateBool from '../../hooks/useStateBool';
import useStateDynamicValue from '../../hooks/useStateDynamicValue';
import Button from '../Button';
import Checkbox from '../Checkbox';
import DynamicValueSelector from '../DynamicValueSelector';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import PanelAssetsPreviewer from '../panels/PanelAssetsPreviewer';
import SliderDynamic from '../SliderDynamic';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import FooterOK from './footers/FooterOK';

type Props = {
	title?: string;
	kind: SONG_KIND;
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	songID?: number;
	dynamicSongID?: DynamicValue;
	onAccept?: (song: Model.Song) => void;
	onReject?: () => void;
	active?: boolean;
	displayOptions?: boolean;
	songOptions?: Model.PlaySong;
};

function DialogSongsPreview({
	title,
	kind,
	isOpen,
	setIsOpen,
	songID,
	dynamicSongID,
	onAccept,
	onReject,
	active = false,
	displayOptions = false,
	songOptions,
}: Props) {
	const { t } = useTranslation();

	const [isDialogWarningSelectionOpen, setIsDialogWarningSelectionOpen] = useState(false);
	const [isInitiating, setIsInitiating] = useState(false);
	const [songs, setSongs] = useState<Node[]>([]);
	const [songsAvailable, setSongsAvailable] = useState<Node[]>([]);
	const [selectedSong, setSelectedSong] = useState<Model.Song | null>(null);
	const [isSelectedLeftList, setIsSelectedLeftList] = useState(true);
	const [newDynamicSongID, setNewDynamicSongID] = useState(dynamicSongID);
	const [volume] = useStateDynamicValue();
	const [isStart, setIsStart] = useStateBool();
	const [start] = useStateDynamicValue();
	const [isEnd, setIsEnd] = useStateBool();
	const [end] = useStateDynamicValue();
	const [selectedHowl, setSelectedHowl] = useState<Howl>();
	const [playingHowl, setPlayingHowl] = useState<Howl>();
	const [isPaused, setIsPaused] = useStateBool();
	const [isStopped, setIsStopped] = useStateBool();

	const displayOptionsStartEnd = kind === SONG_KIND.MUSIC || kind === SONG_KIND.BACKGROUND_SOUND;

	const initialize = () => {
		setIsInitiating(true);
		setNewDynamicSongID(dynamicSongID?.clone());
		setIsSelectedLeftList(true);
		setSongs(Node.createList(Project.current!.songs.getList(kind)));
		if (songID !== undefined) {
			const song = Project.current!.songs.getByID(kind, songID);
			setSelectedSong(song);
		}
		start.updateToDefaultNumber(0, true);
		end.updateToDefaultNumber(0, true);
		if (songOptions) {
			volume.copy(songOptions.volume);
			setIsStart(songOptions.isStart);
			if (songOptions.isStart) {
				start.copy(songOptions.start);
			}
			setIsEnd(songOptions.isEnd);
			if (songOptions.isEnd) {
				end.copy(songOptions.end);
			}
		} else {
			volume.updateToDefaultNumber(100);
			setIsStart(false);
			setIsEnd(false);
		}
		setSelectedHowl(undefined);
		setPlayingHowl(undefined);
		setIsPaused(true);
		setIsStopped(true);
		handleRefresh();
	};

	const reset = () => {
		setSelectedSong(null);
		setSongs([]);
		setSongsAvailable([]);
		playingHowl?.stop();
	};

	const handleChangeSelectedSong = (node: Node | null) => {
		const song = (node?.content ?? null) as Model.Song | null;
		setSelectedSong(song);
		const path = song?.getPath();
		setSelectedHowl(
			song && path
				? new Howl({
						src: [path],
						html5: true,
				  })
				: undefined
		);
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

	const handleStop = () => {
		playingHowl!.stop();
		setIsPaused(false);
		setIsStopped(true);
	};

	const handlePause = () => {
		playingHowl!.pause();
		setIsPaused(true);
	};

	const handlePlay = () => {
		if (playingHowl) {
			if (!isPaused) {
				playingHowl.stop();
				if (isStart && start.kind === DYNAMIC_VALUE_KIND.NUMBER_DECIMAL) {
					selectedHowl!.seek(start.value as number);
				}
			}
		}
		setPlayingHowl(selectedHowl);
		selectedHowl!.volume((volume.kind === DYNAMIC_VALUE_KIND.NUMBER ? (volume.value as number) : 100) / 100);
		selectedHowl!.play();
		setIsPaused(false);
		setIsStopped(false);
	};

	const handleAccept = async () => {
		if (selectedSong === null || !isSelectedLeftList) {
			setIsDialogWarningSelectionOpen(true);
		} else {
			Project.current!.songs.list[kind] = songs.map((node) => node.content as Model.Song);
			await Project.current!.songs.save();
			if (active) {
				if (!newDynamicSongID!.isActivated) {
					dynamicSongID!.updateToDefaultNumber(selectedSong.id);
				} else {
					dynamicSongID!.copy(newDynamicSongID!);
				}
			}
			if (songOptions) {
				songOptions.volume.copy(volume);
				songOptions.isStart = isStart;
				if (isStart) {
					songOptions.start.copy(start);
				}
				songOptions.isEnd = isEnd;
				if (isEnd) {
					songOptions.end.copy(end);
				}
			}
			onAccept?.(selectedSong);
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

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	const getPreviewerContent = () => {
		if (selectedSong) {
			return (
				<Flex column spaced centerH centerV fillWidth>
					<Flex spaced>
						<Button
							buttonType={BUTTON_TYPE.RED}
							icon={<FaStop />}
							disabled={isStopped}
							onClick={handleStop}
						/>
						<Button
							buttonType={BUTTON_TYPE.PRIMARY_TEXT}
							icon={<FaPause />}
							disabled={isPaused || isStopped}
							onClick={handlePause}
						/>
						<Button
							buttonType={BUTTON_TYPE.PRIMARY}
							icon={<FaPlay />}
							onClick={handlePlay}
							disabled={!selectedHowl}
						/>
					</Flex>
				</Flex>
			);
		}
	};

	const getPreviewerOptionsContent = () => {
		if (selectedSong && displayOptions) {
			return (
				<Groupbox title={t('options')}>
					<Form>
						<Label>{t('volume')}</Label>
						<Value>
							<Flex spaced centerV>
								<SliderDynamic dynamic={volume} min={0} max={100} unit='%' isVertical />
							</Flex>
						</Value>
						{displayOptionsStartEnd && (
							<>
								<Label>
									<Checkbox isChecked={isStart} onChange={setIsStart}>
										{t('start')}
									</Checkbox>
								</Label>
								<Value>
									<Flex spaced centerV>
										<DynamicValueSelector
											value={start}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
											disabled={!isStart}
										/>
										<div className={Utils.getClassName({ disabledLabel: !isStart })}>s</div>
									</Flex>
								</Value>
								<Label>
									<Checkbox isChecked={isEnd} onChange={setIsEnd}>
										{t('end')}
									</Checkbox>
								</Label>
								<Value>
									<Flex spaced centerV>
										<DynamicValueSelector
											value={end}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
											disabled={!isEnd}
										/>
										<div className={Utils.getClassName({ disabledLabel: !isEnd })}>s</div>
									</Flex>
								</Value>
							</>
						)}
					</Form>
				</Groupbox>
			);
		}
	};

	return (
		<>
			<Dialog
				title={`${title ?? t('select.song')}...`}
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
