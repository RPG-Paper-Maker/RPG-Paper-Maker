/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, ITERATOR, Utils } from '../../../common';
import { DynamicValue } from '../../../core/DynamicValue';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandSetDialogBoxOptions({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
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

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			initializeCheck(list, iterator, setIsWindowSkinID, windowSkinID, DYNAMIC_VALUE_KIND.DATABASE, 1);
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
				setOutlineIndex(0);
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsColorID(false);
			if (checked) {
				setIsColorID(true);
				setIsColorText(true);
				colorTextID.updateCommand(list, iterator);
			} else {
				setIsColorText(false);
				colorTextID.updateToDefaultDatabase();
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			if (checked) {
				setIsColorID(true);
				setIsColorOutline(true);
				colorOutlineID.updateCommand(list, iterator);
			} else {
				setIsColorOutline(false);
				colorOutlineID.updateToDefaultDatabase();
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			if (checked) {
				setIsColorID(true);
				setIsColorBackground(true);
				colorBackgroundID.updateCommand(list, iterator);
			} else {
				setIsColorBackground(false);
				colorBackgroundID.updateToDefaultDatabase();
			}
			initializeCheck(list, iterator, setIsSizeID, sizeID, DYNAMIC_VALUE_KIND.DATABASE, 1);
			initializeCheck(list, iterator, setIsFontID, fontID, DYNAMIC_VALUE_KIND.DATABASE, 1);
		} else {
			setIsWindowSkinID(false);
			windowSkinID.updateToDefaultDatabase();
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
			setOutlineIndex(0);
			setIsColorID(false);
			setIsColorText(false);
			colorTextID.updateToDefaultDatabase();
			setIsColorOutline(false);
			colorOutlineID.updateToDefaultDatabase();
			setIsColorBackground(false);
			colorBackgroundID.updateToDefaultDatabase();
			setIsSizeID(false);
			sizeID.updateToDefaultDatabase();
			setIsFontID(false);
			fontID.updateToDefaultDatabase();
		}
		setTrigger((v) => !v);
	};

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
					<Checkbox isChecked={isWindowSkinID} onChange={setIsWindowSkinID}>
						{t('window.skin.id')}:
					</Checkbox>
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
								<Label>
									<Checkbox isChecked={isTransformX} onChange={setIsTransformX}>
										X
									</Checkbox>
								</Label>
								<Value>
									<DynamicValueSelector
										value={transformX}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isTransformX}
									/>
								</Value>
								<Label>
									<Checkbox isChecked={isTransformY} onChange={setIsTransformY}>
										Y
									</Checkbox>
								</Label>
								<Value>
									<DynamicValueSelector
										value={transformY}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isTransformY}
									/>
								</Value>
								<Label>
									<Checkbox isChecked={isTransformWidth} onChange={setIsTransformWidth}>
										{t('width')}
									</Checkbox>
								</Label>
								<Value>
									<DynamicValueSelector
										value={transformWidth}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isTransformWidth}
									/>
								</Value>
								<Label>
									<Checkbox isChecked={isTransformHeight} onChange={setIsTransformHeight}>
										{t('height')}
									</Checkbox>
								</Label>
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
								<Label>
									<Checkbox isChecked={isPaddingLeft} onChange={setIsPaddingLeft}>
										{t('left')}
									</Checkbox>
								</Label>
								<Value>
									<DynamicValueSelector
										value={paddingLeft}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isPaddingLeft}
									/>
								</Value>
								<Label>
									<Checkbox isChecked={isPaddingTop} onChange={setIsPaddingTop}>
										{t('top')}
									</Checkbox>
								</Label>
								<Value>
									<DynamicValueSelector
										value={paddingTop}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isPaddingTop}
									/>
								</Value>
								<Label>
									<Checkbox isChecked={isPaddingRight} onChange={setIsPaddingRight}>
										{t('right')}
									</Checkbox>
								</Label>
								<Value>
									<DynamicValueSelector
										value={paddingRight}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isPaddingRight}
									/>
								</Value>
								<Label>
									<Checkbox isChecked={isPaddingBottom} onChange={setIsPaddingBottom}>
										{t('bottom')}
									</Checkbox>
								</Label>
								<Value>
									<DynamicValueSelector
										value={paddingBottom}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isPaddingBottom}
									/>
								</Value>
							</Form>
						</Groupbox>
					</Flex>
					<Flex column spaced>
						<Groupbox title={t('faceset')}>
							<Form>
								<Label>
									<Checkbox isChecked={isFacesetPosition} onChange={setIsFacesetPosition}>
										{t('position')}
									</Checkbox>
								</Label>
								<Value>
									<Dropdown
										selectedID={facesetPositionIndex}
										onChange={setFacesetPositionIndex}
										options={Model.Base.BEHIND_ABOVE_OPTIONS}
										disabled={!isFacesetPosition}
										translateOptions
									/>
								</Value>
								<Label>
									<Checkbox isChecked={isFacesetX} onChange={setIsFacesetX}>
										X
									</Checkbox>
								</Label>
								<Value>
									<DynamicValueSelector
										value={facesetX}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isFacesetX}
									/>
								</Value>
								<Label>
									<Checkbox isChecked={isFacesetY} onChange={setIsFacesetY}>
										Y
									</Checkbox>
								</Label>
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
								<Label>
									<Checkbox isChecked={isOutline} onChange={setIsOutline}>
										{t('outline')}
									</Checkbox>
								</Label>
								<Value>
									<Dropdown
										selectedID={outlineIndex}
										onChange={setOutlineIndex}
										options={Model.Base.YES_NO_OPTIONS}
										disabled={!isOutline}
										translateOptions
									/>
								</Value>
								<Label>
									<Checkbox isChecked={isColorID} onChange={setIsColorID}>
										{t('color.id')}
									</Checkbox>
								</Label>
								<Value>
									<Form>
										<Label disabledColon={!isColorID}>
											<Checkbox
												isChecked={isColorText}
												onChange={setIsColorText}
												disabled={!isColorID}
											>
												{t('text')}
											</Checkbox>
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
											<Checkbox
												isChecked={isColorOutline}
												onChange={setIsColorOutline}
												disabled={!isColorID}
											>
												{t('outline')}
											</Checkbox>
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
								<Label>
									<Checkbox isChecked={isSizeID} onChange={setIsSizeID}>
										{t('size.id')}
									</Checkbox>
								</Label>
								<Value>
									<DynamicValueSelector
										value={sizeID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.systems.fontSizes}
										disabled={!isSizeID}
									/>
								</Value>
								<Label>
									<Checkbox isChecked={isFontID} onChange={setIsFontID}>
										{t('font.id')}
									</Checkbox>
								</Label>
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
					</Flex>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandSetDialogBoxOptions;
