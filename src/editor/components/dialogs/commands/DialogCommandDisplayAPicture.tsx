/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, PICTURE_KIND, Utils } from '../../../common';
import { Model } from '../../../Editor';
import { Rectangle } from '../../../core/Rectangle';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import TooltipInformation from '../../TooltipInformation';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import DialogPictures from '../DialogPictures';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';
import useLivePreview from '../../../hooks/useLivePreview';

function DialogCommandDisplayAPicture({
	commandKind,
	setIsOpen,
	list,
	onAccept,
	onReject,
	onLivePreview,
}: CommandProps) {
	const { t } = useTranslation();

	const [imageID] = useStateDynamicValue();
	const [index] = useStateDynamicValue();
	const [originIndex, setOriginIndex] = useStateNumber();
	const [x] = useStateDynamicValue();
	const [y] = useStateDynamicValue();
	const [zoom] = useStateDynamicValue();
	const [opacity] = useStateDynamicValue();
	const [angle] = useStateDynamicValue();
	const [isStretch, setIsStretch] = useStateBool();
	const [, setTrigger] = useStateBool();
	const [pictureKind, setPictureKind] = useState(PICTURE_KIND.PICTURES);
	const [pictureIndexX, setPictureIndexX] = useState(0);
	const [pictureIndexY, setPictureIndexY] = useState(0);
	const [pictureIndexWidth, setPictureIndexWidth] = useState(1);
	const [pictureIndexHeight, setPictureIndexHeight] = useState(1);
	const [isOpenPictures, setIsOpenPictures] = useState(false);

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			imageID.updateCommand(list, iterator, true);
			index.updateCommand(list, iterator);
			setOriginIndex(list[iterator.i++] as number);
			x.updateCommand(list, iterator);
			y.updateCommand(list, iterator);
			zoom.updateCommand(list, iterator);
			opacity.updateCommand(list, iterator);
			angle.updateCommand(list, iterator);
			setIsStretch(Utils.initializeBoolCommand(list, iterator));
			setPictureKind((list[iterator.i++] as PICTURE_KIND | undefined) ?? PICTURE_KIND.PICTURES);
			setPictureIndexX((list[iterator.i++] as number | undefined) ?? 0);
			setPictureIndexY((list[iterator.i++] as number | undefined) ?? 0);
			setPictureIndexWidth((list[iterator.i++] as number | undefined) ?? 1);
			setPictureIndexHeight((list[iterator.i++] as number | undefined) ?? 1);
		} else {
			imageID.isActivated = false;
			imageID.updateToDefaultNumber(-1);
			index.updateToDefaultNumber(0);
			setOriginIndex(0);
			x.updateToDefaultNumber(0, true);
			y.updateToDefaultNumber(0, true);
			zoom.updateToDefaultNumber(100, true);
			opacity.updateToDefaultNumber(100, true);
			angle.updateToDefaultNumber(0, true);
			setIsStretch(false);
			setPictureKind(PICTURE_KIND.PICTURES);
			setPictureIndexX(0);
			setPictureIndexY(0);
			setPictureIndexWidth(1);
			setPictureIndexHeight(1);
		}
		setTrigger((v) => !v);
	};

	const buildCommand = () => {
		const newList: MapObjectCommandType[] = [];
		imageID.getCommand(newList, true);
		index.getCommand(newList);
		newList.push(originIndex);
		x.getCommand(newList);
		y.getCommand(newList);
		zoom.getCommand(newList);
		opacity.getCommand(newList);
		angle.getCommand(newList);
		newList.push(Utils.boolToNum(isStretch));
		newList.push(pictureKind, pictureIndexX, pictureIndexY, pictureIndexWidth, pictureIndexHeight);
		return Model.MapObjectCommand.createCommand(commandKind, newList);
	};

	useLivePreview(onLivePreview, buildCommand);

	const handleAccept = async () => {
		setIsOpen(false);
		onAccept(buildCommand());
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	const handleAcceptPicture = (picture: Model.Picture, rect: Rectangle) => {
		setPictureKind(picture.kind);
		if (picture.kind === PICTURE_KIND.TILESETS) {
			setPictureIndexX(rect.x);
			setPictureIndexY(rect.y);
			setPictureIndexWidth(rect.width);
			setPictureIndexHeight(rect.height);
		} else {
			setPictureIndexX(rect.x / rect.width);
			setPictureIndexY(rect.y / rect.height);
			setPictureIndexWidth(1);
			setPictureIndexHeight(1);
		}
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<>
			<Dialog
				title={`${t('display.a.picture')}...`}
				isOpen
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
				zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			>
				<Flex column spacedLarge fillWidth fillHeight>
					<Flex columnMobile spaced>
						<Flex spaced centerV>
							<div className='whiteSpaceNowrap'>{t('image.id')}:</div>
							<AssetSelector
								selectionType={ASSET_SELECTOR_TYPE.PICTURES}
								kind={pictureKind}
								selectedDynamic={imageID}
								indexX={pictureIndexX}
								indexY={pictureIndexY}
								onOpen={() => setIsOpenPictures(true)}
								active
							/>
						</Flex>
						<Flex spaced centerV>
							<div>{t('index')}:</div>
							<TooltipInformation text={t('tooltip.picture.index')} />
							<DynamicValueSelector value={index} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
						</Flex>
					</Flex>
					<Flex spaced centerV>
						<div>{t('origin')}:</div>
						<TooltipInformation text={t('tooltip.picture.origin')} />
						<Dropdown
							selectedID={originIndex}
							onChange={setOriginIndex}
							options={Model.Base.TOP_LEFT_CENTER_OPTIONS}
							translateOptions
						/>
					</Flex>
					<Groupbox title={t('coordinates')}>
						<Form>
							<Label>X</Label>
							<Value>
								<DynamicValueSelector
									value={x}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
								/>
							</Value>
							<Label>Y</Label>
							<Value>
								<DynamicValueSelector
									value={y}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
								/>
							</Value>
						</Form>
					</Groupbox>
					<Groupbox title={t('effects')}>
						<Flex column spaced>
							<Form>
								<Label>{t('zoom')}</Label>
								<Value>
									<Flex spaced centerV>
										<DynamicValueSelector
											value={zoom}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										/>
										%
									</Flex>
								</Value>
								<Label>{t('opacity')}</Label>
								<Value>
									<Flex spaced centerV>
										<DynamicValueSelector
											value={opacity}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										/>
										%
									</Flex>
								</Value>
								<Label>{t('angle')}</Label>
								<Value>
									<Flex spaced centerV>
										<DynamicValueSelector
											value={angle}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										/>
										°
									</Flex>
								</Value>
							</Form>
							<Flex spaced centerV>
								<Checkbox isChecked={isStretch} onChange={setIsStretch}>
									{t('stretch')}
								</Checkbox>
								<TooltipInformation text={t('tooltip.stretch')} />
							</Flex>
						</Flex>
					</Groupbox>
				</Flex>
			</Dialog>
			{isOpenPictures && (
				<DialogPictures
					setIsOpen={setIsOpenPictures}
					pictureID={imageID.value as number}
					dynamicPictureID={imageID}
					indexX={pictureIndexX}
					indexY={pictureIndexY}
					rectTileset={new Rectangle(pictureIndexX, pictureIndexY, pictureIndexWidth, pictureIndexHeight)}
					defaultKind={pictureKind}
					onAcceptSelection={handleAcceptPicture}
					active
				/>
			)}
		</>
	);
}

export default DialogCommandDisplayAPicture;
