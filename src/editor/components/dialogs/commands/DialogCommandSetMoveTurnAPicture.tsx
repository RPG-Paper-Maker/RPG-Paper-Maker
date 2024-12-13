/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, PICTURE_KIND, Utils } from '../../../common';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import PanelWaitTime, { PanelWaitTimeRef } from '../../panels/PanelWaitTime';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandSetMoveTurnAPicture({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const panelWaitTimeRef = useRef<PanelWaitTimeRef>();

	const [index] = useStateDynamicValue();
	const [isSet, setIsSet] = useStateBool();
	const [isSetImageID, setIsSetImageID] = useStateBool();
	const [imageID] = useStateDynamicValue();
	const [isSetZoom, setIsSetZoom] = useStateBool();
	const [zoom] = useStateDynamicValue();
	const [isSetOpacity, setIsSetOpacity] = useStateBool();
	const [opacity] = useStateDynamicValue();
	const [isMove, setIsMove] = useStateBool();
	const [isMoveX, setIsMoveX] = useStateBool();
	const [moveX] = useStateDynamicValue();
	const [isMoveY, setIsMoveY] = useStateBool();
	const [moveY] = useStateDynamicValue();
	const [isTurn, setIsTurn] = useStateBool();
	const [isTurnAngle, setIsTurnAngle] = useStateBool();
	const [turnAngle] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		index.updateToDefaultNumber(0);
		imageID.isActivated = false;
		imageID.updateToDefaultNumber(-1);
		zoom.updateToDefaultNumber(100, true);
		opacity.updateToDefaultNumber(100, true);
		moveX.updateToDefaultNumber(0, true);
		moveY.updateToDefaultNumber(0, true);
		turnAngle.updateToDefaultNumber(0, true);
		if (list) {
			const iterator = Utils.generateIterator();
			index.updateCommand(list, iterator);
			let checkedSet = false;
			let checked = Utils.initializeBoolCommand(list, iterator);
			if (checked) {
				checkedSet = true;
				imageID.updateCommand(list, iterator, true);
			}
			setIsSetImageID(checked);
			checked = Utils.initializeBoolCommand(list, iterator);
			if (checked) {
				checkedSet = true;
				zoom.updateCommand(list, iterator);
			}
			setIsSetZoom(checked);
			checked = Utils.initializeBoolCommand(list, iterator);
			if (checked) {
				checkedSet = true;
				opacity.updateCommand(list, iterator);
			}
			setIsSetOpacity(checked);
			setIsSet(checkedSet);
			let checkedMove = false;
			checked = Utils.initializeBoolCommand(list, iterator);
			if (checked) {
				checkedMove = true;
				moveX.updateCommand(list, iterator);
			}
			setIsMoveX(checked);
			checked = Utils.initializeBoolCommand(list, iterator);
			if (checked) {
				checkedMove = true;
				moveY.updateCommand(list, iterator);
			}
			setIsMoveY(checked);
			setIsMove(checkedMove);
			checked = Utils.initializeBoolCommand(list, iterator);
			if (checked) {
				turnAngle.updateCommand(list, iterator);
			}
			setIsTurnAngle(checked);
			setIsTurn(checked);
			panelWaitTimeRef.current?.initialize(list, iterator);
		} else {
			setIsSet(false);
			setIsSetImageID(false);
			setIsSetZoom(false);
			setIsSetOpacity(false);
			setIsMove(false);
			setIsMoveX(false);
			setIsMoveY(false);
			setIsTurn(false);
			setIsTurnAngle(false);
			panelWaitTimeRef.current?.initialize();
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		index.getCommand(newList);
		newList.push(Utils.boolToNum(isSet && isSetImageID));
		if (isSet && isSetImageID) {
			imageID.getCommand(newList, true);
		}
		newList.push(Utils.boolToNum(isSet && isSetZoom));
		if (isSet && isSetZoom) {
			zoom.getCommand(newList);
		}
		newList.push(Utils.boolToNum(isSet && isSetOpacity));
		if (isSet && isSetOpacity) {
			opacity.getCommand(newList);
		}
		newList.push(Utils.boolToNum(isMove && isMoveX));
		if (isMove && isMoveX) {
			moveX.getCommand(newList);
		}
		newList.push(Utils.boolToNum(isMove && isMoveY));
		if (isMove && isMoveY) {
			moveY.getCommand(newList);
		}
		newList.push(Utils.boolToNum(isTurn && isTurnAngle));
		if (isTurn && isTurnAngle) {
			turnAngle.getCommand(newList);
		}
		panelWaitTimeRef.current?.getCommand(newList);
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
			title={`${t('set.move.turn.a.picture')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Flex spaced centerV>
					<div>{t('image.index')}:</div>
					<DynamicValueSelector value={index} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
				</Flex>
				<Form>
					<Label>
						<Checkbox isChecked={isSet} onChange={setIsSet}>
							{t('set')}
						</Checkbox>
					</Label>
					<Value>
						<Form>
							<Label disabled={!isSet}>
								<Checkbox isChecked={isSetImageID} onChange={setIsSetImageID} disabled={!isSet}>
									{t('image.id')}
								</Checkbox>
							</Label>
							<Value>
								<AssetSelector
									selectionType={ASSET_SELECTOR_TYPE.PICTURES}
									kind={PICTURE_KIND.PICTURES}
									selectedDynamic={imageID}
									active
									disabled={!isSet || !isSetImageID}
								/>
							</Value>
							<Label disabled={!isSet}>
								<Checkbox isChecked={isSetZoom} onChange={setIsSetZoom} disabled={!isSet}>
									{t('zoom')}
								</Checkbox>
							</Label>
							<Value disabled={!isSet || !isSetZoom}>
								<Flex spaced centerV>
									<DynamicValueSelector
										value={zoom}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isSet || !isSetZoom}
									/>
									%
								</Flex>
							</Value>
							<Label disabled={!isSet}>
								<Checkbox isChecked={isSetOpacity} onChange={setIsSetOpacity} disabled={!isSet}>
									{t('opacity')}
								</Checkbox>
							</Label>
							<Value disabled={!isSet || !isSetOpacity}>
								<Flex spaced centerV>
									<DynamicValueSelector
										value={opacity}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										disabled={!isSet || !isSetOpacity}
									/>
									%
								</Flex>
							</Value>
						</Form>
					</Value>
					<Label>
						<Checkbox isChecked={isMove} onChange={setIsMove}>
							{t('move')}
						</Checkbox>
					</Label>
					<Value>
						<Form>
							<Label disabled={!isMove}>
								<Checkbox isChecked={isMoveX} onChange={setIsMoveX} disabled={!isMove}>
									X
								</Checkbox>
							</Label>
							<Value disabled={!isMove || !isMoveX}>
								<DynamicValueSelector
									value={moveX}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
									disabled={!isMove || !isMoveX}
								/>
							</Value>
							<Label disabled={!isMove}>
								<Checkbox isChecked={isMoveY} onChange={setIsMoveY} disabled={!isMove}>
									Y
								</Checkbox>
							</Label>
							<Value disabled={!isMove || !isMoveY}>
								<DynamicValueSelector
									value={moveY}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
									disabled={!isMove || !isMoveY}
								/>
							</Value>
						</Form>
					</Value>
					<Label>
						<Checkbox isChecked={isTurn} onChange={setIsTurn}>
							{t('turn')}
						</Checkbox>
					</Label>
					<Value>
						<Form>
							<Label disabled={!isTurn}>
								<Checkbox isChecked={isTurnAngle} onChange={setIsTurnAngle} disabled={!isTurn}>
									{t('turn')}
								</Checkbox>
							</Label>
							<Value disabled={!isTurn || !isTurnAngle}>
								<DynamicValueSelector
									value={turnAngle}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
									disabled={!isTurn || !isTurnAngle}
								/>
							</Value>
						</Form>
					</Value>
				</Form>
				<PanelWaitTime ref={panelWaitTimeRef} />
			</Flex>
		</Dialog>
	);
}

export default DialogCommandSetMoveTurnAPicture;
