/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PICTURE_KIND } from '../../../common';
import { Project } from '../../../core/Project';
import { Rectangle } from '../../../core/Rectangle';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Button from '../../Button';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import InputText from '../../InputText';
import Slider from '../../Slider';
import TextureWindowSkinSelector from '../../TextureWindowSkinSelector';
import Dialog from '../Dialog';
import DialogRectangle from '../DialogRectangle';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogWindowSkin({ setIsOpen, model, onAccept, onReject }: Props) {
	const windowSkin = model as Model.WindowSkin;

	const { t } = useTranslation();

	const [isDialogRectangleOpen, setIsDialogRectangleOpen] = useState(false);
	const [name, setName] = useStateString();
	const [pictureID, setPictureID] = useStateNumber();
	const [zoom, setZoom] = useStateNumber();
	const [selectedRectangle, setSelectedRectangle] = useState<Rectangle>();
	const [isSelecting, setIsSelecting] = useStateBool();
	const [selectingSetter, setSelectingSetter] = useState<{ setter: (r: Rectangle) => void }>();
	const [borderTopLeft, setBorderTopLeft] = useState(new Rectangle());
	const [borderTopRight, setBorderTopRight] = useState(new Rectangle());
	const [borderBotLeft, setBorderBotLeft] = useState(new Rectangle());
	const [borderBotRight, setBorderBotRight] = useState(new Rectangle());
	const [borderLeft, setBorderLeft] = useState(new Rectangle());
	const [borderRight, setBorderRight] = useState(new Rectangle());
	const [borderTop, setBorderTop] = useState(new Rectangle());
	const [borderBot, setBorderBot] = useState(new Rectangle());
	const [background, setBackground] = useState(new Rectangle());
	const [backgroundSelection, setBackgroundSelection] = useState(new Rectangle());
	const [backgroundRepeatIndex, setBackgroundRepeatIndex] = useStateNumber();
	const [arrowTargetSelection, setArrowTargetSelection] = useState(new Rectangle());
	const [arrowEndMessage, setArrowEndMessage] = useState(new Rectangle());
	const [arrowUpDown, setArrowUpDown] = useState(new Rectangle());
	const [normalText, setNormalText] = useState(new Rectangle());
	const [healText, setHealText] = useState(new Rectangle());
	const [criticalText, setCriticalText] = useState(new Rectangle());
	const [missText, setMissText] = useState(new Rectangle());

	const selectedPicture = Project.current!.pictures.getByID(PICTURE_KIND.WINDOW_SKINS, pictureID);

	const initialize = () => {
		setIsDialogRectangleOpen(false);
		setName(windowSkin.name);
		setPictureID(windowSkin.pictureID);
		setZoom(6);
		setSelectedRectangle(undefined);
		setIsSelecting(false);
		borderTopLeft.copy(windowSkin.borderTopLeft);
		borderTopRight.copy(windowSkin.borderTopRight);
		borderBotLeft.copy(windowSkin.borderBotLeft);
		borderBotRight.copy(windowSkin.borderBotRight);
		borderLeft.copy(windowSkin.borderLeft);
		borderRight.copy(windowSkin.borderRight);
		borderTop.copy(windowSkin.borderTop);
		borderBot.copy(windowSkin.borderBot);
		background.copy(windowSkin.background);
		backgroundSelection.copy(windowSkin.backgroundSelection);
		setBackgroundRepeatIndex(windowSkin.backgroundRepeat ? 1 : 0);
		arrowTargetSelection.copy(windowSkin.arrowTargetSelection);
		arrowEndMessage.copy(windowSkin.arrowEndMessage);
		arrowUpDown.copy(windowSkin.arrowUpDown);
		normalText.copy(windowSkin.textNormal);
		healText.copy(windowSkin.textHeal);
		criticalText.copy(windowSkin.textCritical);
		missText.copy(windowSkin.textMiss);
	};

	const handleMouseEnterButton = (rectangle: Rectangle) => {
		if (!isSelecting) {
			setSelectedRectangle(rectangle);
		}
	};

	const handleClickEnter = (setRectangle: (r: Rectangle) => void) => {
		setIsDialogRectangleOpen(true);
		setSelectingSetter({ setter: setRectangle });
	};

	const handleClickSelect = (setRectangle: (r: Rectangle) => void) => {
		setIsSelecting(true);
		setSelectedRectangle(undefined);
		setSelectingSetter({ setter: setRectangle });
	};

	const handleSelectionFinished = () => {
		if (selectingSetter) {
			selectingSetter.setter(selectedRectangle!);
			setSelectedRectangle(selectedRectangle!.clone());
		}
		setIsSelecting(false);
	};

	const handleAccept = async () => {
		windowSkin.name = name;
		windowSkin.pictureID = pictureID;
		windowSkin.borderTopLeft.copy(borderTopLeft);
		windowSkin.borderTopRight.copy(borderTopRight);
		windowSkin.borderBotLeft.copy(borderBotLeft);
		windowSkin.borderBotRight.copy(borderBotRight);
		windowSkin.borderLeft.copy(borderLeft);
		windowSkin.borderRight.copy(borderRight);
		windowSkin.borderTop.copy(borderTop);
		windowSkin.borderBot.copy(borderBot);
		windowSkin.background.copy(background);
		windowSkin.backgroundSelection.copy(backgroundSelection);
		windowSkin.backgroundRepeat = backgroundRepeatIndex === 1;
		windowSkin.arrowTargetSelection.copy(arrowTargetSelection);
		windowSkin.arrowEndMessage.copy(arrowEndMessage);
		windowSkin.arrowUpDown.copy(arrowUpDown);
		windowSkin.textNormal.copy(normalText);
		windowSkin.textHeal.copy(healText);
		windowSkin.textCritical.copy(criticalText);
		windowSkin.textMiss.copy(missText);
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		initialize();
	}, []);

	const getRectangleButtons = (label: string, rectangle: Rectangle, setRectangle: (r: Rectangle) => void) => (
		<>
			<Label disabled={isSelecting}>{t(label)}</Label>
			<Value>
				<Flex spaced>
					<Button
						onMouseEnter={() => handleMouseEnterButton(rectangle)}
						onClick={() => handleClickEnter(setRectangle)}
						disabled={isSelecting}
					>
						{t('enter')}...
					</Button>
					<Button
						onMouseEnter={() => handleMouseEnterButton(rectangle)}
						onClick={() => handleClickSelect(setRectangle)}
						disabled={isSelecting}
					>
						{t('select')}...
					</Button>
				</Flex>
			</Value>
		</>
	);

	return (
		<>
			<Dialog
				title={`${t('set.window.skin')}...`}
				isOpen
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
				initialWidth='750px'
				initialHeight='400px'
			>
				<Flex spacedLarge fillWidth>
					<Flex one column spacedLarge zeroWidth>
						<Flex one scrollable>
							<TextureWindowSkinSelector
								texture={selectedPicture?.getPath()}
								zoom={zoom}
								selectedRectangle={selectedRectangle}
								setSelectedRectangle={setSelectedRectangle}
								isSelecting={isSelecting}
								onSelectionFinished={handleSelectionFinished}
								base64={!selectedPicture?.isBR}
							/>
						</Flex>
						<Groupbox title={t('zoom')} disabled={!selectedPicture || isSelecting}>
							<Slider
								value={zoom}
								onChange={setZoom}
								min={0}
								max={10}
								fillWidth
								disabled={!selectedPicture || isSelecting}
							/>
						</Groupbox>
					</Flex>
					<Flex column>
						<Flex one column spacedLarge zeroHeight scrollable>
							<Flex column spaced>
								<Flex disabledLabel={isSelecting}>{t('name')}:</Flex>
								<InputText value={name} onChange={setName} disabled={isSelecting} />
							</Flex>
							<Flex column spaced>
								<Flex disabledLabel={isSelecting}>{t('picture')}:</Flex>
								<AssetSelector
									selectionType={ASSET_SELECTOR_TYPE.PICTURES}
									kind={PICTURE_KIND.WINDOW_SKINS}
									selectedID={pictureID}
									onChange={setPictureID}
									disabled={isSelecting}
								/>
							</Flex>
							<Groupbox title={t('side.borders')} disabled={isSelecting}>
								<Form>
									{getRectangleButtons(`${t('top')}-${t('left')}`, borderTopLeft, setBorderTopLeft)}
									{getRectangleButtons(
										`${t('top')}-${t('right')}`,
										borderTopRight,
										setBorderTopRight,
									)}
									{getRectangleButtons(`${t('bot')}-${t('left')}`, borderBotLeft, setBorderBotLeft)}
									{getRectangleButtons(
										`${t('bot')}-${t('right')}`,
										borderBotRight,
										setBorderBotRight,
									)}
								</Form>
							</Groupbox>
							<Groupbox title={t('borders')} disabled={isSelecting}>
								<Form>
									{getRectangleButtons(t('left'), borderLeft, setBorderLeft)}
									{getRectangleButtons(t('right'), borderRight, setBorderRight)}
									{getRectangleButtons(t('top'), borderTop, setBorderTop)}
									{getRectangleButtons(t('bot'), borderBot, setBorderBot)}
								</Form>
							</Groupbox>
							<Groupbox title={t('background')} disabled={isSelecting}>
								<Form>
									{getRectangleButtons(t('normal'), background, setBackground)}
									{getRectangleButtons(t('selection'), backgroundSelection, setBackgroundSelection)}
									<Label>{t('option')}</Label>
									<Value>
										<Dropdown
											selectedID={backgroundRepeatIndex}
											onChange={setBackgroundRepeatIndex}
											options={Model.Base.STRETCH_REPEAT_OPTIONS}
											translateOptions
										/>
									</Value>
								</Form>
							</Groupbox>
							<Groupbox title={t('arrows')} disabled={isSelecting}>
								<Form>
									{getRectangleButtons(
										t('target.selection'),
										arrowTargetSelection,
										setArrowTargetSelection,
									)}
									{getRectangleButtons(t('end.message'), arrowEndMessage, setArrowEndMessage)}
									{getRectangleButtons(`${t('up')} / ${t('down')}`, arrowUpDown, setArrowUpDown)}
								</Form>
							</Groupbox>
							<Groupbox title={t('texts')} disabled={isSelecting}>
								<Form>
									{getRectangleButtons(t('normal.damage'), normalText, setNormalText)}
									{getRectangleButtons(t('heal.damage'), healText, setHealText)}
									{getRectangleButtons(t('critical.damage'), criticalText, setCriticalText)}
									{getRectangleButtons(t('miss'), missText, setMissText)}
								</Form>
							</Groupbox>
						</Flex>
					</Flex>
				</Flex>
			</Dialog>
			{isDialogRectangleOpen && (
				<DialogRectangle
					setIsOpen={setIsDialogRectangleOpen}
					rectangle={selectedRectangle!}
					onChange={handleSelectionFinished}
				/>
			)}
		</>
	);
}

export default DialogWindowSkin;
