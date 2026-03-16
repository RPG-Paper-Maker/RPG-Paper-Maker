/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPause, FaPlay, FaStop } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import {
	BUTTON_TYPE,
	Constants,
	DYNAMIC_VALUE_KIND,
	DYNAMIC_VALUE_OPTIONS_TYPE,
	KEY,
	SONG_KIND,
	Utils,
} from '../../common';
import { DynamicValue } from '../../core/DynamicValue';
import { LocalFile } from '../../core/LocalFile';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Model } from '../../Editor';
import useStateBool from '../../hooks/useStateBool';
import useStateDynamicValue from '../../hooks/useStateDynamicValue';
import { showWarning } from '../../store';
import Button from '../Button';
import Checkbox from '../Checkbox';
import DynamicValueSelector from '../DynamicValueSelector';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import PanelAssetsPreviewer from '../panels/PanelAssetsPreviewer';
import SliderDynamic from '../SliderDynamic';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	title?: string;
	kind?: SONG_KIND;
	setIsOpen: (b: boolean) => void;
	songID?: number;
	dynamicSongID?: DynamicValue;
	onAccept?: (song: Model.Song) => void;
	onReject?: () => void;
	active?: boolean;
	displayOptions?: boolean;
	songOptions?: Model.PlaySong;
};

function DialogSongs({
	title,
	kind,
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
	const [selectedKind, setSelectedKind] = useState(kind);

	const dispatch = useDispatch();

	const displayOptionsStartEnd = useMemo(
		() => selectedKind === SONG_KIND.MUSIC || selectedKind === SONG_KIND.BACKGROUND_SOUND,
		[selectedKind],
	);
	const folders = useMemo(
		() =>
			kind === undefined
				? [
						Node.create(
							Model.TreeMapTag.create(-1, 'Songs'),
							Node.createList(
								[
									Model.TreeMapTag.create(SONG_KIND.MUSIC, 'Musics'),
									Model.TreeMapTag.create(SONG_KIND.BACKGROUND_SOUND, 'BackgroundSounds'),
									Model.TreeMapTag.create(SONG_KIND.SOUND, 'Sounds'),
									Model.TreeMapTag.create(SONG_KIND.MUSIC_EFFECT, 'MusicEffects'),
								],
								false,
							),
						),
					]
				: [],
		[kind],
	);

	const initialize = async () => {
		setIsInitiating(true);
		setNewDynamicSongID(dynamicSongID?.clone());
		setIsSelectedLeftList(true);
		setSongs(Node.createList(Project.current!.songs.getList(selectedKind!)));
		if (songID !== undefined) {
			await updateSong(Project.current!.songs.getByID(selectedKind!, songID));
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
		setPlayingHowl(undefined);
		setIsPaused(true);
		setIsStopped(true);
	};

	const reset = () => {
		setSelectedSong(null);
		setSongs([]);
		setSongsAvailable([]);
		playingHowl?.stop();
	};

	const updateSong = async (song: Model.Song | null) => {
		setSelectedSong(song);
		const path = song?.getPath();
		if (song && path) {
			const { Howl } = await import('howler');
			if (!song.isBR) {
				setSelectedHowl(undefined);
				setSelectedHowl(
					new Howl({
						src: [Constants.IS_DESKTOP ? path : ((await LocalFile.readFile(path)) ?? '')],
						html5: true,
					}),
				);
			} else {
				setSelectedHowl(
					new Howl({
						src: [path],
						html5: true,
					}),
				);
			}
		} else {
			setSelectedHowl(undefined);
		}
	};

	const handleChangeSelectedSong = async (node: Node | null) => {
		await updateSong((node?.content ?? null) as Model.Song | null);
	};

	const getFolder = (isBR = true, dlc = '') => Model.Song.getFolder(selectedKind!, isBR, dlc);

	const callBackCreateAsset = (id: number, name: string, isBR = true, dlc = '') =>
		Model.Song.createSong(selectedKind!, id, name, isBR, dlc);

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
		if (selectedHowl) {
			if (playingHowl) {
				if (!isPaused) {
					playingHowl.stop();
					if (isStart && start.kind === DYNAMIC_VALUE_KIND.NUMBER_DECIMAL) {
						selectedHowl.seek(start.value as number);
					}
				}
			}
			setPlayingHowl(selectedHowl);
			selectedHowl.volume((volume.kind === DYNAMIC_VALUE_KIND.NUMBER ? (volume.value as number) : 100) / 100);
			selectedHowl.play();
			setIsPaused(false);
			setIsStopped(false);
		}
	};

	const handleChangeFolder = (node: Node | null) => {
		setSelectedKind(node && node.content.id >= 0 ? node.content.id : undefined);
	};

	const handleListUpdated = () => {
		if (kind === undefined && selectedKind) {
			Project.current!.songs.list.set(selectedKind, Node.createListFromNodes(songs));
		}
	};

	const handleAccept = async () => {
		if (kind === undefined) {
			setIsOpen(false);
			reset();
			await Project.current!.songs.save();
		} else {
			if (selectedSong === null || !isSelectedLeftList) {
				dispatch(showWarning(t('warning.asset.selection')));
			} else {
				Project.current!.songs.list.set(
					selectedKind!,
					songs.map((node) => node.content as Model.Song),
				);
				await Project.current!.songs.save();
				if (active) {
					if (!newDynamicSongID!.isActivated) {
						dynamicSongID!.updateToDefaultNumber(selectedSong.id);
						dynamicSongID!.isActivated = false;
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
		}
	};

	const handleReject = async () => {
		if (kind === undefined) {
			await Project.current!.songs.load();
		}
		onReject?.();
		setSelectedSong(null);
		setIsOpen(false);
		reset();
	};

	useLayoutEffect(() => {
		if (selectedKind === undefined) {
			reset();
		}
	}, [selectedKind]);

	useLayoutEffect(() => {
		if (selectedKind !== undefined) {
			initialize().catch(console.error);
		}
	}, [selectedKind]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === KEY.ENTER || event.key === KEY.SPACE) {
				handlePlay();
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [selectedHowl, playingHowl, isPaused, volume, isStart, start]);

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
		<Dialog
			title={`${title ?? t('songs.manager')}`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			initialWidth={window.innerWidth <= 1000 ? '100%' : '80%'}
			initialHeight='calc(100% - 50px)'
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex columnMobile spacedLarge fillWidth>
				{kind === undefined && (
					<Flex>
						<Tree
							constructorType={Model.TreeMapTag}
							list={folders}
							minWidth={TREES_MIN_WIDTH}
							onSelectedItem={handleChangeFolder}
							cannotAdd
							cannotEdit
							cannotDragDrop
							cannotDelete
						/>
					</Flex>
				)}
				{selectedKind ? (
					<PanelAssetsPreviewer
						assetID={songID}
						dynamicValueID={newDynamicSongID}
						list={songs}
						itemsAvailable={songsAvailable}
						setItemsAvailable={setSongsAvailable}
						selectedItem={selectedSong}
						isSelectedLeftList={isSelectedLeftList}
						setIsSelectedLeftList={setIsSelectedLeftList}
						isInitiating={isInitiating}
						setIsInitiating={setIsInitiating}
						onChangeSelectedItem={handleChangeSelectedSong}
						getFolder={getFolder}
						callBackCreateAsset={callBackCreateAsset}
						onListUpdated={handleListUpdated}
						onDoubleClickLeftList={handlePlay}
						content={getPreviewerContent()}
						options={getPreviewerOptionsContent()}
						active={active}
						basePath={Model.Song.getLocalFolder(selectedKind)}
						importTypes='audio/mp3, audio/ogg, audio/wav'
					/>
				) : (
					<Flex one />
				)}
			</Flex>
		</Dialog>
	);
}

export default DialogSongs;
