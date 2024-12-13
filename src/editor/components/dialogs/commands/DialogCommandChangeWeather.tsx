/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, PICTURE_KIND, Utils } from '../../../common';
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Button from '../../Button';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

enum SELECTION_TYPE {
	NONE,
	CUSTOM,
}

enum SELECTION_TEXTURE_TYPE {
	COLOR,
	IMAGE,
}

function DialogCommandChangeWeather({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [selectionType, setSelectionType] = useStateNumber();
	const [selectionTextureType, setSelectionTextureType] = useStateNumber();
	const [textureColorID] = useStateDynamicValue();
	const [textureImageID] = useStateDynamicValue();
	const [numberPerPortion] = useStateDynamicValue();
	const [rayPortions] = useStateDynamicValue();
	const [size] = useStateDynamicValue();
	const [depthTest] = useStateDynamicValue();
	const [depthWrite] = useStateDynamicValue();
	const [initialVelocity] = useStateDynamicValue();
	const [veclocityAddition] = useStateDynamicValue();
	const [initialYRotation] = useStateDynamicValue();
	const [yRotationAddition] = useStateDynamicValue();
	const [isWaitingEndCommand, setIsWaitingEndCommand] = useStateBool();
	const [time] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const disableCustom = selectionType !== SELECTION_TYPE.CUSTOM;

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			const newSelectionType = list[iterator.i++] as number;
			setSelectionType(newSelectionType);
			if (newSelectionType === SELECTION_TYPE.CUSTOM) {
				const newSelectionTextureType = list[iterator.i++] as number;
				setSelectionTextureType(newSelectionTextureType);
				if (newSelectionTextureType === SELECTION_TEXTURE_TYPE.COLOR) {
					textureColorID.updateCommand(list, iterator);
				} else {
					textureImageID.updateCommand(list, iterator, true);
				}
				numberPerPortion.updateCommand(list, iterator);
				rayPortions.updateCommand(list, iterator);
				size.updateCommand(list, iterator);
				depthTest.updateCommand(list, iterator);
				depthWrite.updateCommand(list, iterator);
				initialVelocity.updateCommand(list, iterator);
				veclocityAddition.updateCommand(list, iterator);
				initialYRotation.updateCommand(list, iterator);
				yRotationAddition.updateCommand(list, iterator);
			} else {
				handleClickRain();
			}
			setIsWaitingEndCommand(Utils.initializeBoolCommand(list, iterator));
			time.updateCommand(list, iterator);
		} else {
			setSelectionType(SELECTION_TYPE.NONE);
			handleClickRain();
			setIsWaitingEndCommand(true);
			time.updateToDefaultNumber(0, true);
		}
	};

	const handleClickRain = () => {
		setSelectionTextureType(SELECTION_TEXTURE_TYPE.IMAGE);
		textureColorID.updateToDefaultDatabase();
		textureImageID.updateToDefaultNumber(1);
		numberPerPortion.updateToDefaultNumber(300);
		rayPortions.updateToDefaultNumber(1);
		size.updateToDefaultNumber(6);
		depthTest.updateToDefaultSwitch();
		depthWrite.updateToDefaultSwitch(false);
		initialVelocity.updateToDefaultFormula('6');
		veclocityAddition.updateToDefaultFormula('-Math.random() * 0.002');
		initialYRotation.updateToDefaultFormula('0');
		yRotationAddition.updateToDefaultFormula('0');
		setTrigger((v) => !v);
	};

	const handleClickSnow = () => {
		setSelectionTextureType(SELECTION_TEXTURE_TYPE.IMAGE);
		textureColorID.updateToDefaultDatabase();
		textureImageID.updateToDefaultDatabase(2);
		numberPerPortion.updateToDefaultNumber(200);
		rayPortions.updateToDefaultNumber(2);
		size.updateToDefaultNumber(6);
		depthTest.updateToDefaultSwitch();
		depthWrite.updateToDefaultSwitch(false);
		initialVelocity.updateToDefaultFormula('-1');
		veclocityAddition.updateToDefaultFormula('-Math.random() * 0.002');
		initialYRotation.updateToDefaultFormula('0.001');
		yRotationAddition.updateToDefaultFormula('0');
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(selectionType);
		if (selectionType === SELECTION_TYPE.CUSTOM) {
			newList.push(selectionTextureType);
			if (selectionTextureType === SELECTION_TEXTURE_TYPE.COLOR) {
				textureColorID.getCommand(newList);
			} else {
				textureImageID.getCommand(newList, true);
			}
			numberPerPortion.getCommand(newList);
			rayPortions.getCommand(newList);
			size.getCommand(newList);
			depthTest.getCommand(newList);
			depthWrite.getCommand(newList);
			initialVelocity.getCommand(newList);
			veclocityAddition.getCommand(newList);
			initialYRotation.getCommand(newList);
			yRotationAddition.getCommand(newList);
		}
		newList.push(Utils.boolToNum(isWaitingEndCommand));
		time.getCommand(newList);
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('change.weather')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Flex column spaced>
					<RadioGroup selected={selectionType} onChange={setSelectionType}>
						<RadioButton value={SELECTION_TYPE.NONE}>{t('none')}</RadioButton>
						<Flex spaced centerV>
							<RadioButton value={SELECTION_TYPE.CUSTOM}>{t('custom')}:</RadioButton>
							<Button disabled={disableCustom} onClick={handleClickRain}>
								{t('rain')}
							</Button>
							<Button disabled={disableCustom} onClick={handleClickSnow}>
								{t('snow')}
							</Button>
						</Flex>
					</RadioGroup>
				</Flex>
				<Groupbox title={t('options')} disabled={disableCustom}>
					<RadioGroup selected={selectionTextureType} onChange={setSelectionTextureType}>
						<Form>
							<Label>{t('texture')}</Label>
							<Value>
								<Form>
									<Label>
										<RadioButton value={SELECTION_TEXTURE_TYPE.COLOR} disabled={disableCustom}>
											{t('color.id')}
										</RadioButton>
									</Label>
									<Value>
										<DynamicValueSelector
											value={textureColorID}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
											databaseOptions={Project.current!.systems.colors}
											disabled={
												disableCustom || selectionTextureType !== SELECTION_TEXTURE_TYPE.COLOR
											}
										/>
									</Value>
									<Label>
										<RadioButton value={SELECTION_TEXTURE_TYPE.IMAGE} disabled={disableCustom}>
											{t('image')}
										</RadioButton>
									</Label>
									<Value>
										<AssetSelector
											selectionType={ASSET_SELECTOR_TYPE.PICTURES}
											selectedDynamic={textureImageID}
											kind={PICTURE_KIND.PARTICLES}
											disabled={
												disableCustom || selectionTextureType !== SELECTION_TEXTURE_TYPE.IMAGE
											}
											active
										/>
									</Value>
								</Form>
							</Value>
							<Label>{t('number.per.portion')}</Label>
							<Value>
								<DynamicValueSelector
									value={numberPerPortion}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									disabled={disableCustom}
								/>
							</Value>
							<Label>{t('ray.portions')}</Label>
							<Value>
								<DynamicValueSelector
									value={rayPortions}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									disabled={disableCustom}
								/>
							</Value>
							<Label>{t('size')}</Label>
							<Value>
								<DynamicValueSelector
									value={size}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									disabled={disableCustom}
								/>
							</Value>
							<Label>Depth test</Label>
							<Value>
								<DynamicValueSelector
									value={depthTest}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.SWITCH}
									disabled={disableCustom}
								/>
							</Value>
							<Label>Depth write</Label>
							<Value>
								<DynamicValueSelector
									value={depthWrite}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.SWITCH}
									disabled={disableCustom}
								/>
							</Value>
							<Label>{t('initial.velocity')}</Label>
							<Value>
								<DynamicValueSelector
									value={initialVelocity}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
									disabled={disableCustom}
								/>
							</Value>
							<Label>{t('velocity.addition')}</Label>
							<Value>
								<DynamicValueSelector
									value={veclocityAddition}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
									disabled={disableCustom}
								/>
							</Value>
							<Label>{t('initial.y.rotation')}</Label>
							<Value>
								<DynamicValueSelector
									value={initialYRotation}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
									disabled={disableCustom}
								/>
							</Value>
							<Label>{t('y.rotation.addition')}</Label>
							<Value>
								<DynamicValueSelector
									value={yRotationAddition}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
									disabled={disableCustom}
								/>
							</Value>
						</Form>
					</RadioGroup>
				</Groupbox>
				<Flex column spaced>
					<Checkbox isChecked={isWaitingEndCommand} onChange={setIsWaitingEndCommand}>
						{t('wait.end.change.before.next.command')}
					</Checkbox>
					<Flex>
						<Flex one />
						<Flex spaced centerV>
							<div>{t('time')}:</div>
							<DynamicValueSelector
								value={time}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
							/>
							<div>{t('seconds')}</div>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeWeather;
