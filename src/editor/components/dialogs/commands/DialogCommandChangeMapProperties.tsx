/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, EVENT_COMMAND_KIND, SONG_KIND, Utils } from '../../../common';
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Checkbox from '../../Checkbox';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

enum SELECTION_SKY_TYPE {
	COLOR,
	SKYBOX,
}

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	list?: MapObjectCommandType[];
	onAccept: (command: Model.MapObjectCommand) => void;
	onReject: () => void;
};

function DialogCommandChangeMapProperties({ isOpen, setIsOpen, list, onAccept, onReject }: Props) {
	const { t } = useTranslation();

	const [mapID] = useStateDynamicValue();
	const [isTilesetID, setIsTilesetID] = useStateBool();
	const [tilesetID] = useStateDynamicValue();
	const [isMusic, setIsMusic] = useStateBool();
	const [music] = useStateDynamicValue();
	const [isBackgroundSound, setIsBackgroundSound] = useStateBool();
	const [backgroundSound] = useStateDynamicValue();
	const [isCameraPropertiesID, setIsCameraPropertiesID] = useStateBool();
	const [cameraPropertiesID] = useStateDynamicValue();
	const [isSky, setIsSky] = useStateBool();
	const [selectionSkyType, setSelectionSkyType] = useStateNumber();
	const [colorID] = useStateDynamicValue();
	const [skyboxID] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		tilesetID.updateToDefaultDatabase();
		music.updateToDefaultNumber(-1);
		backgroundSound.updateToDefaultNumber(-1);
		cameraPropertiesID.updateToDefaultDatabase();
		colorID.updateToDefaultDatabase();
		skyboxID.updateToDefaultDatabase();
		if (list) {
			const iterator = Utils.generateIterator();
			mapID.updateCommand(list, iterator);
			let checked = Utils.initializeBoolCommand(list, iterator);
			setIsTilesetID(checked);
			if (checked) {
				tilesetID.updateCommand(list, iterator);
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsMusic(checked);
			if (checked) {
				music.updateCommand(list, iterator, true);
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsBackgroundSound(checked);
			if (checked) {
				backgroundSound.updateCommand(list, iterator, true);
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsCameraPropertiesID(checked);
			if (checked) {
				cameraPropertiesID.updateCommand(list, iterator);
			}
			checked = Utils.initializeBoolCommand(list, iterator);
			setIsSky(checked);
			if (checked) {
				const kind = list[iterator.i++] as SELECTION_SKY_TYPE;
				setSelectionSkyType(kind);
				switch (kind) {
					case SELECTION_SKY_TYPE.COLOR:
						colorID.updateCommand(list, iterator);
						break;
					case SELECTION_SKY_TYPE.SKYBOX:
						skyboxID.updateCommand(list, iterator);
						break;
				}
			}
		} else {
			mapID.updateToDefaultDatabase(-1);
			setIsTilesetID(false);
			tilesetID.updateToDefaultDatabase();
			setIsMusic(false);
			music.updateToDefaultNumber(-1);
			setIsBackgroundSound(false);
			backgroundSound.updateToDefaultNumber(-1);
			setIsCameraPropertiesID(false);
			cameraPropertiesID.updateToDefaultDatabase();
			setIsSky(false);
			setSelectionSkyType(SELECTION_SKY_TYPE.COLOR);
			colorID.updateToDefaultDatabase();
			skyboxID.updateToDefaultDatabase();
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		mapID.getCommand(newList);
		newList.push(Utils.boolToNum(isTilesetID));
		if (isTilesetID) {
			tilesetID.getCommand(newList);
		}
		newList.push(Utils.boolToNum(isMusic));
		if (isMusic) {
			music.getCommand(newList, true);
		}
		newList.push(Utils.boolToNum(isBackgroundSound));
		if (isBackgroundSound) {
			backgroundSound.getCommand(newList, true);
		}
		newList.push(Utils.boolToNum(isCameraPropertiesID));
		if (isCameraPropertiesID) {
			cameraPropertiesID.getCommand(newList);
		}
		newList.push(Utils.boolToNum(isSky));
		if (isSky) {
			newList.push(selectionSkyType);
			switch (selectionSkyType) {
				case SELECTION_SKY_TYPE.COLOR:
					colorID.getCommand(newList);
					break;
				case SELECTION_SKY_TYPE.SKYBOX:
					skyboxID.getCommand(newList);
					break;
			}
		}
		onAccept(Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.CHANGE_MAP_PROPERTIES, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('change.map.properties')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spaced>
				<Flex spaced centerV>
					<div>{t('map.id')}:</div>
					<DynamicValueSelector
						value={mapID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.treeMaps.getAllMapsList()}
					/>
				</Flex>
				<Groupbox title={t('properties')}>
					<Form>
						<Label>
							<Checkbox isChecked={isTilesetID} onChange={setIsTilesetID}>
								{t('tileset.id')}
							</Checkbox>
						</Label>
						<Value>
							<DynamicValueSelector
								value={tilesetID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.tilesets.list}
								disabled={!isTilesetID}
							/>
						</Value>
						<Label>
							<Checkbox isChecked={isMusic} onChange={setIsMusic}>
								{t('music')}
							</Checkbox>
						</Label>
						<Value>
							<AssetSelector
								selectionType={ASSET_SELECTOR_TYPE.SONGS}
								kind={SONG_KIND.MUSIC}
								selectedDynamic={music}
								disabled={!isMusic}
								active
							/>
						</Value>
						<Label>
							<Checkbox isChecked={isBackgroundSound} onChange={setIsBackgroundSound}>
								{t('background.sound')}
							</Checkbox>
						</Label>
						<Value>
							<AssetSelector
								selectionType={ASSET_SELECTOR_TYPE.SONGS}
								kind={SONG_KIND.BACKGROUND_SOUND}
								selectedDynamic={backgroundSound}
								disabled={!isBackgroundSound}
								active
							/>
						</Value>
						<Label>
							<Checkbox isChecked={isCameraPropertiesID} onChange={setIsCameraPropertiesID}>
								{t('camera.properties.id')}
							</Checkbox>
						</Label>
						<Value>
							<DynamicValueSelector
								value={cameraPropertiesID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.systems.cameraProperties}
								disabled={!isCameraPropertiesID}
							/>
						</Value>
						<Label>
							<Checkbox isChecked={isSky} onChange={setIsSky}>
								{t('sky')}
							</Checkbox>
						</Label>
						<Value>
							<RadioGroup selected={selectionSkyType} onChange={setSelectionSkyType}>
								<Form>
									<Label>
										<RadioButton value={SELECTION_SKY_TYPE.COLOR} disabled={!isSky}>
											{t('color.id')}
										</RadioButton>
									</Label>
									<Value>
										<DynamicValueSelector
											value={colorID}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
											databaseOptions={Project.current!.systems.colors}
											disabled={!isSky || selectionSkyType !== SELECTION_SKY_TYPE.COLOR}
										/>
									</Value>
									<Label>
										<RadioButton value={SELECTION_SKY_TYPE.SKYBOX} disabled={!isSky}>
											{t('skybox.id')}
										</RadioButton>
									</Label>
									<Value>
										<DynamicValueSelector
											value={skyboxID}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
											databaseOptions={Project.current!.systems.skyboxes}
											disabled={!isSky || selectionSkyType !== SELECTION_SKY_TYPE.SKYBOX}
										/>
									</Value>
								</Form>
							</RadioGroup>
						</Value>
					</Form>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeMapProperties;
