/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect, useState } from 'react';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import { Model } from '../../Editor';
import { useTranslation } from 'react-i18next';
import Groupbox from '../Groupbox';
import Tree, { TREES_MIN_WIDTH } from '../Tree';
import { Node, Project } from '../../core';
import { BUTTON_TYPE, PICTURE_KIND } from '../../common';
import Checkbox from '../Checkbox';
import Button from '../Button';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import TextureCharacterSelector from '../TextureCharacterSelector';
import { Platform } from '../../common/Platform';

type Props = {
	kind: PICTURE_KIND;
	needOpen: boolean;
	setNeedOpen: (b: boolean) => void;
	model?: Model.Picture;
	onAccept?: () => void;
	onReject?: () => void;
};

function DialogPicturesPreview({ kind, needOpen, setNeedOpen, model, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);
	const [picturesShowAvailableContent, setPicturesShowAvailableContent] = useState(
		Project.current!.settings.picturesShowAvailableContent
	);
	const [pictures, setPictures] = useState<Node[]>([]);
	const [picturesAvailable, setPicturesAvailable] = useState<Node[]>([]);
	const [selectedPicture, setSelectedPicture] = useState<Model.Picture | null>(null);
	const [isStopAnimation, setIsStopAnimation] = useState(false);
	const [isClimbAnimation, setIsClimbAnimation] = useState(false);
	const [isSelectedLeftList, setIsSelectedLeftList] = useState(true);
	const [forcedCurrentSelectedItemIDLeft, setForcedCurrentSelectedItemIDLeft] = useState<number | null>(null);
	const [forcedCurrentSelectedItemIDRight, setForcedCurrentSelectedItemIDRight] = useState<number | null>(null);

	const initialize = () => {
		setPictures(Node.createList(Project.current!.pictures.getList(kind)));
		handleRefresh();
	};

	const handleChangePicturesShowAvailableContent = async (b: boolean) => {
		setPicturesShowAvailableContent(b);
		Project.current!.settings.picturesShowAvailableContent = b;
		await Project.current!.settings.save();
	};

	const handleChangeSelectedPictureLeft = (node: Node | null) => {
		handleChangeSelectedPicture(node);
		if (node) {
			setIsSelectedLeftList(true);
			setForcedCurrentSelectedItemIDRight(-1);
		}
	};

	const handleChangeSelectedPictureRight = (node: Node | null) => {
		handleChangeSelectedPicture(node);
		if (node) {
			setIsSelectedLeftList(false);
			setForcedCurrentSelectedItemIDLeft(-2);
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

	const handleAccept = async () => {
		onAccept?.();
		setIsOpen(false);
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

	return (
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
						<Button>{t('open.default.folder')}...</Button>
						<Button>{t('open.project.folder')}...</Button>
						<Button>{t('import.dlc.s')}...</Button>
					</div>
				</div>
				<div className='flex-one gap-medium fill-height'>
					<div className='flex-column'>
						<div className='flex-one zero-height'>
							<Tree
								list={pictures}
								minWidth={TREES_MIN_WIDTH}
								onSelectedItem={handleChangeSelectedPictureLeft}
								forcedCurrentSelectedItemIndex={forcedCurrentSelectedItemIDLeft}
								setForcedCurrentSelectedItemIndex={setForcedCurrentSelectedItemIDLeft}
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
									<Button buttonType={BUTTON_TYPE.PRIMARY} icon={<FaAngleDoubleLeft />} disabled />
								</div>
								<div className='flex-column gap-small'>
									<div className='flex-one zero-height'>
										<Tree
											list={picturesAvailable}
											onSelectedItem={handleChangeSelectedPictureRight}
											minWidth={TREES_MIN_WIDTH}
											forcedCurrentSelectedItemID={forcedCurrentSelectedItemIDRight}
											setForcedCurrentSelectedItemID={setForcedCurrentSelectedItemIDRight}
											cannotAdd
											cannotEdit
											cannotDragDrop
											doNotShowID
										/>
									</div>
									<div className='flex gap-small'>
										<Button onClick={handleRefresh}>{t('refresh')}</Button>
										<Button>{t('export')}...</Button>
										<Button buttonType={BUTTON_TYPE.PRIMARY}>+</Button>
									</div>
								</div>
							</>
						)}
						<div className='flex-one flex-column zero-width'>
							{selectedPicture && (
								<>
									<div className='flex-one scrollable'>
										<TextureCharacterSelector
											texture={selectedPicture.getPath()}
											isStopAnimation={isStopAnimation}
											isClimbAnimation={isClimbAnimation}
										/>
									</div>
									<div>
										<Groupbox title={t('options')}>
											<div className='flex gap-medium'>
												<Checkbox
													isChecked={isStopAnimation}
													onChange={handleChangeStopAnimation}
												>
													{t('stop.animation')}
												</Checkbox>
												<Checkbox
													isChecked={isClimbAnimation}
													onChange={handleChangeClimbAnimation}
												>
													{t('climb.animation')}
												</Checkbox>
											</div>
										</Groupbox>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</Dialog>
	);
}

export default DialogPicturesPreview;
