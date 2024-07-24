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
import { FaAngleDoubleLeft } from 'react-icons/fa';
import { BUTTON_TYPE, Constants, PICTURE_KIND } from '../../common';
import { Platform } from '../../common/Platform';
import { Node, Project, Rectangle } from '../../core';
import { Model, Scene } from '../../Editor';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Groupbox from '../Groupbox';
import TextureCharacterSelector from '../TextureCharacterSelector';
import TextureSquareSelector from '../TextureSquareSelector';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import FooterOK from './footers/FooterOK';

type Props = {
	kind: PICTURE_KIND;
	needOpen: boolean;
	setNeedOpen: (b: boolean) => void;
	pictureID?: number;
	indexX?: number;
	indexY?: number;
	rectTileset?: Rectangle;
	onAccept?: (picture: Model.Picture, rect: Rectangle, isTileset: boolean) => void;
	onReject?: () => void;
};

function DialogPicturesPreview({
	kind,
	needOpen,
	setNeedOpen,
	pictureID,
	indexX,
	indexY,
	rectTileset,
	onAccept,
	onReject,
}: Props) {
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);
	const [isDialogWarningSelectionOpen, setIsDialogWarningSelectionOpen] = useState(false);
	const [picturesShowAvailableContent, setPicturesShowAvailableContent] = useState(
		Project.current!.settings.picturesShowAvailableContent
	);
	const [isInitiating, setIsInitiating] = useState(false);
	const [pictures, setPictures] = useState<Node[]>([]);
	const [picturesAvailable, setPicturesAvailable] = useState<Node[]>([]);
	const [selectedPicture, setSelectedPicture] = useState<Model.Picture | null>(null);
	const [selectedRectTileset, setSelectedRectTileset] = useState(new Rectangle());
	const [selectedRect, setSelectedRect] = useState(new Rectangle());
	const [isStopAnimation, setIsStopAnimation] = useState(false);
	const [isClimbAnimation, setIsClimbAnimation] = useState(false);
	const [isSelectedLeftList, setIsSelectedLeftList] = useState(true);
	const [forcedCurrentSelectedItemIDLeft, setForcedCurrentSelectedItemIDLeft] = useState<number | null>(null);
	const [forcedCurrentSelectedItemIDRight, setForcedCurrentSelectedItemIDRight] = useState<number | null>(null);

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

	const handleChangePicturesShowAvailableContent = async (b: boolean) => {
		setPicturesShowAvailableContent(b);
		Project.current!.settings.picturesShowAvailableContent = b;
		await Project.current!.settings.save();
	};

	const handleChangeSelectedPictureLeft = (node: Node | null) => {
		if (node) {
			handleChangeSelectedPicture(node);
			setIsSelectedLeftList(true);
			setForcedCurrentSelectedItemIDRight(-1);
		}
	};

	const handleChangeSelectedPictureRight = (node: Node | null) => {
		if (node && !isInitiating) {
			handleChangeSelectedPicture(node);
			setIsSelectedLeftList(false);
			setForcedCurrentSelectedItemIDLeft(-2);
		}
		if (isInitiating) {
			setForcedCurrentSelectedItemIDLeft(pictureID !== undefined ? pictureID : -1);
			setIsInitiating(false);
		}
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

	const handleClickMoveLeft = () => {
		if (selectedPicture) {
			const newPicture = selectedPicture.clone();
			newPicture.id = Model.Base.generateNewIDfromList(pictures.map((node) => node.content));
			const node = Node.create(newPicture);
			setPictures([...pictures, node]);
			setForcedCurrentSelectedItemIDLeft(newPicture.id);
			handleChangeSelectedPictureLeft(node);
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
		if (needOpen) {
			setNeedOpen(false);
			initialize();
			setIsOpen(true);
		}
		// eslint-disable-next-line
	}, [needOpen]);

	const getPreviewerContent = () => {
		switch (kind) {
			case PICTURE_KIND.CHARACTERS:
				if (selectedPicture!.id === -1) {
					return null;
				}
				return selectedPicture!.id === 0 ? (
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
						texture={selectedPicture!.getPath()}
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
	};

	const getPreviewerOptionsContent = () => {
		switch (kind) {
			case PICTURE_KIND.CHARACTERS:
				return selectedPicture!.id === 0 ? null : (
					<Groupbox title={t('options')}>
						<div className='flex gap-medium'>
							<Checkbox isChecked={isStopAnimation} onChange={handleChangeStopAnimation}>
								{t('stop.animation')}
							</Checkbox>
							<Checkbox isChecked={isClimbAnimation} onChange={handleChangeClimbAnimation}>
								{t('climb.animation')}
							</Checkbox>
						</div>
					</Groupbox>
				);
			default:
				return null;
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
				<div className='flex-column gap-medium fill-height'>
					<div className='flex gap-medium'>
						<div className='flex-one'>
							<Checkbox
								isChecked={picturesShowAvailableContent}
								onChange={handleChangePicturesShowAvailableContent}
							>
								{t('show.available.content')}
							</Checkbox>
						</div>
						<div className='flex gap-small'>
							<Button disabled>{t('open.default.folder')}...</Button>
							<Button disabled>{t('open.project.folder')}...</Button>
							<Button disabled>{t('import.dlc.s')}...</Button>
						</div>
					</div>
					<div className='flex-one gap-medium fill-height'>
						<div className='flex-column'>
							<div className='flex-one zero-height'>
								<Tree
									list={pictures}
									minWidth={TREES_MIN_WIDTH}
									onSelectedItem={handleChangeSelectedPictureLeft}
									forcedCurrentSelectedItemID={forcedCurrentSelectedItemIDLeft}
									setForcedCurrentSelectedItemID={setForcedCurrentSelectedItemIDLeft}
									showEditName
									cannotAdd
									cannotEdit
								/>
							</div>
						</div>
						<div className='flex-one gap-medium'>
							{picturesShowAvailableContent && (
								<>
									<div className='flex-column flex-center-self-v'>
										<Button
											buttonType={BUTTON_TYPE.PRIMARY}
											icon={<FaAngleDoubleLeft />}
											disabled={isSelectedLeftList || !selectedPicture}
											onClick={handleClickMoveLeft}
										/>
									</div>
									<div className='flex-column gap-small'>
										<div className='flex-one zero-height'>
											<Tree
												list={picturesAvailable}
												onSelectedItem={handleChangeSelectedPictureRight}
												onDoubleClick={handleClickMoveLeft}
												minWidth={TREES_MIN_WIDTH}
												forcedCurrentSelectedItemID={forcedCurrentSelectedItemIDRight}
												setForcedCurrentSelectedItemID={setForcedCurrentSelectedItemIDRight}
												cannotAdd
												cannotEdit
												cannotDragDrop
												cannotDelete
												doNotShowID
											/>
										</div>
										<div className='flex gap-small'>
											<Button onClick={handleRefresh} disabled>
												{t('refresh')}
											</Button>
											<Button disabled>{t('export')}...</Button>
											<Button buttonType={BUTTON_TYPE.PRIMARY} disabled>
												+
											</Button>
										</div>
									</div>
								</>
							)}
							<div className='flex-one flex-column zero-width'>
								{selectedPicture && (
									<>
										<div className='flex-one scrollable'>{getPreviewerContent()}</div>
										<div>{getPreviewerOptionsContent()}</div>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</Dialog>
			<Dialog
				title={t('warning')}
				isOpen={isDialogWarningSelectionOpen}
				footer={<FooterOK onOK={handleCloseWarningSelectionOpen} />}
				onClose={handleCloseWarningSelectionOpen}
			>
				<p>{t('warning.picture.selection')}</p>
			</Dialog>
		</>
	);
}

export default DialogPicturesPreview;
