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
import { useDispatch } from 'react-redux';
import { PICTURE_KIND } from '../../common';
import { getAllFilesFromFolder, getFiles } from '../../common/Platform';
import { Node, Project, Rectangle } from '../../core';
import { DynamicValue } from '../../core/DynamicValue';
import { Model, Scene } from '../../Editor';
import { showWarning } from '../../store';
import Checkbox from '../Checkbox';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import PanelAssetsPreviewer from '../panels/PanelAssetsPreviewer';
import TextureCharacterSelector from '../TextureCharacterSelector';
import TexturePreviewer from '../TexturePreviewer';
import TextureSquareSelector from '../TextureSquareSelector';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	kind?: PICTURE_KIND;
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	pictureID?: number;
	dynamicPictureID?: DynamicValue;
	indexX?: number;
	indexY?: number;
	rectTileset?: Rectangle;
	onAccept?: (picture: Model.Picture, rect: Rectangle, isTileset: boolean) => void;
	onReject?: () => void;
	active?: boolean;
};

function DialogPictures({
	kind,
	isOpen,
	setIsOpen,
	pictureID,
	dynamicPictureID,
	indexX,
	indexY,
	rectTileset,
	onAccept,
	onReject,
	active = false,
}: Props) {
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(false);
	const [isInitiating, setIsInitiating] = useState(false);
	const [pictures, setPictures] = useState<Node[]>([]);
	const [picturesAvailable, setPicturesAvailable] = useState<Node[]>([]);
	const [selectedPicture, setSelectedPicture] = useState<Model.Picture | null>(null);
	const [selectedRectTileset, setSelectedRectTileset] = useState(new Rectangle());
	const [selectedRect, setSelectedRect] = useState(new Rectangle());
	const [isStopAnimation, setIsStopAnimation] = useState(false);
	const [isClimbAnimation, setIsClimbAnimation] = useState(false);
	const [isSelectedLeftList, setIsSelectedLeftList] = useState(true);
	const [newDynamicPictureID, setNewDynamicPictureID] = useState(dynamicPictureID);
	const [selectedKind, setSelectedKind] = useState(kind);

	const dispatch = useDispatch();

	const folders = useMemo(
		() =>
			kind === undefined
				? [
						Node.create(Model.TreeMapTag.create(-1, 'Images'), [
							Node.create(
								Model.TreeMapTag.create(-2, 'HUD'),
								Node.createList(
									[
										Model.TreeMapTag.create(PICTURE_KIND.ANIMATIONS, 'Animations'),
										Model.TreeMapTag.create(PICTURE_KIND.BARS, 'Bars'),
										Model.TreeMapTag.create(PICTURE_KIND.FACESETS, 'Facesets'),
										Model.TreeMapTag.create(PICTURE_KIND.ICONS, 'Icons'),
										Model.TreeMapTag.create(PICTURE_KIND.PICTURES, 'Pictures'),
										Model.TreeMapTag.create(PICTURE_KIND.TITLE_SCREENS, 'TitleScreens'),
										Model.TreeMapTag.create(PICTURE_KIND.WINDOW_SKINS, 'WindowSkins'),
										Model.TreeMapTag.create(PICTURE_KIND.GAME_OVERS, 'GameOver'),
									],
									false
								)
							),
							Node.create(
								Model.TreeMapTag.create(-3, 'Textures2D'),
								Node.createList(
									[
										Model.TreeMapTag.create(PICTURE_KIND.AUTOTILES, 'Autotiles'),
										Model.TreeMapTag.create(PICTURE_KIND.BATTLERS, 'Battlers'),
										Model.TreeMapTag.create(PICTURE_KIND.CHARACTERS, 'Characters'),
										Model.TreeMapTag.create(PICTURE_KIND.MOUNTAINS, 'Mountains'),
										Model.TreeMapTag.create(PICTURE_KIND.OBJECTS_3D, 'Objects3D'),
										Model.TreeMapTag.create(PICTURE_KIND.TILESETS, 'Tilesets'),
										Model.TreeMapTag.create(PICTURE_KIND.WALLS, 'Walls'),
										Model.TreeMapTag.create(PICTURE_KIND.SKYBOXES, 'SkyBoxes'),
										Model.TreeMapTag.create(PICTURE_KIND.PARTICLES, 'Particles'),
									],
									false
								)
							),
						]),
				  ]
				: [],
		[kind]
	);

	const initialize = () => {
		setIsInitiating(true);
		setNewDynamicPictureID(dynamicPictureID?.clone());
		setIsSelectedLeftList(true);
		setPictures(Node.createList(Project.current!.pictures.getList(selectedKind!), kind !== undefined));
		let rect = new Rectangle();
		let rectT = new Rectangle();
		if (pictureID !== undefined) {
			const picture = Project.current!.pictures.getByID(selectedKind!, pictureID);
			updateSelectedPicture(picture);
			if (pictureID === 0) {
				if (rectTileset) {
					rectT = rectTileset.clone();
				}
			} else {
				if (indexX !== undefined && indexY !== undefined) {
					rect = new Rectangle(indexX, indexY, 1, 1);
				}
			}
		}
		setSelectedRect(rect);
		setSelectedRectTileset(rectT);
		handleRefresh();
	};

	const reset = () => {
		setSelectedPicture(null);
		setPictures([]);
		setPicturesAvailable([]);
	};

	const updateSelectedPicture = (picture?: Model.Picture | null) => {
		setSelectedPicture(picture ?? null);
		if (picture) {
			setIsStopAnimation(picture.isStopAnimation);
			setIsClimbAnimation(picture.isClimbAnimation);
		} else {
			setIsStopAnimation(false);
			setIsClimbAnimation(false);
		}
	};

	const handleChangeSelectedPicture = (node: Node | null) => {
		updateSelectedPicture((node?.content ?? null) as Model.Picture | null);
	};

	const handleChangeStopAnimation = (b: boolean) => {
		setIsStopAnimation(b);
		if (selectedPicture) {
			selectedPicture.isStopAnimation = b;
		}
	};

	const handleChangeClimbAnimation = (b: boolean) => {
		setIsClimbAnimation(b);
		if (selectedPicture) {
			selectedPicture.isClimbAnimation = b;
		}
	};

	const handleRefresh = async () => {
		const files = getAllFilesFromFolder(Model.Picture.getFolder(selectedKind!, true, ''));
		const customNames = await getFiles(Model.Picture.getFolder(selectedKind!, false, ''));
		setPicturesAvailable([
			...Node.createList(
				files.map((name, index) => {
					const picture = new Model.Picture(selectedKind!);
					picture.applyDefault();
					picture.id = index + 1;
					picture.name = name;
					picture.isBR = true;
					picture.dlc = '';
					return picture;
				}),
				false
			),
			...Node.createList(
				customNames.map((name, index) => {
					const picture = new Model.Picture(selectedKind!);
					picture.applyDefault();
					picture.id = files.length + index + 1;
					picture.name = name;
					picture.isBR = false;
					picture.dlc = '';
					return picture;
				}),
				false
			),
		]);
	};

	const handleChangeFolder = (node: Node | null) => {
		setSelectedKind(node && node.content.id >= 0 ? node.content.id : undefined);
	};

	const handleListUpdated = () => {
		if (kind === undefined && selectedKind) {
			Project.current!.pictures.list[selectedKind] = Node.createListFromNodes(pictures);
		}
	};

	const handleAccept = async () => {
		if (kind === undefined) {
			setIsLoading(true);
			await Scene.Map.current?.reloadTextures();
			await Project.current!.pictures.save();
			setIsLoading(false);
			setIsOpen(false);
			reset();
		} else {
			if (selectedPicture === null || !isSelectedLeftList) {
				dispatch(showWarning(t('warning.asset.selection')));
			} else {
				setIsLoading(true);
				await Scene.Map.current?.reloadTextures(kind);
				Project.current!.pictures.list[kind] = Node.createListFromNodes(pictures);
				await Project.current!.pictures.save();
				const isTileset = selectedPicture.id === 0;
				onAccept?.(
					selectedPicture,
					isTileset
						? selectedRectTileset.clone()
						: new Rectangle(selectedRect.x / selectedRect.width, selectedRect.y / selectedRect.height),
					isTileset
				);
				if (active) {
					if (!newDynamicPictureID!.isActivated) {
						dynamicPictureID!.updateToDefaultNumber(selectedPicture.id);
					} else {
						dynamicPictureID!.copy(newDynamicPictureID!);
					}
				}
				setIsLoading(false);
				setIsOpen(false);
				reset();
			}
		}
	};

	const handleReject = async () => {
		if (kind === undefined) {
			setIsLoading(true);
			await Project.current!.pictures.load();
			setIsLoading(false);
		}
		onReject?.();
		setSelectedPicture(null);
		setIsOpen(false);
		reset();
	};

	useLayoutEffect(() => {
		if (selectedKind === undefined) {
			reset();
		}
		// eslint-disable-next-line
	}, [selectedKind]);

	useLayoutEffect(() => {
		if (isOpen && selectedKind !== undefined) {
			reset();
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen, selectedKind]);

	const getPreviewerContent = () => {
		if (selectedPicture) {
			const path = selectedPicture.getPath();
			switch (selectedKind) {
				case PICTURE_KIND.CHARACTERS:
					if (selectedPicture.id === -1) {
						return null;
					}
					return selectedPicture.id === 0 ? (
						<TextureSquareSelector
							texture={Project.current!.pictures.getByID(
								PICTURE_KIND.TILESETS,
								Scene.Map.current!.model.getTileset().pictureID
							).getPath()}
							defaultRectangle={selectedRectTileset}
							onUpdateRectangle={setSelectedRectTileset}
							base64={!selectedPicture.isBR}
							doNotUpdateTexture
						/>
					) : (
						<TextureCharacterSelector
							texture={path}
							isStopAnimation={isStopAnimation}
							isClimbAnimation={isClimbAnimation}
							defaultRectangle={selectedRect}
							onUpdateRectangle={setSelectedRect}
							base64={!selectedPicture.isBR}
							adjustPositionSize
						/>
					);
				case PICTURE_KIND.ICONS: {
					const size = Project.current!.systems.iconsSize / Project.SQUARE_SIZE;
					return (
						<TextureSquareSelector
							texture={path}
							canChangeSize={false}
							squareWidth={size}
							squareHeight={size}
							defaultRectangle={selectedRect}
							onUpdateRectangle={setSelectedRect}
							base64={!selectedPicture.isBR}
							doNotUpdateTexture
						/>
					);
				}
				case PICTURE_KIND.FACESETS: {
					const size = Project.current!.systems.facesetsSize / Project.SQUARE_SIZE / 2;
					return (
						<TextureSquareSelector
							texture={path}
							canChangeSize={false}
							divideWidth={2}
							divideHeight={2}
							squareWidth={size}
							squareHeight={size}
							defaultRectangle={selectedRect}
							onUpdateRectangle={setSelectedRect}
							base64={!selectedPicture.isBR}
							doNotUpdateTexture
						/>
					);
				}
				default:
					return <TexturePreviewer texture={path} base64={!selectedPicture.isBR} />;
			}
		}
	};

	const getPreviewerOptionsContent = () => {
		if (selectedPicture) {
			switch (selectedKind) {
				case PICTURE_KIND.CHARACTERS:
					return selectedPicture.id === 0 ? null : (
						<Groupbox title={t('options')}>
							<Flex spacedLarge>
								<Checkbox isChecked={isStopAnimation} onChange={handleChangeStopAnimation}>
									{t('stop.animation')}
								</Checkbox>
								<Checkbox isChecked={isClimbAnimation} onChange={handleChangeClimbAnimation}>
									{t('climb.animation')}
								</Checkbox>
							</Flex>
						</Groupbox>
					);
				default:
					return null;
			}
		}
	};

	return (
		<Dialog
			title={`${t(kind === undefined ? 'pictures.manager' : 'select.picture')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			initialWidth='70%'
			initialHeight='70%'
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			isLoading={isLoading}
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
						assetID={pictureID}
						dynamicValueID={newDynamicPictureID}
						list={pictures}
						itemsAvailable={picturesAvailable}
						selectedItem={selectedPicture}
						isSelectedLeftList={isSelectedLeftList}
						setIsSelectedLeftList={setIsSelectedLeftList}
						isInitiating={isInitiating}
						setIsInitiating={setIsInitiating}
						onChangeSelectedItem={handleChangeSelectedPicture}
						onRefresh={handleRefresh}
						onListUpdated={handleListUpdated}
						content={getPreviewerContent()}
						options={getPreviewerOptionsContent()}
						active={active}
						basePath={Model.Picture.getFolder(selectedKind, false, '')}
						importTypes='image/png, image/jpeg'
					/>
				) : (
					<Flex one />
				)}
			</Flex>
		</Dialog>
	);
}

export default DialogPictures;
