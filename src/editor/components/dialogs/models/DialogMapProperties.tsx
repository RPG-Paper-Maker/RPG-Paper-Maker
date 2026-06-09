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
import { useDispatch } from 'react-redux';
import { Model, Scene } from '../../../Editor';
import { DYNAMIC_VALUE_OPTIONS_TYPE, PICTURE_KIND, SONG_KIND, Utils } from '../../../common';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { RandomBattle, SELECTION_SKY_TYPE } from '../../../models';
import { setNeedsReloadMap } from '../../../store';
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
import SliderDynamic from '../../SliderDynamic';
import Tab from '../../Tab';
import Tree from '../../Tree';
import PanelMapObject, { PanelMapObjectRef } from '../../panels/PanelMapObject';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Map;
	onAccept: (previousModel: Model.Map, increaseLeft: number, increaseTop: number) => Promise<void>;
	onReject?: () => void | Promise<void>;
	onNameChange?: (name: string) => void;
	isNew?: boolean;
};

function DialogMapProperties({ setIsOpen, model, onAccept, onReject, onNameChange, isNew = false }: Props) {
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
	const [increaseLeft, setIncreaseLeft] = useStateNumber();
	const [increaseTop, setIncreaseTop] = useStateNumber();
	const [cameraPropertiesID] = useStateDynamicValue();
	const [isSunlight, setIsSunlight] = useStateBool();
	const [isFog, setIsFog] = useStateBool();
	const [fogColorID] = useStateDynamicValue();
	const [fogIntensity] = useStateDynamicValue();
	const [screenToneRed] = useStateDynamicValue();
	const [screenToneGreen] = useStateDynamicValue();
	const [screenToneBlue] = useStateDynamicValue();
	const [screenToneGrey] = useStateDynamicValue();
	const [skySelection, setSkySelection] = useStateNumber();
	const [skyColorID] = useStateDynamicValue();
	const [skyImageID, setSkyImageID] = useStateNumber();
	const [skyboxID] = useStateDynamicValue();
	const [startupObject] = useState(new Model.CommonObject());
	const [randomBattleMapID] = useStateDynamicValue();
	const [randomBattles, setRandomBattles] = useState<Node[]>([]);
	const [randomBattleNumberStep] = useStateDynamicValue();
	const [randomBattleVariance] = useStateDynamicValue();

	const dispatch = useDispatch();
	const previewedRef = useRef(false);
	const readyRef = useRef(false);
	const previewBoxRafRef = useRef<number | null>(null);
	const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const getPreviewScene = (): Scene.Map | null => {
		const current = Scene.Map.current;
		return current && current.id === model.id ? current : null;
	};

	const previewCamera = () => {
		const scene = getPreviewScene();
		if (!scene || !readyRef.current) {
			return;
		}
		previewedRef.current = true;
		scene.applyCameraProperty(cameraPropertiesID.getFixNumberValue());
	};

	const previewSunlight = (value: boolean) => {
		const scene = getPreviewScene();
		if (!scene || !readyRef.current) {
			return;
		}
		previewedRef.current = true;
		scene.model.isSunlight = value;
		scene.initializeSunLight();
	};

	const previewFog = (enabled?: boolean) => {
		const scene = getPreviewScene();
		if (!scene || !readyRef.current) {
			return;
		}
		previewedRef.current = true;
		if (enabled !== undefined) {
			scene.model.isFog = enabled;
		}
		scene.model.fogColorID.copy(fogColorID);
		scene.model.fogIntensity.copy(fogIntensity);
		scene.updateFog();
	};

	const previewScreenTone = () => {
		const scene = getPreviewScene();
		if (!scene || !readyRef.current) {
			return;
		}
		previewedRef.current = true;
		scene.model.screenToneRed.copy(screenToneRed);
		scene.model.screenToneGreen.copy(screenToneGreen);
		scene.model.screenToneBlue.copy(screenToneBlue);
		scene.model.screenToneGrey.copy(screenToneGrey);
		scene.updateScreenTone();
	};

	const previewTileset = (value: number) => {
		const scene = getPreviewScene();
		if (!scene || !readyRef.current) {
			return;
		}
		previewedRef.current = true;
		scene.model.tilesetID = value;
		void scene.reloadTextures(PICTURE_KIND.TILESETS);
	};

	const previewSky = (selection: number, imageID: number) => {
		const scene = getPreviewScene();
		if (!scene || !readyRef.current) {
			return;
		}
		previewedRef.current = true;
		scene.model.isSkyColor = selection === SELECTION_SKY_TYPE.COLOR;
		scene.model.isSkyImage = selection === SELECTION_SKY_TYPE.IMAGE;
		scene.model.skyColorID.copy(skyColorID);
		scene.model.skyImageID = imageID;
		scene.model.skyboxID.copy(skyboxID);
		void scene.updateBackground();
	};

	const applyPreviewSize = (
		lengthValue: number,
		widthValue: number,
		heightValue: number,
		depthValue: number,
		leftValue: number,
		topValue: number,
	) => {
		const scene = getPreviewScene();
		if (!scene || !readyRef.current) {
			return;
		}
		previewedRef.current = true;
		scene.previewShiftX = leftValue;
		scene.previewShiftZ = topValue;
		scene.model.length = lengthValue + leftValue;
		scene.model.width = widthValue + topValue;
		scene.model.height = heightValue;
		scene.model.depth = depthValue;
		scene.previewSize();
	};

	const initialize = () => {
		setFocustFirst(true);
		setLocalization(model);
		setID(model.id);
		setTilesetID(model.tilesetID);
		setLength(model.length);
		setWidth(model.width);
		setHeight(model.height);
		setDepth(model.depth);
		setIncreaseLeft(0);
		setIncreaseTop(0);
		playMusicSelectorRef.current?.initialize(model.music);
		playBackgroundSoundSelectorRef.current?.initialize(model.backgroundSound);
		cameraPropertiesID.copy(model.cameraPropertiesID);
		setIsSunlight(model.isSunlight);
		setIsFog(model.isFog);
		fogColorID.copy(model.fogColorID);
		fogIntensity.copy(model.fogIntensity);
		screenToneRed.copy(model.screenToneRed);
		screenToneGreen.copy(model.screenToneGreen);
		screenToneBlue.copy(model.screenToneBlue);
		screenToneGrey.copy(model.screenToneGrey);
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
		const showPreviewBoxWhenReady = () => {
			const scene = getPreviewScene();
			if (scene && !scene.loading) {
				scene.showPreviewSizeBox();
				previewBoxRafRef.current = null;
				return;
			}
			previewBoxRafRef.current = requestAnimationFrame(showPreviewBoxWhenReady);
		};
		showPreviewBoxWhenReady();
		readyTimeoutRef.current = setTimeout(() => {
			readyRef.current = true;
		}, 0);
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
		model.isFog = isFog;
		model.fogColorID.copy(fogColorID);
		model.fogIntensity.copy(fogIntensity);
		model.screenToneRed.copy(screenToneRed);
		model.screenToneGreen.copy(screenToneGreen);
		model.screenToneBlue.copy(screenToneBlue);
		model.screenToneGrey.copy(screenToneGrey);
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
		getPreviewScene()?.clearPreviewSize();
		await onAccept(previousModel, increaseLeft, increaseTop);
		setIsLoading(false);
		setIsOpen(false);
	};

	const handleReject = () => {
		getPreviewScene()?.clearPreviewSize();
		if (onReject) {
			void onReject();
		} else if (previewedRef.current) {
			dispatch(setNeedsReloadMap());
		}
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		Scene.Map.previewOnly = true;
		initialize();
		return () => {
			Scene.Map.previewOnly = false;
			if (previewBoxRafRef.current !== null) {
				cancelAnimationFrame(previewBoxRafRef.current);
			}
			if (readyTimeoutRef.current !== null) {
				clearTimeout(readyTimeoutRef.current);
			}
		};
	}, []);

	const getMapSettingsContent = () => (
		<Flex key={0} column spacedLarge>
			<Form>
				<Label>{t('name')}</Label>
				<Value>
					<Flex spacedLarge centerV>
						<InputLocalization
							localization={model}
							focusFirst={focusFirst}
							setFocustFirst={setFocustFirst}
							onUpdate={() => onNameChange?.(model.name)}
						/>
						<div>ID: {Utils.formatNumberID(id)}</div>
					</Flex>
				</Value>
				<Label>{t('tileset')}</Label>
				<Value>
					<Dropdown
						selectedID={tilesetID}
						onChange={(value: number) => {
							setTilesetID(value);
							previewTileset(value);
						}}
						options={Project.current!.tilesets.list}
						displayIDs
					/>
				</Value>
			</Form>
			<Groupbox title={t('size')}>
				<Flex one spacedLarge wrap>
					<Flex column spaced>
						{t('length')}:
						<InputNumber
							value={length}
							onChange={(value: number) => {
								setLength(value);
								applyPreviewSize(value, width, height, depth, increaseLeft, increaseTop);
							}}
							min={1}
						/>
					</Flex>
					<Flex column spaced>
						{t('width')}:
						<InputNumber
							value={width}
							onChange={(value: number) => {
								setWidth(value);
								applyPreviewSize(length, value, height, depth, increaseLeft, increaseTop);
							}}
							min={1}
						/>
					</Flex>
					<Flex column spaced>
						{t('height')}:
						<InputNumber
							value={height}
							onChange={(value: number) => {
								setHeight(value);
								applyPreviewSize(length, width, value, depth, increaseLeft, increaseTop);
							}}
							min={1}
						/>
					</Flex>
					<Flex column spaced>
						{t('depth')}:
						<InputNumber
							value={depth}
							onChange={(value: number) => {
								setDepth(value);
								applyPreviewSize(length, width, height, value, increaseLeft, increaseTop);
							}}
							min={0}
						/>
					</Flex>
				</Flex>
			</Groupbox>
			{!isNew && (
				<Groupbox title={t('increase.left.top.of.map')}>
					<Flex one spacedLarge wrap>
						<Flex column spaced>
							{t('left')}:
							<InputNumber
								value={increaseLeft}
								onChange={(value: number) => {
									setIncreaseLeft(value);
									applyPreviewSize(length, width, height, depth, value, increaseTop);
								}}
							/>
						</Flex>
						<Flex column spaced>
							{t('top')}:
							<InputNumber
								value={increaseTop}
								onChange={(value: number) => {
									setIncreaseTop(value);
									applyPreviewSize(length, width, height, depth, increaseLeft, value);
								}}
							/>
						</Flex>
					</Flex>
				</Groupbox>
			)}
			<Groupbox title={t('music')}>
				<PlaySongSelector songKind={SONG_KIND.MUSIC} ref={playMusicSelectorRef} showKeepCurrent />
			</Groupbox>
			<Groupbox title={t('background.sound')}>
				<PlaySongSelector
					songKind={SONG_KIND.BACKGROUND_SOUND}
					ref={playBackgroundSoundSelectorRef}
					showKeepCurrent
				/>
			</Groupbox>
			<Flex spaced>
				<div>{t('camera.properties.id')}:</div>
				<DynamicValueSelector
					value={cameraPropertiesID}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
					databaseOptions={Project.current!.systems.cameraProperties}
					onChangeKind={previewCamera}
					onChangeValue={previewCamera}
				/>
			</Flex>
			<Checkbox
				isChecked={isSunlight}
				onChange={(value: boolean) => {
					setIsSunlight(value);
					previewSunlight(value);
				}}
			>
				{t('sun.light')}
			</Checkbox>
			<Groupbox title={t('fog')}>
				<Flex column spaced fillWidth>
					<Checkbox
						isChecked={isFog}
						onChange={(value: boolean) => {
							setIsFog(value);
							previewFog(value);
						}}
					>
						{t('enable.fog')}
					</Checkbox>
					<Form>
						<Label>{t('intensity')}</Label>
						<Value>
							<SliderDynamic
								dynamic={fogIntensity}
								min={0}
								max={1}
								step={0.01}
								decimals
								disabled={!isFog}
								onChange={() => previewFog()}
							/>
						</Value>
						<Label>{t('color.id')}</Label>
						<Value>
							<DynamicValueSelector
								value={fogColorID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.systems.colors}
								disabled={!isFog}
								onChangeKind={() => previewFog()}
								onChangeValue={() => previewFog()}
							/>
						</Value>
					</Form>
				</Flex>
			</Groupbox>
			<Groupbox title={t('screen.tone')}>
				<Form>
					<Label>{t('red')}</Label>
					<Value>
						<SliderDynamic
							dynamic={screenToneRed}
							min={Model.Map.SCREEN_TONE_COLOR_MIN}
							max={Model.Map.SCREEN_TONE_COLOR_MAX}
							onChange={previewScreenTone}
						/>
					</Value>
					<Label>{t('green')}</Label>
					<Value>
						<SliderDynamic
							dynamic={screenToneGreen}
							min={Model.Map.SCREEN_TONE_COLOR_MIN}
							max={Model.Map.SCREEN_TONE_COLOR_MAX}
							onChange={previewScreenTone}
						/>
					</Value>
					<Label>{t('blue')}</Label>
					<Value>
						<SliderDynamic
							dynamic={screenToneBlue}
							min={Model.Map.SCREEN_TONE_COLOR_MIN}
							max={Model.Map.SCREEN_TONE_COLOR_MAX}
							onChange={previewScreenTone}
						/>
					</Value>
					<Label>{t('grey')}</Label>
					<Value>
						<SliderDynamic
							dynamic={screenToneGrey}
							min={Model.Map.SCREEN_TONE_GREY_MIN}
							max={Model.Map.SCREEN_TONE_GREY_MAX}
							onChange={previewScreenTone}
						/>
					</Value>
				</Form>
			</Groupbox>
			<Groupbox title={t('sky')}>
				<RadioGroup
					selected={skySelection}
					onChange={(value: number) => {
						setSkySelection(value);
						previewSky(value, skyImageID);
					}}
				>
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
								onChangeKind={() => previewSky(skySelection, skyImageID)}
								onChangeValue={() => previewSky(skySelection, skyImageID)}
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
								onChange={(value: number) => {
									setSkyImageID(value);
									previewSky(skySelection, value);
								}}
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
								onChangeKind={() => previewSky(skySelection, skyImageID)}
								onChangeValue={() => previewSky(skySelection, skyImageID)}
							/>
						</Value>
					</Form>
				</RadioGroup>
			</Groupbox>
		</Flex>
	);

	const getMapStartupReactionsContent = () => (
		<PanelMapObject
			key={1}
			object={startupObject}
			ref={panelMapObjectRef}
			hideNameID
			hideStateValues
			saveOnDestruction
		/>
	);

	const getBattlesContent = () => (
		<Flex key={2} column spacedLarge fillHeight>
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
			initialWidth='600px'
			initialHeight='650px'
			initialPlacement='right'
			allowMapInteraction
		>
			<Flex one fillWidth fillHeight spacedLarge columnMobile>
				<Tab
					titles={[
						Model.Base.create(1, t('settings')),
						Model.Base.create(2, t('map.startup.reactions')),
						Model.Base.create(3, t('battles')),
					]}
					contents={[getMapSettingsContent(), getMapStartupReactionsContent(), getBattlesContent()]}
					padding
					hideScroll
					lazyLoadingContent
				/>
			</Flex>
		</Dialog>
	);
}

export default DialogMapProperties;
