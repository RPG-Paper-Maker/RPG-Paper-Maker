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
import { DYNAMIC_VALUE_OPTIONS_TYPE, EVENT_COMMAND_KIND, PICTURE_KIND, Utils } from '../../../common';
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
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

function DialogCommandDisplayAPicture({ isOpen, setIsOpen, list, onAccept, onReject }: Props) {
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
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
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
		onAccept(Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.DISPLAY_A_PICTURE, newList));
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
			title={`${t('display.a.picture')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Flex spaced centerV>
					<div className='whiteSpaceNowrap'>{t('image.id')}:</div>
					<AssetSelector
						selectionType={ASSET_SELECTOR_TYPE.PICTURES}
						kind={PICTURE_KIND.PICTURES}
						selectedDynamic={imageID}
						active
					/>
					<div>{t('index')}:</div>
					<DynamicValueSelector value={index} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
				</Flex>
				<Flex spaced>
					<div>{t('origin')}:</div>
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
							<DynamicValueSelector value={x} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />
						</Value>
						<Label>Y</Label>
						<Value>
							<DynamicValueSelector value={y} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL} />
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
						<Checkbox isChecked={isStretch} onChange={setIsStretch}>
							{t('stretch')}
						</Checkbox>
					</Flex>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandDisplayAPicture;
