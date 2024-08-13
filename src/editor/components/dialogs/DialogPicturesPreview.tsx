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
import { Constants, PICTURE_KIND } from '../../common';
import { Platform } from '../../common/Platform';
import { Node, Project, Rectangle } from '../../core';
import { Model, Scene } from '../../Editor';
import Checkbox from '../Checkbox';
import Flex from '../Flex';
import Groupbox from '../Groupbox';
import PanelAssetsPreviewer from '../panels/PanelAssetsPreviewer';
import TextureCharacterSelector from '../TextureCharacterSelector';
import TextureSquareSelector from '../TextureSquareSelector';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import FooterOK from './footers/FooterOK';

type Props = {
	kind: PICTURE_KIND;
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	pictureID?: number;
	indexX?: number;
	indexY?: number;
	rectTileset?: Rectangle;
	onAccept?: (picture: Model.Picture, rect: Rectangle, isTileset: boolean) => void;
	onReject?: () => void;
};

function DialogPicturesPreview({
	kind,
	isOpen,
	setIsOpen,
	pictureID,
	indexX,
	indexY,
	rectTileset,
	onAccept,
	onReject,
}: Props) {
	const { t } = useTranslation();

	const [isDialogWarningSelectionOpen, setIsDialogWarningSelectionOpen] = useState(false);
	const [isInitiating, setIsInitiating] = useState(false);
	const [pictures, setPictures] = useState<Node[]>([]);
	const [picturesAvailable, setPicturesAvailable] = useState<Node[]>([]);
	const [selectedPicture, setSelectedPicture] = useState<Model.Picture | null>(null);
	const [selectedRectTileset, setSelectedRectTileset] = useState(new Rectangle());
	const [selectedRect, setSelectedRect] = useState(new Rectangle());
	const [isStopAnimation, setIsStopAnimation] = useState(false);
	const [isClimbAnimation, setIsClimbAnimation] = useState(false);
	const [isSelectedLeftList, setIsSelectedLeftList] = useState(true);

	const initialize = () => {
		setIsInitiating(true);
		setIsSelectedLeftList(true);
		setPictures(Node.createList(Project.current!.pictures.getList(kind)));
		let rect = new Rectangle();
		let rectT = new Rectangle();
		if (pictureID !== undefined) {
			setSelectedPicture(Project.current!.pictures.getByID(kind, pictureID));
			if (pictureID === 0) {
				if (rectTileset) {
					rectT = rectTileset.clone();
				}
			} else {
				if (indexX !== undefined && indexY !== undefined) {
					const dif = Constants.BASE_SQUARE_SIZE / Project.SQUARE_SIZE;
					rect = new Rectangle(indexX * dif, indexY * dif, dif, dif);
				}
			}
		}
		setSelectedRect(rect);
		setSelectedRectTileset(rectT);
		handleRefresh();
	};

	const handleChangeSelectedPicture = (node: Node | null) => {
		const picture = (node?.content ?? null) as Model.Picture | null;
		setSelectedPicture(picture);
		if (picture) {
			setIsStopAnimation(picture.isStopAnimation);
			setIsClimbAnimation(picture.isClimbAnimation);
		} else {
			setIsStopAnimation(false);
			setIsClimbAnimation(false);
		}
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
		const path = Model.Picture.getFolder(kind, true, '');
		const files = Platform.getAllFilesFromFolder(path);
		setPicturesAvailable(
			Node.createList(
				files.map((name, index) => {
					const picture = new Model.Picture(kind);
					picture.id = index + 1;
					picture.name = name;
					picture.isBR = true;
					return picture;
				}),
				false
			)
		);
	};

	const handleCloseWarningSelectionOpen = () => {
		setIsDialogWarningSelectionOpen(false);
	};

	const handleAccept = async () => {
		if (selectedPicture === null || !isSelectedLeftList) {
			setIsDialogWarningSelectionOpen(true);
		} else {
			Project.current!.pictures.list[kind] = pictures.map((node) => node.content as Model.Picture);
			await Project.current!.pictures.save();
			const isTileset = selectedPicture.id === 0;
			const dif = Constants.BASE_SQUARE_SIZE / Project.SQUARE_SIZE;
			onAccept?.(
				selectedPicture,
				isTileset ? selectedRectTileset.clone() : new Rectangle(selectedRect.x / dif, selectedRect.y / dif),
				isTileset
			);
			setIsOpen(false);
		}
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	const getPreviewerContent = () => {
		if (selectedPicture) {
			switch (kind) {
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
						/>
					) : (
						<TextureCharacterSelector
							texture={selectedPicture.getPath()}
							isStopAnimation={isStopAnimation}
							isClimbAnimation={isClimbAnimation}
							defaultRectangle={selectedRect}
							onUpdateRectangle={setSelectedRect}
							adjustPositionSize
						/>
					);
				default:
					return null; // TODO
			}
		}
	};

	const getPreviewerOptionsContent = () => {
		if (selectedPicture) {
			switch (kind) {
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
		<>
			<Dialog
				title={`${t('select.picture')}...`}
				isOpen={isOpen}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				initialWidth='70%'
				initialHeight='70%'
				onClose={handleReject}
			>
				<PanelAssetsPreviewer
					assetID={pictureID}
					list={pictures}
					setList={setPictures}
					itemsAvailable={picturesAvailable}
					selectedItem={selectedPicture}
					isSelectedLeftList={isSelectedLeftList}
					setIsSelectedLeftList={setIsSelectedLeftList}
					isInitiating={isInitiating}
					setIsInitiating={setIsInitiating}
					onChangeSelectedItem={handleChangeSelectedPicture}
					onRefresh={handleRefresh}
					content={getPreviewerContent()}
					options={getPreviewerOptionsContent()}
				/>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningSelectionOpen}
				footer={<FooterOK onOK={handleCloseWarningSelectionOpen} />}
				onClose={handleCloseWarningSelectionOpen}
			>
				<p>{t('warning.selection')}</p>
			</Dialog>
		</>
	);
}

export default DialogPicturesPreview;
