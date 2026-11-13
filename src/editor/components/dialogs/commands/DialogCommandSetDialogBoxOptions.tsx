/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Constants, DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, ITERATOR, SONG_KIND, Utils } from '../../../common';
import { DynamicValue } from '../../../core/DynamicValue';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
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
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

type Props = CommandProps & {
	isSystemDefault?: boolean;
};

function DialogCommandSetDialogBoxOptions({
	commandKind,
	setIsOpen,
	list,
	onAccept,
	onReject,
	isSystemDefault = false,
}: Props) {
	const { t } = useTranslation();

	const [isWindowSkinID, setIsWindowSkinID] = useStateBool();
	const [windowSkinID] = useStateDynamicValue();

	const [isTransformX, setIsTransformX] = useStateBool();
	const [transformX] = useStateDynamicValue();
	const [isTransformY, setIsTransformY] = useStateBool();
	const [transformY] = useStateDynamicValue();
	const [isTransformWidth, setIsTransformWidth] = useStateBool();
	const [transformWidth] = useStateDynamicValue();
	const [isTransformHeight, setIsTransformHeight] = useStateBool();
	const [transformHeight] = useStateDynamicValue();

	const [isPaddingLeft, setIsPaddingLeft] = useStateBool();
	const [paddingLeft] = useStateDynamicValue();
	const [isPaddingTop, setIsPaddingTop] = useStateBool();
	const [paddingTop] = useStateDynamicValue();
	const [isPaddingRight, setIsPaddingRight] = useStateBool();
	const [paddingRight] = useStateDynamicValue();
	const [isPaddingBottom, setIsPaddingBottom] = useStateBool();
	const [paddingBottom] = useStateDynamicValue();

	const [isFacesetPosition, setIsFacesetPosition] = useStateBool();
	const [facesetPositionIndex, setFacesetPositionIndex] = useStateNumber();
	const [isFacesetX, setIsFacesetX] = useStateBool();
	const [facesetX] = useStateDynamicValue();
	const [isFacesetY, setIsFacesetY] = useStateBool();
	const [facesetY] = useStateDynamicValue();

	const [isOutline, setIsOutline] = useStateBool();
	const [outlineIndex, setOutlineIndex] = useStateNumber();
	const [isColorID, setIsColorID] = useStateBool();
	const [isColorText, setIsColorText] = useStateBool();
	const [colorTextID] = useStateDynamicValue();
	const [isColorOutline, setIsColorOutline] = useStateBool();
	const [colorOutlineID] = useStateDynamicValue();
	const [isColorBackground, setIsColorBackground] = useStateBool();
	const [colorBackgroundID] = useStateDynamicValue();
	const [isSizeID, setIsSizeID] = useStateBool();
	const [sizeID] = useStateDynamicValue();
	const [isFontID, setIsFontID] = useStateBool();
	const [fontID] = useStateDynamicValue();

	const [isInterlocutorX, setIsInterlocutorX] = useStateBool();
	const [interlocutorX] = useStateDynamicValue();
	const [isInterlocutorY, setIsInterlocutorY] = useStateBool();
	const [interlocutorY] = useStateDynamicValue();
	const [isInterlocutorW, setIsInterlocutorW] = useStateBool();
	const [interlocutorW] = useStateDynamicValue();
	const [isInterlocutorH, setIsInterlocutorH] = useStateBool();
	const [interlocutorH] = useStateDynamicValue();

	const [isTypewriter, setIsTypewriter] = useStateBool();
	const [typewriterIndex, setTypewriterIndex] = useStateNumber();
	const [isTypewriterInterval, setIsTypewriterInterval] = useStateBool();
	const [typewriterInterval] = useStateDynamicValue();
	const [isTypewriterSound, setIsTypewriterSound] = useStateBool();
	const [typewriterSound] = useStateDynamicValue();
	const [isTypewriterVolume, setIsTypewriterVolume] = useStateBool();
	const [typewriterVolume] = useStateDynamicValue();

	const [, setTrigger] = useStateBool();

	const initializeCheck = (
		l: Model.MapObjectCommandType[],
		iterator: ITERATOR,
		setter: (b: boolean) => void,
		dynamic: DynamicValue,
		defaultKind: DYNAMIC_VALUE_KIND,
		defaultValue: unknown,
	) => {
		const checked = Utils.initializeBoolCommand(l, iterator);
		setter(checked);
		if (checked) {
			dynamic.updateCommand(l, iterator);
		} else {
			dynamic.kind = defaultKind;
			dynamic.value = defaultValue;
		}
	};

	const getDefaultTextColorID = () => {
		const colors = Project.current!.systems.colors;
		if (isSystemDefault) {
			const white = colors.find((color) => color.red === 255 && color.green === 255 && color.blue === 255);
			if (white) {
				return white.id;
			}
		}
		return colors[0]?.id ?? 1;
	};

	const getDefaultFontSizeID = () => {
		const fontSizes = Project.current!.systems.fontSizes;
		if (isSystemDefault) {
			const fontSize = fontSizes.find((size) => size.size.getFixNumberValue() === Constants.DEFAULT_FONT_SIZE);
			if (fontSize) {
				return fontSize.id;
			}
		}
		return fontSizes[0]?.id ?? 1;
	};

	const getDefaultFontNameID = () => {
		const fontNames = Project.current!.systems.fontNames;
		if (isSystemDefault) {
			const fontName = fontNames.find(
				(font) =>
					(font.isBasic ? String(font.font?.value ?? '') : font.getName()).toLowerCase() ===
					Constants.DEFAULT_FONT_NAME.toLowerCase(),
			);
			if (fontName) {
				return fontName.id;
			}
		}
		return fontNames[0]?.id ?? 1;
	};

	const getDefaultOutlineIndex = () => (isSystemDefault ? 1 : 0);

	const forceSystemDefaultChecks = () => {
		if (!isSystemDefault) {
			return;
		}
		setIsWindowSkinID(true);
		setIsTransformX(true);
		setIsTransformY(true);
		setIsTransformWidth(true);
		setIsTransformHeight(true);
		setIsPaddingLeft(true);
		setIsPaddingTop(true);
		setIsPaddingRight(true);
		setIsPaddingBottom(true);
		setIsFacesetPosition(true);
		setIsFacesetX(true);
		setIsFacesetY(true);
		setIsOutline(true);
		setIsColorID(true);
		setIsColorText(true);
		setIsColorOutline(true);
		setIsSizeID(true);
		setIsFontID(true);
		setIsInterlocutorX(true);
		setIsInterlocutorY(true);
		setIsInterlocutorW(true);
		setIsInterlocutorH(true);
		setIsTypewriter(true);
		setIsTypewriterInterval(true);
		setIsTypewriterSound(true);
		setIsTypewriterVolume(true);
	};

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			initializeCheck(
				list,
				iterator,
				setIsWindowSkinID,
				windowSkinID,
				DYNAMIC_VALUE_KIND.DATABASE,
				Project.current!.systems.windowSkins[0]?.id ?? 1,
			);
			initializeCheck(list, iterator, setIsTransformX, transformX, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0);
			initializeCheck(list, iterator, setIsTransformY, transformY, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0);
			initializeCheck(list, iterator, setIsTransformWidth, transformWidth, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0);
			initializeCheck(
				list,
				iterator,
				setIsTransformHeight,
				transformHeight,
				DYNAMIC_VALUE_KIND.NUMBER_DECIMAL,
				0,
			);
			initializeCheck(list, iterator, setIsPaddingLeft, paddingLeft, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0);
			initializeCheck(list, iterator, setIsPaddingTop, paddingTop, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0);
			initializeCheck(list, iterator, setIsPaddingRight, paddingRight, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0);
			initializeCheck(list, iterator, setIsPaddingBottom, paddingBottom, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0);
			let checked = Utils.initializeBoolCommand(list, iterator);
			setIsFacesetPosition(checked);
			if (checked) {
				setFacesetPositionIndex(list[iterator.i++] as number);
			} else {
				setFacesetPositionIndex(0);
			}
			initializeCheck(list, iterator, setIsFacesetX, facesetX, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0);
			initializeCheck(list, iterator, setIsFacesetY, facesetY, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 0);
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsOutline(checked);
			if (checked) {
				setOutlineIndex(list[iterator.i++] as number);
			} else {
				setOutlineIndex(getDefaultOutlineIndex());
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsColorID(false);
			if (checked) {
				setIsColorID(true);
				setIsColorText(true);
				colorTextID.updateCommand(list, iterator);
			} else {
				setIsColorText(false);
				colorTextID.update(DYNAMIC_VALUE_KIND.DATABASE, getDefaultTextColorID());
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			if (checked) {
				setIsColorID(true);
				setIsColorOutline(true);
				colorOutlineID.updateCommand(list, iterator);
			} else {
				setIsColorOutline(false);
				colorOutlineID.updateToDefaultDatabase(Project.current!.systems.colors);
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			if (checked) {
				setIsColorID(true);
				setIsColorBackground(true);
				colorBackgroundID.updateCommand(list, iterator);
			} else {
				setIsColorBackground(false);
				colorBackgroundID.updateToDefaultDatabase(Project.current!.systems.colors);
			}
			initializeCheck(list, iterator, setIsSizeID, sizeID, DYNAMIC_VALUE_KIND.DATABASE, getDefaultFontSizeID());
			initializeCheck(list, iterator, setIsFontID, fontID, DYNAMIC_VALUE_KIND.DATABASE, getDefaultFontNameID());
			initializeCheck(list, iterator, setIsInterlocutorX, interlocutorX, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 30);
			initializeCheck(list, iterator, setIsInterlocutorY, interlocutorY, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, -30);
			initializeCheck(list, iterator, setIsInterlocutorW, interlocutorW, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 400);
			initializeCheck(list, iterator, setIsInterlocutorH, interlocutorH, DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, 60);
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsTypewriter(checked);
			if (checked) {
				setTypewriterIndex(list[iterator.i++] as number);
			} else {
				setTypewriterIndex(1);
			}
			initializeCheck(list, iterator, setIsTypewriterInterval, typewriterInterval, DYNAMIC_VALUE_KIND.NUMBER, 30);
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsTypewriterSound(checked);
			if (checked) {
				typewriterSound.updateCommand(list, iterator, true);
			} else {
				typewriterSound.updateToDefaultNumber(10);
			}
			initializeCheck(list, iterator, setIsTypewriterVolume, typewriterVolume, DYNAMIC_VALUE_KIND.NUMBER, 100);
		} else {
			setIsWindowSkinID(false);
			windowSkinID.updateToDefaultDatabase(Project.current!.systems.windowSkins);
			setIsTransformX(false);
			transformX.updateToDefaultNumber(0, true);
			setIsTransformY(false);
			transformY.updateToDefaultNumber(0, true);
			setIsTransformWidth(false);
			transformWidth.updateToDefaultNumber(0, true);
			setIsTransformHeight(false);
			transformHeight.updateToDefaultNumber(0, true);
			setIsPaddingLeft(false);
			paddingLeft.updateToDefaultNumber(0, true);
			setIsPaddingTop(false);
			paddingTop.updateToDefaultNumber(0, true);
			setIsPaddingRight(false);
			paddingRight.updateToDefaultNumber(0, true);
			setIsPaddingBottom(false);
			paddingBottom.updateToDefaultNumber(0, true);
			setIsFacesetPosition(false);
			setFacesetPositionIndex(0);
			setIsFacesetX(false);
			facesetX.updateToDefaultNumber(0, true);
			setIsFacesetY(false);
			facesetY.updateToDefaultNumber(0, true);
			setIsOutline(false);
			setOutlineIndex(getDefaultOutlineIndex());
			setIsColorID(false);
			setIsColorText(false);
			colorTextID.update(DYNAMIC_VALUE_KIND.DATABASE, getDefaultTextColorID());
			setIsColorOutline(false);
			colorOutlineID.updateToDefaultDatabase(Project.current!.systems.colors);
			setIsColorBackground(false);
			colorBackgroundID.updateToDefaultDatabase(Project.current!.systems.colors);
			setIsSizeID(false);
			sizeID.update(DYNAMIC_VALUE_KIND.DATABASE, getDefaultFontSizeID());
			setIsFontID(false);
			fontID.update(DYNAMIC_VALUE_KIND.DATABASE, getDefaultFontNameID());
			setIsInterlocutorX(false);
			interlocutorX.updateToDefaultNumber(30, true);
			setIsInterlocutorY(false);
			interlocutorY.updateToDefaultNumber(-30, true);
			setIsInterlocutorW(false);
			interlocutorW.updateToDefaultNumber(400, true);
			setIsInterlocutorH(false);
			interlocutorH.updateToDefaultNumber(60, true);
			setIsTypewriter(false);
			setTypewriterIndex(1);
			setIsTypewriterInterval(false);
			typewriterInterval.updateToDefaultNumber(30);
			setIsTypewriterSound(false);
			typewriterSound.updateToDefaultNumber(10);
			setIsTypewriterVolume(false);
			typewriterVolume.updateToDefaultNumber(100);
		}
		forceSystemDefaultChecks();
		setTrigger((v) => !v);
	};

	const isTypewriterOff = isTypewriter && typewriterIndex === 1;

	const getCheckbox = (isChecked: boolean, onChange: (b: boolean) => void, label: ReactNode, disabled = false) =>
		isSystemDefault ? (
			label
		) : (
			<Checkbox isChecked={isChecked} onChange={onChange} disabled={disabled}>
				{label}
			</Checkbox>
		);

	const getCommandCheck = (newList: Model.MapObjectCommandType[], checked: boolean, dynamic: DynamicValue) => {
		newList.push(Utils.boolToNum(checked));
		if (checked) {
			dynamic.getCommand(newList);
		}
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		getCommandCheck(newList, isWindowSkinID, windowSkinID);
		getCommandCheck(newList, isTransformX, transformX);
		getCommandCheck(newList, isTransformY, transformY);
		getCommandCheck(newList, isTransformWidth, transformWidth);
		getCommandCheck(newList, isTransformHeight, transformHeight);
		getCommandCheck(newList, isPaddingLeft, paddingLeft);
		getCommandCheck(newList, isPaddingTop, paddingTop);
		getCommandCheck(newList, isPaddingRight, paddingRight);
		getCommandCheck(newList, isPaddingBottom, paddingBottom);
		newList.push(Utils.boolToNum(isFacesetPosition));
		if (isFacesetPosition) {
			newList.push(facesetPositionIndex);
		}
		getCommandCheck(newList, isFacesetX, facesetX);
		getCommandCheck(newList, isFacesetY, facesetY);
		newList.push(Utils.boolToNum(isOutline));
		if (isOutline) {
			newList.push(outlineIndex);
		}
		getCommandCheck(newList, isColorText, colorTextID);
		getCommandCheck(newList, isColorOutline, colorOutlineID);
		getCommandCheck(newList, isColorBackground, colorBackgroundID);
		getCommandCheck(newList, isSizeID, sizeID);
		getCommandCheck(newList, isFontID, fontID);
		getCommandCheck(newList, isInterlocutorX, interlocutorX);
		getCommandCheck(newList, isInterlocutorY, interlocutorY);
		getCommandCheck(newList, isInterlocutorW, interlocutorW);
		getCommandCheck(newList, isInterlocutorH, interlocutorH);
		newList.push(Utils.boolToNum(isTypewriter));
		if (isTypewriter) {
			newList.push(typewriterIndex);
		}
		getCommandCheck(newList, isTypewriterInterval, typewriterInterval);
		newList.push(Utils.boolToNum(isTypewriterSound));
		if (isTypewriterSound) {
			typewriterSound.getCommand(newList, true);
		}
		getCommandCheck(newList, isTypewriterVolume, typewriterVolume);
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('set.dialog.box.options')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spaced>
				<Flex spaced>
					{getCheckbox(isWindowSkinID, setIsWindowSkinID, `${t('window.skin.id')}:`)}
					<DynamicValueSelector
						value={windowSkinID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.systems.windowSkins}
						disabled={!isWindowSkinID}
					/>
				</Flex>
				<Flex columnMobile spaced>
					<Flex column spaced>
						<Groupbox title={t('transform')}>
							<Form>
								<Label>{getCheckbox(isTransformX, setIsTransformX, 'X')}</Label>
								<Value>
									<DynamicValueSelector
										value={transformX}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isTransformX}
									/>
								</Value>
								<Label>{getCheckbox(isTransformY, setIsTransformY, 'Y')}</Label>
								<Value>
									<DynamicValueSelector
										value={transformY}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isTransformY}
									/>
								</Value>
								<Label>{getCheckbox(isTransformWidth, setIsTransformWidth, t('width'))}</Label>
								<Value>
									<DynamicValueSelector
										value={transformWidth}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isTransformWidth}
									/>
								</Value>
								<Label>{getCheckbox(isTransformHeight, setIsTransformHeight, t('height'))}</Label>
								<Value>
									<DynamicValueSelector
										value={transformHeight}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isTransformHeight}
									/>
								</Value>
							</Form>
						</Groupbox>
						<Groupbox title={t('padding')}>
							<Form>
								<Label>{getCheckbox(isPaddingLeft, setIsPaddingLeft, t('left'))}</Label>
								<Value>
									<DynamicValueSelector
										value={paddingLeft}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isPaddingLeft}
									/>
								</Value>
								<Label>{getCheckbox(isPaddingTop, setIsPaddingTop, t('top'))}</Label>
								<Value>
									<DynamicValueSelector
										value={paddingTop}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isPaddingTop}
									/>
								</Value>
								<Label>{getCheckbox(isPaddingRight, setIsPaddingRight, t('right'))}</Label>
								<Value>
									<DynamicValueSelector
										value={paddingRight}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isPaddingRight}
									/>
								</Value>
								<Label>{getCheckbox(isPaddingBottom, setIsPaddingBottom, t('bottom'))}</Label>
								<Value>
									<DynamicValueSelector
										value={paddingBottom}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isPaddingBottom}
									/>
								</Value>
							</Form>
						</Groupbox>
						<Groupbox title={t('interlocutor')}>
							<Form>
								<Label>{getCheckbox(isInterlocutorX, setIsInterlocutorX, 'X')}</Label>
								<Value>
									<DynamicValueSelector
										value={interlocutorX}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isInterlocutorX}
									/>
								</Value>
								<Label>{getCheckbox(isInterlocutorY, setIsInterlocutorY, 'Y')}</Label>
								<Value>
									<DynamicValueSelector
										value={interlocutorY}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isInterlocutorY}
									/>
								</Value>
								<Label>{getCheckbox(isInterlocutorW, setIsInterlocutorW, t('width'))}</Label>
								<Value>
									<DynamicValueSelector
										value={interlocutorW}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isInterlocutorW}
									/>
								</Value>
								<Label>{getCheckbox(isInterlocutorH, setIsInterlocutorH, t('height'))}</Label>
								<Value>
									<DynamicValueSelector
										value={interlocutorH}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isInterlocutorH}
									/>
								</Value>
							</Form>
						</Groupbox>
					</Flex>
					<Flex column spaced>
						<Groupbox title={t('faceset')}>
							<Form>
								<Label>{getCheckbox(isFacesetPosition, setIsFacesetPosition, t('position'))}</Label>
								<Value>
									<Dropdown
										selectedID={facesetPositionIndex}
										onChange={setFacesetPositionIndex}
										options={Model.Base.BEHIND_ABOVE_OPTIONS}
										disabled={!isFacesetPosition}
										translateOptions
									/>
								</Value>
								<Label>{getCheckbox(isFacesetX, setIsFacesetX, 'X')}</Label>
								<Value>
									<DynamicValueSelector
										value={facesetX}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isFacesetX}
									/>
								</Value>
								<Label>{getCheckbox(isFacesetY, setIsFacesetY, 'Y')}</Label>
								<Value>
									<DynamicValueSelector
										value={facesetY}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isFacesetY}
									/>
								</Value>
							</Form>
						</Groupbox>
						<Groupbox title={t('text')}>
							<Form>
								<Label>{getCheckbox(isOutline, setIsOutline, t('outline'))}</Label>
								<Value>
									<Dropdown
										selectedID={outlineIndex}
										onChange={setOutlineIndex}
										options={Model.Base.YES_NO_OPTIONS}
										disabled={!isOutline}
										translateOptions
									/>
								</Value>
								<Label>{getCheckbox(isColorID, setIsColorID, t('color.id'))}</Label>
								<Value>
									<Form>
										<Label disabledColon={!isColorID}>
											{getCheckbox(isColorText, setIsColorText, t('text'), !isColorID)}
										</Label>
										<Value>
											<DynamicValueSelector
												value={colorTextID}
												optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
												databaseOptions={Project.current!.systems.colors}
												disabled={!isColorID || !isColorText}
											/>
										</Value>
										<Label disabledColon={!isColorID}>
											{getCheckbox(isColorOutline, setIsColorOutline, t('outline'), !isColorID)}
										</Label>
										<Value>
											<DynamicValueSelector
												value={colorOutlineID}
												optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
												databaseOptions={Project.current!.systems.colors}
												disabled={!isColorID || !isColorOutline}
											/>
										</Value>
										<Label disabledColon={!isColorID}>
											<Checkbox
												isChecked={isColorBackground}
												onChange={setIsColorBackground}
												disabled={!isColorID}
											>
												{t('background')}
											</Checkbox>
										</Label>
										<Value>
											<DynamicValueSelector
												value={colorBackgroundID}
												optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
												databaseOptions={Project.current!.systems.colors}
												disabled={!isColorID || !isColorBackground}
											/>
										</Value>
									</Form>
								</Value>
								<Label>{getCheckbox(isSizeID, setIsSizeID, t('size.id'))}</Label>
								<Value>
									<DynamicValueSelector
										value={sizeID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.systems.fontSizes}
										disabled={!isSizeID}
									/>
								</Value>
								<Label>{getCheckbox(isFontID, setIsFontID, t('font.id'))}</Label>
								<Value>
									<DynamicValueSelector
										value={fontID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.systems.fontNames}
										disabled={!isFontID}
									/>
								</Value>
							</Form>
						</Groupbox>
						<Groupbox title={t('typewriter')}>
							<Form>
								<Label>{getCheckbox(isTypewriter, setIsTypewriter, t('typewriter.effect'))}</Label>
								<Value>
									<Dropdown
										selectedID={typewriterIndex}
										onChange={setTypewriterIndex}
										options={Model.Base.YES_NO_OPTIONS}
										disabled={!isTypewriter}
										translateOptions
									/>
								</Value>
								<Label>
									{getCheckbox(
										isTypewriterInterval,
										setIsTypewriterInterval,
										t('interval.ms'),
										isTypewriterOff,
									)}
								</Label>
								<Value>
									<DynamicValueSelector
										value={typewriterInterval}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
										disabled={isTypewriterOff || !isTypewriterInterval}
									/>
								</Value>
								<Label>
									{getCheckbox(isTypewriterSound, setIsTypewriterSound, t('sound'), isTypewriterOff)}
								</Label>
								<Value>
									<AssetSelector
										selectionType={ASSET_SELECTOR_TYPE.SONGS}
										kind={SONG_KIND.SOUND}
										selectedDynamic={typewriterSound}
										disabled={isTypewriterOff || !isTypewriterSound}
										active
									/>
								</Value>
								<Label>
									{getCheckbox(
										isTypewriterVolume,
										setIsTypewriterVolume,
										t('volume'),
										isTypewriterOff,
									)}
								</Label>
								<Value>
									<DynamicValueSelector
										value={typewriterVolume}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
										disabled={isTypewriterOff || !isTypewriterVolume}
									/>
								</Value>
							</Form>
						</Groupbox>
					</Flex>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandSetDialogBoxOptions;
