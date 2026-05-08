/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Model } from '../../../Editor';
import { DYNAMIC_VALUE_OPTIONS_TYPE, PICTURE_KIND, SONG_KIND, Utils } from '../../../common';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { RandomBattle, SELECTION_SKY_TYPE } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import InputLocalization from '../../InputLocalization';
import InputNumber from '../../InputNumber';
import PlaySongSelector, { PlaySongSelectorRef } from '../../PlaySongSelector';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Tab from '../../Tab';
import Tree from '../../Tree';
import PanelMapObject, { PanelMapObjectRef } from '../../panels/PanelMapObject';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Map;
	onAccept: (previousModel: Model.Map) => Promise<void>;
};

function DialogMapProperties({ setIsOpen, model, onAccept }: Props) {
	const { t } = useTranslation();

	const playMusicSelectorRef = useRef<PlaySongSelectorRef>(null);
	const playBackgroundSoundSelectorRef = useRef<PlaySongSelectorRef>(null);
	const panelMapObjectRef = useRef<PanelMapObjectRef>(null);

	const [focusFirst, setFocustFirst] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [localization, setLocalization] = useState(new Model.Localization());
	const [id, setID] = useStateNumber();
	const [tilesetID, setTilesetID] = useStateNumber();
	const [length, setLength] = useStateNumber();
	const [width, setWidth] = useStateNumber();
	const [height, setHeight] = useStateNumber();
	const [depth, setDepth] = useStateNumber();
	const [cameraPropertiesID] = useStateDynamicValue();
	const [isSunlight, setIsSunlight] = useStateBool();
	const [skySelection, setSkySelection] = useStateNumber();
	const [skyColorID] = useStateDynamicValue();
	const [skyImageID, setSkyImageID] = useStateNumber();
	const [skyboxID] = useStateDynamicValue();
	const [startupObject] = useState(new Model.CommonObject());
	const [randomBattleMapID] = useStateDynamicValue();
	const [randomBattles, setRandomBattles] = useState<Node[]>([]);
	const [randomBattleNumberStep] = useStateDynamicValue();
	const [randomBattleVariance] = useStateDynamicValue();

	const initialize = () => {
		setFocustFirst(true);
		setLocalization(model);
		setID(model.id);
		setTilesetID(model.tilesetID);
		setLength(model.length);
		setWidth(model.width);
		setHeight(model.height);
		setDepth(model.depth);
		playMusicSelectorRef.current?.initialize(model.music);
		playBackgroundSoundSelectorRef.current?.initialize(model.backgroundSound);
		cameraPropertiesID.copy(model.cameraPropertiesID);
		setIsSunlight(model.isSunlight);
		setSkySelection(model.getSkySelection());
		skyColorID.copy(model.skyColorID);
		setSkyImageID(model.skyImageID);
		skyboxID.copy(model.skyboxID);
		startupObject.copy(model.startupObject);
		randomBattleMapID.copy(model.randomBattleMapID);
		randomBattleNumberStep.copy(model.randomBattleNumberStep);
		randomBattleVariance.copy(model.randomBattleVariance);
		const battles = Node.createList(model.randomBattles);
		setRandomBattles(battles);
		RandomBattle.currentList = battles;
	};

	const handleAccept = async () => {
		setIsLoading(true);
		const previousModel = model.clone();
		model.name = localization.name;
		model.names = localization.names;
		model.id = id;
		model.tilesetID = tilesetID;
		model.length = length;
		model.width = width;
		model.height = height;
		model.depth = depth;
		playMusicSelectorRef.current?.accept(model.music);
		playBackgroundSoundSelectorRef.current?.accept(model.backgroundSound);
		model.cameraPropertiesID.copy(cameraPropertiesID);
		model.isSunlight = isSunlight;
		model.isSkyColor = skySelection === SELECTION_SKY_TYPE.COLOR;
		if (model.isSkyColor) {
			model.skyColorID.copy(skyColorID);
		} else {
			model.skyColorID.updateToDefaultDatabase(Project.current!.systems.colors);
		}
		model.isSkyImage = skySelection === SELECTION_SKY_TYPE.IMAGE;
		if (model.isSkyImage) {
			model.skyImageID = skyImageID;
		} else {
			model.skyImageID = -1;
		}
		if (skySelection === SELECTION_SKY_TYPE.SKYBOX) {
			model.skyboxID.copy(skyboxID);
		} else {
			model.skyboxID.updateToDefaultDatabase(Project.current!.systems.skyboxes);
		}
		panelMapObjectRef.current?.accept();
		model.startupObject.copy(startupObject);
		model.randomBattleMapID.copy(randomBattleMapID);
		model.randomBattles = Node.createListFromNodes(randomBattles);
		model.randomBattleNumberStep.copy(randomBattleNumberStep);
		model.randomBattleVariance.copy(randomBattleVariance);
		await onAccept(previousModel);
		setIsLoading(false);
		setIsOpen(false);
	};

	const handleReject = () => {
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	const getMapStartupReactionsContent = () => (
		<PanelMapObject
			key={0}
			object={startupObject}
			ref={panelMapObjectRef}
			hideNameID
			hideStateValues
			saveOnDestruction
		/>
	);

	const getBattlesContent = () => (
		<Flex key={1} column spacedLarge fillHeight>
			<Flex spaced>
				<div>{t('battle.map.id')}:</div>
				<DynamicValueSelector
					value={randomBattleMapID}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
					databaseOptions={Project.current!.battleSystem.battleMaps}
				/>
			</Flex>
			<Flex one fillWidth>
				<Groupbox title={t('random.battles')} fillWidth>
					<Flex column spaced fillHeight>
						<Tree
							constructorType={RandomBattle}
							list={randomBattles}
							canBeEmpty
							cannotUpdateListSize
							byIndex
						/>
						<Form>
							<Label>{t('number.of.steps.after.next.battle')}</Label>
							<Value>
								<DynamicValueSelector
									value={randomBattleNumberStep}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
								/>
							</Value>
							<Label>{`${t('variance')} (%)`}</Label>
							<Value>
								<DynamicValueSelector
									value={randomBattleVariance}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
								/>
							</Value>
						</Form>
					</Flex>
				</Groupbox>
			</Flex>
		</Flex>
	);

	return (
		<Dialog
			title={`${t('edit.map.properties')}...`}
			isOpen
			isLoading={isLoading}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='1100px'
			initialHeight='650px'
		>
			<Flex fillWidth fillHeight spacedLarge columnMobile>
				<Flex column spacedLarge>
					<Form>
						<Label>{t('name')}</Label>
						<Value>
							<Flex spacedLarge centerV>
								<InputLocalization
									localization={model}
									focusFirst={focusFirst}
									setFocustFirst={setFocustFirst}
								/>
								<div>ID: {Utils.formatNumberID(id)}</div>
							</Flex>
						</Value>
						<Label>{t('tileset')}</Label>
						<Value>
							<Dropdown
								selectedID={tilesetID}
								onChange={setTilesetID}
								options={Project.current!.tilesets.list}
								displayIDs
							/>
						</Value>
					</Form>
					<Groupbox title={t('size')}>
						<Flex one spacedLarge>
							<Flex column one spaced>
								{t('length')}:
								<InputNumber value={length} onChange={setLength} min={1} />
								{t('height')}:
								<InputNumber value={height} onChange={setHeight} min={1} />
							</Flex>
							<Flex column one spaced>
								{t('width')}:
								<InputNumber value={width} onChange={setWidth} min={1} />
								{t('depth')}:
								<InputNumber value={depth} onChange={setDepth} min={0} />
							</Flex>
						</Flex>
					</Groupbox>
					<Form>
						<Label>{t('music')}</Label>
						<Value>
							<PlaySongSelector songKind={SONG_KIND.MUSIC} ref={playMusicSelectorRef} showKeepCurrent />
						</Value>
						<Label>{t('background.sound')}</Label>
						<Value>
							<PlaySongSelector
								songKind={SONG_KIND.BACKGROUND_SOUND}
								ref={playBackgroundSoundSelectorRef}
								showKeepCurrent
							/>
						</Value>
						<Label>{t('camera.properties.id')}</Label>
						<Value>
							<DynamicValueSelector
								value={cameraPropertiesID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.systems.cameraProperties}
							/>
						</Value>
					</Form>
					<Checkbox isChecked={isSunlight} onChange={setIsSunlight}>
						{t('sun.light')}
					</Checkbox>
					<Groupbox title={t('sky')}>
						<RadioGroup selected={skySelection} onChange={setSkySelection}>
							<Form>
								<Label>
									<RadioButton value={SELECTION_SKY_TYPE.COLOR}>{t('color.id')}</RadioButton>
								</Label>
								<Value>
									<DynamicValueSelector
										value={skyColorID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.systems.colors}
										disabled={skySelection !== SELECTION_SKY_TYPE.COLOR}
									/>
								</Value>
								<Label>
									<RadioButton value={SELECTION_SKY_TYPE.IMAGE}>{t('picture')}</RadioButton>
								</Label>
								<Value>
									<AssetSelector
										selectionType={ASSET_SELECTOR_TYPE.PICTURES}
										kind={PICTURE_KIND.PICTURES}
										selectedID={skyImageID}
										onChange={setSkyImageID}
										disabled={skySelection !== SELECTION_SKY_TYPE.IMAGE}
									/>
								</Value>
								<Label>
									<RadioButton value={SELECTION_SKY_TYPE.SKYBOX}>{t('skybox.id')}</RadioButton>
								</Label>
								<Value>
									<DynamicValueSelector
										value={skyboxID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.systems.skyboxes}
										disabled={skySelection !== SELECTION_SKY_TYPE.SKYBOX}
									/>
								</Value>
							</Form>
						</RadioGroup>
					</Groupbox>
				</Flex>
				<Flex one fillWidth>
					<Tab
						titles={[Model.Base.create(1, t('map.startup.reactions')), Model.Base.create(2, t('battles'))]}
						contents={[getMapStartupReactionsContent(), getBattlesContent()]}
						padding
						hideScroll
					/>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogMapProperties;
