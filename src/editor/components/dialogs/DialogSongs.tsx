/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPause, FaPlay, FaStop } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { BUTTON_TYPE, DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, SONG_KIND, Utils } from '../../common';
import { getAllFilesFromFolder, getFiles } from '../../common/Platform';
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

function DialogSongs({
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
		[selectedKind]
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
								false
							)
						),
				  ]
				: [],
		[kind]
	);

	const initialize = () => {
		setIsInitiating(true);
		setNewDynamicSongID(dynamicSongID?.clone());
		setIsSelectedLeftList(true);
		setSongs(Node.createList(Project.current!.songs.getList(selectedKind!)));
		if (songID !== undefined) {
			updateSong(Project.current!.songs.getByID(selectedKind!, songID));
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

	const updateSong = async (song: Model.Song | null) => {
		setSelectedSong(song);
		const path = song?.getPath();
		if (song && path) {
			const { Howl } = await import('howler');
			if (!song.isBR) {
				setSelectedHowl(undefined);
				(async () => {
					const base64 = (await LocalFile.readFile(path)) ?? '';
					setSelectedHowl(
						new Howl({
							src: [base64],
							html5: true,
						})
					);
				})();
			} else {
				setSelectedHowl(
					new Howl({
						src: [path],
						html5: true,
					})
				);
			}
		} else {
			setSelectedHowl(undefined);
		}
	};

	const handleChangeSelectedSong = (node: Node | null) => {
		updateSong((node?.content ?? null) as Model.Song | null);
	};

	const handleRefresh = async () => {
		const files = getAllFilesFromFolder(Model.Song.getFolder(selectedKind!, true, ''));
		const customNames = await getFiles(Model.Song.getFolder(selectedKind!, false, ''));
		setSongsAvailable([
			...Node.createList(
				files.map((name, index) => {
					const song = new Model.Song(selectedKind!);
					song.id = index + 1;
					song.name = name;
					song.isBR = true;
					return song;
				}),
				false
			),
			...Node.createList(
				customNames.map((name, index) => {
					const song = new Model.Song(selectedKind!);
					song.applyDefault();
					song.id = files.length + index + 1;
					song.name = name;
					song.isBR = false;
					song.dlc = '';
					return song;
				}),
				false
			),
		]);
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

	const handleChangeFolder = (node: Node | null) => {
		setSelectedKind(node && node.content.id >= 0 ? node.content.id : undefined);
	};

	const handleListUpdated = () => {
		if (kind === undefined && selectedKind) {
			Project.current!.songs.list[selectedKind] = Node.createListFromNodes(songs);
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
				Project.current!.songs.list[selectedKind!] = songs.map((node) => node.content as Model.Song);
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
		if (isOpen && selectedKind !== undefined) {
			initialize();
		}
	}, [isOpen, selectedKind]);

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
			title={`${title ?? t(kind === undefined ? 'songs.manager' : 'select.song')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			initialWidth='70%'
			initialHeight='70%'
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex spacedLarge fillWidth>
				{kind === undefined && (
					<Flex>
						<Tree
							list={folders}
							minWidth={TREES_MIN_WIDTH}
							onSelectedItem={handleChangeFolder}
							cannotAdd
							cannotEdit
							cannotDragDrop
							cannotDelete
							doNotShowID
						/>
					</Flex>
				)}
				{selectedKind ? (
					<PanelAssetsPreviewer
						assetID={songID}
						dynamicValueID={newDynamicSongID}
						list={songs}
						itemsAvailable={songsAvailable}
						selectedItem={selectedSong}
						isSelectedLeftList={isSelectedLeftList}
						setIsSelectedLeftList={setIsSelectedLeftList}
						isInitiating={isInitiating}
						setIsInitiating={setIsInitiating}
						onChangeSelectedItem={handleChangeSelectedSong}
						onRefresh={handleRefresh}
						onListUpdated={handleListUpdated}
						content={getPreviewerContent()}
						options={getPreviewerOptionsContent()}
						active={active}
						basePath={Model.Song.getFolder(selectedKind, false, '')}
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
