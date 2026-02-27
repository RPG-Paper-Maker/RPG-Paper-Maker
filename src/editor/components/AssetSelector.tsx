/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { JSX, useCallback, useEffect, useState } from 'react';
import { AiOutlinePicture } from 'react-icons/ai';
import { BiPyramid } from 'react-icons/bi';
import { BsMusicNote } from 'react-icons/bs';
import { TfiVideoClapper } from 'react-icons/tfi';
import { CUSTOM_SHAPE_KIND, DYNAMIC_VALUE_KIND, PICTURE_KIND, SONG_KIND } from '../common';
import { DynamicValue } from '../core/DynamicValue';
import { Node } from '../core/Node';
import { Project } from '../core/Project';
import { Rectangle } from '../core/Rectangle';
import { Model } from '../Editor';
import Button from './Button';
import DialogPictures from './dialogs/DialogPictures';
import DialogShapes from './dialogs/DialogShapes';
import DialogSongs from './dialogs/DialogSongs';
import DialogVideos from './dialogs/DialogVideos';
import Flex from './Flex';
import Tree, { TREES_MIN_WIDTH } from './Tree';

export enum ASSET_SELECTOR_TYPE {
	PICTURES,
	SHAPES,
	SONGS,
	VIDEOS,
}

type Props = {
	selectionType: ASSET_SELECTOR_TYPE;
	selectedID?: number;
	selectedDynamic?: DynamicValue;
	indexX?: number;
	indexY?: number;
	kind?: number;
	songOptions?: Model.PlaySong;
	onChange?: (id: number, indexX: number, indexY: number) => void;
	disabled?: boolean;
	active?: boolean;
};

const DEFAULT_PICTURE_KIND = PICTURE_KIND.PICTURES;
const DEFAULT_CUSTOM_SHAPE_KIND = CUSTOM_SHAPE_KIND.OBJ;
const DEFAULT_SONG_KIND = SONG_KIND.MUSIC;

function AssetSelector({
	selectionType,
	selectedID = -1,
	selectedDynamic,
	indexX,
	indexY,
	kind,
	songOptions,
	onChange,
	disabled = false,
	active = false,
}: Props) {
	const getSelectedID = () =>
		selectedDynamic && selectedDynamic.kind === DYNAMIC_VALUE_KIND.NUMBER
			? (selectedDynamic.value as number)
			: selectedID;

	const getSelectedItem = useCallback(() => {
		let base: Model.Base | null = null;
		switch (selectionType) {
			case ASSET_SELECTOR_TYPE.PICTURES:
				base = Project.current!.pictures.getByID(kind ?? DEFAULT_PICTURE_KIND, getSelectedID());
				break;
			case ASSET_SELECTOR_TYPE.SHAPES:
				base = Project.current!.shapes.getByID(kind ?? DEFAULT_CUSTOM_SHAPE_KIND, getSelectedID());
				break;
			case ASSET_SELECTOR_TYPE.SONGS:
				base = Project.current!.songs.getByID(kind ?? DEFAULT_SONG_KIND, getSelectedID());
				break;
			case ASSET_SELECTOR_TYPE.VIDEOS:
				base = Project.current!.videos.getByID(getSelectedID());
				break;
		}
		return Node.create(base ? base : Model.Base.create(-1, '<NONE>'));
	}, [selectedID, selectionType, kind]);

	const [isOpen, setIsOpen] = useState(false);
	const [list, setList] = useState([getSelectedItem()]);

	const handleDoubleClick = () => {
		if (!disabled) {
			setIsOpen(true);
		}
	};

	const handleAcceptPicture = (picture: Model.Picture, rect: Rectangle) => {
		onChange?.(picture.id, rect.x / rect.width, rect.y / rect.height);
		setList([
			Node.create(
				active && selectedDynamic!.isActivated ? Model.Base.create(-1, selectedDynamic!.toString()) : picture,
			),
		]);
	};

	const handleAcceptShape = (shape: Model.Shape) => {
		onChange?.(shape.id, 0, 0);
		setList([Node.create(shape)]);
	};

	const handleAcceptSong = (song: Model.Song) => {
		onChange?.(song.id, 0, 0);
		setList([
			Node.create(
				active && selectedDynamic!.isActivated ? Model.Base.create(-1, selectedDynamic!.toString()) : song,
			),
		]);
	};

	const handleAcceptVideo = (video: Model.Video) => {
		onChange?.(video.id, 0, 0);
		setList([
			Node.create(
				active && selectedDynamic!.isActivated ? Model.Base.create(-1, selectedDynamic!.toString()) : video,
			),
		]);
	};

	useEffect(() => {
		setList([
			selectedDynamic && selectedDynamic.kind !== DYNAMIC_VALUE_KIND.NUMBER
				? Node.create(Model.Base.create(-1, selectedDynamic.toString()))
				: getSelectedItem(),
		]);
	}, [selectedID, selectedDynamic?.kind, selectedDynamic?.value, getSelectedItem]);

	const getIcon = (): JSX.Element => {
		switch (selectionType) {
			case ASSET_SELECTOR_TYPE.PICTURES:
				return <AiOutlinePicture />;
			case ASSET_SELECTOR_TYPE.SHAPES:
				return <BiPyramid />;
			case ASSET_SELECTOR_TYPE.SONGS:
				return <BsMusicNote />;
			case ASSET_SELECTOR_TYPE.VIDEOS:
				return <TfiVideoClapper />;
		}
	};

	const getDialog = () => {
		if (isOpen) {
			switch (selectionType) {
				case ASSET_SELECTOR_TYPE.PICTURES:
					return (
						<DialogPictures
							pictureID={getSelectedID()}
							dynamicPictureID={selectedDynamic}
							indexX={indexX}
							indexY={indexY}
							kind={kind ?? DEFAULT_PICTURE_KIND}
							setIsOpen={setIsOpen}
							onAccept={handleAcceptPicture}
							active={active}
						/>
					);
				case ASSET_SELECTOR_TYPE.SHAPES:
					return (
						<DialogShapes
							shapeID={selectedID}
							kind={kind ?? DEFAULT_CUSTOM_SHAPE_KIND}
							setIsOpen={setIsOpen}
							onAccept={handleAcceptShape}
						/>
					);
				case ASSET_SELECTOR_TYPE.SONGS:
					return (
						<DialogSongs
							songID={getSelectedID()}
							dynamicSongID={selectedDynamic}
							kind={kind ?? DEFAULT_SONG_KIND}
							songOptions={songOptions}
							displayOptions={!!songOptions}
							setIsOpen={setIsOpen}
							onAccept={handleAcceptSong}
							active={active}
						/>
					);
				case ASSET_SELECTOR_TYPE.VIDEOS:
					return (
						<DialogVideos
							videoID={getSelectedID()}
							dynamicVideoID={selectedDynamic}
							setIsOpen={setIsOpen}
							onAccept={handleAcceptVideo}
							active={active}
						/>
					);
			}
		} else {
			return null;
		}
	};

	return (
		<>
			<Flex one spaced>
				<Tree
					list={list}
					defaultSelectedID={-999}
					minWidth={TREES_MIN_WIDTH}
					onDoubleClick={handleDoubleClick}
					cannotAdd
					cannotEdit
					cannotDelete
					cannotDragDrop
					disabled={disabled}
				/>
				<Button onClick={handleDoubleClick} disabled={disabled}>
					{getIcon()}
				</Button>
			</Flex>
			{getDialog()}
		</>
	);
}

export default AssetSelector;
