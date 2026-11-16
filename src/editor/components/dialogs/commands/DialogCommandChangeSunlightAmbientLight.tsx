/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, ITERATOR, Utils } from '../../../common';
import { DynamicValue } from '../../../core/DynamicValue';
import { Model } from '../../../Editor';
import useLivePreview from '../../../hooks/useLivePreview';
import useStateBool from '../../../hooks/useStateBool';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import ColorPicker, { Color } from '../../ColorPicker';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import PanelWaitTime, { PanelWaitTimeRef } from '../../panels/PanelWaitTime';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import ToggleButton from '../../ToggleButton';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

enum LIGHT_MODE {
	DEFAULT,
	SELECTION,
}

type LightChange = {
	enabled: boolean;
	mode: LIGHT_MODE;
	color: DynamicValue;
	intensity: DynamicValue;
	defaultIntensity: number;
};

const createLightChange = (defaultIntensity: number): LightChange => ({
	enabled: true,
	mode: LIGHT_MODE.SELECTION,
	color: DynamicValue.create(DYNAMIC_VALUE_KIND.TEXT, '#ffffff'),
	intensity: DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER_DECIMAL, defaultIntensity),
	defaultIntensity,
});

const resetLightChange = (change: LightChange) => {
	change.enabled = true;
	change.mode = LIGHT_MODE.SELECTION;
	change.color.updateToDefaultText('#ffffff');
	change.intensity.updateToDefaultNumber(change.defaultIntensity, true);
};

const readLightChange = (change: LightChange, list: MapObjectCommandType[], iterator: ITERATOR) => {
	resetLightChange(change);
	change.enabled = Utils.initializeBoolCommand(list, iterator);
	if (change.enabled) {
		change.mode = list[iterator.i++] as LIGHT_MODE;
		change.color.updateCommand(list, iterator);
		change.intensity.updateCommand(list, iterator);
	}
};

const writeLightChange = (change: LightChange, list: MapObjectCommandType[]) => {
	list.push(Utils.boolToNum(change.enabled));
	if (change.enabled) {
		list.push(change.mode);
		change.color.getCommand(list);
		change.intensity.getCommand(list);
	}
};

const copyLightChange = (from: LightChange, to: LightChange) => {
	to.mode = from.mode;
	to.color.copy(from.color);
	to.intensity.copy(from.intensity);
};

function PanelLightChange({ title, change, onChange }: { title: string; change: LightChange; onChange: () => void }) {
	const { t } = useTranslation();

	const colorValue = change.color.kind === DYNAMIC_VALUE_KIND.TEXT ? (change.color.value as string) : '#ffffff';
	const [pickerColor, setPickerColor] = useState(() => new Color(colorValue));

	const isSelection = change.enabled && change.mode === LIGHT_MODE.SELECTION;

	useEffect(() => {
		setPickerColor((current) =>
			current.toHexString().slice(0, 7).toLowerCase() === colorValue.toLowerCase()
				? current
				: new Color(colorValue),
		);
	}, [colorValue]);

	return (
		<Groupbox
			title={
				<Checkbox
					isChecked={change.enabled}
					onChange={(value) => {
						change.enabled = value;
						onChange();
					}}
				>
					{title}
				</Checkbox>
			}
		>
			<RadioGroup
				selected={change.mode}
				onChange={(value) => {
					change.mode = value;
					onChange();
				}}
			>
				<Flex column spaced>
					<RadioButton value={LIGHT_MODE.DEFAULT} disabled={!change.enabled}>
						{t('default.map.properties.values')}
					</RadioButton>
					<RadioButton value={LIGHT_MODE.SELECTION} disabled={!change.enabled}>
						{t('selection')}:
					</RadioButton>
					<Flex columnMobile spacedLarge>
						<ColorPicker
							value={pickerColor}
							disabledAlpha
							disabled={!isSelection || change.color.kind !== DYNAMIC_VALUE_KIND.TEXT}
							onChange={(value) => {
								setPickerColor(value);
								change.color.updateToDefaultText(value.toHexString().slice(0, 7));
								onChange();
							}}
						/>
						<Flex column one>
							<Form>
								<Label disabled={!isSelection}>{t('color')}</Label>
								<Value>
									<DynamicValueSelector
										value={change.color}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.TEXT}
										disabled={!isSelection}
										onChangeKind={onChange}
										onChangeValue={onChange}
									/>
								</Value>
								<Label disabled={!isSelection}>{t('intensity')}</Label>
								<Value>
									<DynamicValueSelector
										value={change.intensity}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
										min={0}
										disabled={!isSelection}
										onChangeKind={onChange}
										onChangeValue={onChange}
									/>
								</Value>
							</Form>
							<Flex one />
						</Flex>
					</Flex>
				</Flex>
			</RadioGroup>
		</Groupbox>
	);
}

function DialogCommandChangeSunlightAmbientLight({
	commandKind,
	setIsOpen,
	list,
	onAccept,
	onReject,
	onLivePreview,
}: CommandProps) {
	const { t } = useTranslation();

	const panelWaitTimeRef = useRef<PanelWaitTimeRef>(null);

	const [sun] = useState(() => createLightChange(2));
	const [ambient] = useState(() => createLightChange(Math.PI - 14 / 9));
	const [isKeepOtherMaps, setIsKeepOtherMaps] = useStateBool();
	const [isSyncBoth, setIsSyncBoth] = useStateBool();
	const [, setTrigger] = useStateBool();

	const refresh = () => setTrigger((v) => !v);

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			readLightChange(sun, list, iterator);
			readLightChange(ambient, list, iterator);
			setIsKeepOtherMaps(Utils.initializeBoolCommand(list, iterator));
			setIsSyncBoth(Utils.initializeBoolCommand(list, iterator));
			panelWaitTimeRef.current?.initialize(list, iterator);
		} else {
			resetLightChange(sun);
			resetLightChange(ambient);
			setIsKeepOtherMaps(true);
			setIsSyncBoth(true);
			panelWaitTimeRef.current?.initialize();
		}
		refresh();
	};

	const buildCommand = () => {
		const newList: MapObjectCommandType[] = [];
		writeLightChange(sun, newList);
		writeLightChange(ambient, newList);
		newList.push(Utils.boolToNum(isKeepOtherMaps));
		newList.push(Utils.boolToNum(isSyncBoth));
		panelWaitTimeRef.current?.getCommand(newList);
		return Model.MapObjectCommand.createCommand(commandKind, newList);
	};

	useLivePreview(onLivePreview, buildCommand);

	const handleChange = (from: LightChange, to: LightChange) => {
		if (isSyncBoth) {
			copyLightChange(from, to);
		}
		refresh();
	};

	const handleChangeSyncBoth = (value: boolean) => {
		setIsSyncBoth(value);
		if (value) {
			copyLightChange(sun, ambient);
			refresh();
		}
	};

	const handleAccept = async () => {
		setIsOpen(false);
		onAccept(buildCommand());
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
			title={`${t('change.sunlight.ambient.light')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			initialWidth='700px'
		>
			<Flex column spaced fillWidth>
				<Flex spaced centerV>
					<Flex one />
					<div>{t('sync.both')}:</div>
					<ToggleButton value={isSyncBoth} onChange={handleChangeSyncBoth} />
				</Flex>
				<Flex column spacedLarge>
					<PanelLightChange title={t('sun.light')} change={sun} onChange={() => handleChange(sun, ambient)} />
					<PanelLightChange
						title={t('ambient.light')}
						change={ambient}
						onChange={() => handleChange(ambient, sun)}
					/>
				</Flex>
				<Checkbox isChecked={isKeepOtherMaps} onChange={setIsKeepOtherMaps}>
					{t('keep.values.other.maps')}
				</Checkbox>
				<PanelWaitTime ref={panelWaitTimeRef} />
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeSunlightAmbientLight;
