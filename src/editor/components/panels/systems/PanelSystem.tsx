/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Model } from '../../../Editor';
import { DYNAMIC_VALUE_OPTIONS_TYPE, EVENT_COMMAND_KIND, SONG_KIND } from '../../../common';
import { Node, Project } from '../../../core';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import Button from '../../Button';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import InputLocalization from '../../InputLocalization';
import InputNumber from '../../InputNumber';
import InputText from '../../InputText';
import PlaySongSelector, { PlaySongSelectorRef } from '../../PlaySongSelector';
import Tree from '../../Tree';
import DialogEnterNameOptions from '../../dialogs/DialogEnterNameOptions';
import DialogCommandSetDialogBoxOptions from '../../dialogs/commands/DialogCommandSetDialogBoxOptions';

const TREES_STYLE_HEIGHT = { height: '200px' };

const PanelSystem = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const playCursorSoundSelectorRef = useRef<PlaySongSelectorRef>();
	const playConfirmationSoundSelectorRef = useRef<PlaySongSelectorRef>();
	const playCancelSoundSelectorRef = useRef<PlaySongSelectorRef>();
	const playImpossibleSoundSelectorRef = useRef<PlaySongSelectorRef>();

	const [focusFirst, setFocustFirst] = useState(false);
	const [isDialogDefaultDialogBoxOptionsOpen, setIsDialogDefaultDialogBoxOptionsOpen] = useState(false);
	const [isDialogEnterNameOptionsOpen, setIsDialogEnterNameOptionOpen] = useState(false);
	const [projectName, setProjectName] = useState(new Model.Localization());
	const [windowWidth, setWindowWidth] = useStateNumber();
	const [windowHeight, setWindowHeight] = useStateNumber();
	const [screenWindow, setScreenWindow] = useStateNumber();
	const [antialias, setAntialias] = useStateBool();
	const [isMouseControls, setIsMouseControls] = useStateBool();
	const [squareSize, setSquareSize] = useStateNumber();
	const [rayPortionsEngine, setRayPortionsEngine] = useStateNumber();
	const [rayPortionsIngame, setRayPortionsIngame] = useStateNumber();
	const [mountainCollisionHeight] = useStateDynamicValue();
	const [mountainCollisionAngle] = useStateDynamicValue();
	const [climbingSpeed] = useStateDynamicValue();
	const [moveCameraOnBlockView] = useStateDynamicValue();
	const [mapFrameDuration] = useStateDynamicValue();
	const [frames, setFrames] = useStateNumber();
	const [battlersFrames, setBattlersFrames] = useStateNumber();
	const [battlersFrameDuration, setBattlersFrameDuration] = useStateString();
	const [battlersFrameAttackingDuration, setBattlersFrameAttackingDuration] = useStateString();
	const [battlersRows, setBattlersRows] = useStateNumber();
	const [autotilesFrames, setAutotilesFrames] = useStateNumber();
	const [autotilesFrameDuration, setAutotilesFrameDuration] = useStateNumber();
	const [dialogBoxbOptions] = useState(new Model.MapObjectCommand());
	const [facesetsSize, setFacesetsSize] = useStateNumber();
	const [facesetScalingWidth, setFacesetScalingWidth] = useStateNumber();
	const [facesetScalingHeight, setFacesetScalingHeight] = useStateNumber();
	const [iconsSize, setIconsSize] = useStateNumber();
	const [saveSlots, setSaveSlots] = useStateNumber();
	const [priceSoldItem] = useStateDynamicValue();
	const [enterNameTable, setEnterNameTable] = useState<string[][]>([]);
	const [fontSizes, setFontSizes] = useState<Node[]>([]);
	const [fontNames, setFontNames] = useState<Node[]>([]);
	const [colors, setColors] = useState<Node[]>([]);
	const [windowSkins, setWindowSkins] = useState<Node[]>([]);
	const [currencies, setCurrencies] = useState<Node[]>([]);
	const [speeds, setSpeeds] = useState<Node[]>([]);
	const [detections, setDetections] = useState<Node[]>([]);
	const [cameraProperties, setCameraProperties] = useState<Node[]>([]);
	const [frequencies, setFrequencies] = useState<Node[]>([]);
	const [skyboxes, setSkyboxes] = useState<Node[]>([]);
	const [initialPartyMembers, setInitialPartyMembers] = useState<Node[]>([]);

	const initialize = () => {
		const systems = Project.current!.systems;
		setFocustFirst(true);
		setProjectName(systems.projectName.clone());
		setWindowWidth(systems.windowWidth);
		setWindowHeight(systems.windowHeight);
		setScreenWindow(systems.isScreenWindow ? 0 : 1);
		setAntialias(systems.antialias);
		setIsMouseControls(systems.isMouseControls);
		setSquareSize(systems.SQUARE_SIZE);
		setRayPortionsEngine(systems.PORTIONS_RAY);
		setRayPortionsIngame(systems.portionsRayIngame);
		mountainCollisionHeight.copy(systems.mountainCollisionHeight);
		mountainCollisionAngle.copy(systems.mountainCollisionAngle);
		climbingSpeed.copy(systems.climbingSpeed);
		moveCameraOnBlockView.copy(systems.moveCameraOnBlockView);
		mapFrameDuration.copy(systems.mapFrameDuration);
		setFrames(systems.FRAMES);
		setBattlersFrames(systems.battlersFrames);
		setBattlersFrameDuration(systems.battlersFrameDuration);
		setBattlersFrameAttackingDuration(systems.battlersFrameAttackingDuration);
		setBattlersRows(systems.battlersRows);
		setAutotilesFrames(systems.autotilesFrames);
		setAutotilesFrameDuration(systems.autotilesFrameDuration);
		playCursorSoundSelectorRef.current?.initialize(systems.soundCursor);
		playConfirmationSoundSelectorRef.current?.initialize(systems.soundConfirmation);
		playCancelSoundSelectorRef.current?.initialize(systems.soundCancel);
		playImpossibleSoundSelectorRef.current?.initialize(systems.soundImpossible);
		dialogBoxbOptions.copy(systems.dialogBoxbOptions);
		setFacesetsSize(systems.facesetsSize);
		setFacesetScalingWidth(systems.facesetScalingWidth);
		setFacesetScalingHeight(systems.facesetScalingHeight);
		setIconsSize(systems.iconsSize);
		setSaveSlots(systems.saveSlots);
		priceSoldItem.copy(systems.priceSoldItem);
		setEnterNameTable(systems.enterNameTable);
		setFontSizes(Node.createList(systems.fontSizes));
		setFontNames(Node.createList(systems.fontNames));
		setColors(Node.createList(systems.colors));
		setWindowSkins(Node.createList(systems.windowSkins));
		setCurrencies(Node.createList(systems.currencies));
		setSpeeds(Node.createList(systems.speeds));
		setDetections(Node.createList(systems.detections));
		setCameraProperties(Node.createList(systems.cameraProperties));
		setFrequencies(Node.createList(systems.frequencies));
		setSkyboxes(Node.createList(systems.skyboxes));
		setInitialPartyMembers(Node.createList(systems.initialPartyMembers));
	};

	const handleClickDefaultDialogBoxOptions = () => {
		setIsDialogDefaultDialogBoxOptionsOpen(true);
	};

	const handleAcceptDefaultDialogBoxOptions = (command: Model.MapObjectCommand) => {
		dialogBoxbOptions.copy(command);
	};

	const handleClickEnterNameOptions = () => {
		setIsDialogEnterNameOptionOpen(true);
	};

	const handleAcceptEnterNameOptions = (options: string[][]) => {
		setEnterNameTable(options);
	};

	const accept = () => {
		const systems = Project.current!.systems;
		systems.projectName = projectName.clone();
		systems.windowWidth = windowWidth;
		systems.windowHeight = windowHeight;
		systems.isScreenWindow = screenWindow === 0;
		systems.antialias = antialias;
		systems.isMouseControls = isMouseControls;
		systems.SQUARE_SIZE = squareSize;
		systems.PORTIONS_RAY = rayPortionsEngine;
		systems.portionsRayIngame = rayPortionsIngame;
		systems.mountainCollisionHeight.copy(mountainCollisionHeight);
		systems.mountainCollisionAngle.copy(mountainCollisionAngle);
		systems.climbingSpeed.copy(climbingSpeed);
		systems.moveCameraOnBlockView.copy(moveCameraOnBlockView);
		systems.mapFrameDuration.copy(mapFrameDuration);
		systems.FRAMES = frames;
		systems.battlersFrames = battlersFrames;
		systems.battlersFrameDuration = battlersFrameDuration;
		systems.battlersFrameAttackingDuration = battlersFrameAttackingDuration;
		systems.battlersRows = battlersRows;
		systems.autotilesFrames = autotilesFrames;
		systems.autotilesFrameDuration = autotilesFrameDuration;
		playCursorSoundSelectorRef.current!.accept(systems.soundCursor);
		playConfirmationSoundSelectorRef.current!.accept(systems.soundConfirmation);
		playCancelSoundSelectorRef.current!.accept(systems.soundCancel);
		playImpossibleSoundSelectorRef.current!.accept(systems.soundImpossible);
		systems.dialogBoxbOptions.copy(dialogBoxbOptions);
		systems.facesetsSize = facesetsSize;
		systems.facesetScalingWidth = facesetScalingWidth;
		systems.facesetScalingHeight = facesetScalingHeight;
		systems.iconsSize = iconsSize;
		systems.saveSlots = saveSlots;
		systems.priceSoldItem.copy(priceSoldItem);
		systems.enterNameTable = enterNameTable;
		systems.fontSizes = Node.createListFromNodes(fontSizes);
		systems.fontNames = Node.createListFromNodes(fontNames);
		systems.colors = Node.createListFromNodes(colors);
		systems.windowSkins = Node.createListFromNodes(windowSkins);
		systems.currencies = Node.createListFromNodes(currencies);
		systems.speeds = Node.createListFromNodes(speeds);
		systems.detections = Node.createListFromNodes(detections);
		systems.cameraProperties = Node.createListFromNodes(cameraProperties);
		systems.skyboxes = Node.createListFromNodes(skyboxes);
		systems.initialPartyMembers = Node.createListFromNodes(initialPartyMembers);
	};

	useImperativeHandle(ref, () => ({
		initialize,
		accept,
	}));

	useLayoutEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<Flex spacedLarge>
				<Flex column spacedLarge>
					<Flex column spaced>
						<div>{t('game.name')}:</div>
						<InputLocalization
							localization={projectName}
							focusFirst={focusFirst}
							setFocustFirst={setFocustFirst}
						/>
					</Flex>
					<Groupbox title={t('game.native.resolution')}>
						<Flex column spacedLarge>
							<Flex column spaced>
								<Flex spaced>
									<Flex one>{t('width')}:</Flex>
									<Flex one>{t('height')}:</Flex>
								</Flex>
								<Flex spaced>
									<Flex one>
										<InputNumber value={windowWidth} onChange={setWindowWidth} />
									</Flex>
									<Flex one>
										<InputNumber value={windowHeight} onChange={setWindowHeight} />
									</Flex>
								</Flex>
							</Flex>
							<Dropdown
								selectedID={screenWindow}
								onChange={setScreenWindow}
								options={Model.Base.SCREEN_RESOLUTION_OPTIONS}
								translateOptions
								fillWidth
							/>
							<Checkbox isChecked={antialias} onChange={setAntialias}>
								{t('antialiasing')}
							</Checkbox>
							<Checkbox isChecked={isMouseControls} onChange={setIsMouseControls}>
								{t('mouse.controls')}
							</Checkbox>
						</Flex>
					</Groupbox>
					<Groupbox title={t('map.properties')}>
						<Flex column spacedLarge>
							<Flex column spaced>
								<div>
									{t('square.size')} ({t('in.px')}):
								</div>
								<InputNumber value={squareSize} onChange={setSquareSize} />
							</Flex>
							<Flex column spaced>
								<div>
									{t('ray.portions')} ({t('editor')}):
								</div>
								<InputNumber value={rayPortionsEngine} onChange={setRayPortionsEngine} />
							</Flex>
							<Flex column spaced>
								<div>
									{t('ray.portions')} ({t('ingame')}):
								</div>
								<InputNumber value={rayPortionsIngame} onChange={setRayPortionsIngame} />
							</Flex>
							<Flex column spaced>
								<div>
									{t('mountain.collision.height.limit.1')} {t('mountain.collision.height.limit.2')}:
								</div>
								<DynamicValueSelector
									value={mountainCollisionHeight}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
								/>
							</Flex>
							<Flex column spaced>
								<div>
									{t('mountain.collision.angle.limit.1')} {t('mountain.collision.angle.limit.2')}:
								</div>
								<DynamicValueSelector
									value={mountainCollisionAngle}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
								/>
							</Flex>
							<Flex column spaced>
								<div>{t('climbing.speed')}:</div>
								<DynamicValueSelector
									value={climbingSpeed}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
								/>
							</Flex>
							<Flex column spaced>
								<div>{t('move.camera.on.block.view')}:</div>
								<DynamicValueSelector
									value={moveCameraOnBlockView}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.SWITCH}
								/>
							</Flex>
						</Flex>
					</Groupbox>
					<Groupbox title={t('frames')}>
						<Flex column spacedLarge>
							<Flex column spaced>
								<div>{t('map.frame.duration')}:</div>
								<DynamicValueSelector
									value={mapFrameDuration}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
								/>
							</Flex>
							<Flex column spaced>
								<div>{t('animation.frames')}:</div>
								<InputNumber value={frames} onChange={setFrames} />
							</Flex>
							<Flex column spaced>
								<div>{t('battlers.frames')}:</div>
								<InputNumber value={battlersFrames} onChange={setBattlersFrames} />
							</Flex>
							<Flex column spaced>
								<div>{t('battlers.frame.duration')}:</div>
								<InputText value={battlersFrameDuration} onChange={setBattlersFrameDuration} />
							</Flex>
							<Flex column spaced>
								<div>{t('battlers.frame.attacking.duration')}:</div>
								<InputText
									value={battlersFrameAttackingDuration}
									onChange={setBattlersFrameAttackingDuration}
								/>
							</Flex>
							<Flex column spaced>
								<div>{t('battlers.rows')}:</div>
								<InputNumber value={battlersRows} onChange={setBattlersRows} />
							</Flex>
							<Flex column spaced>
								<div>{t('autotiles.frames')}:</div>
								<InputNumber value={autotilesFrames} onChange={setAutotilesFrames} />
							</Flex>
							<Flex column spaced>
								<div>{t('autotiles.frame.duration')}:</div>
								<InputNumber value={autotilesFrameDuration} onChange={setAutotilesFrameDuration} />
							</Flex>
						</Flex>
					</Groupbox>
					<Groupbox title={t('global.sounds')}>
						<Flex column spacedLarge>
							<Flex column spaced>
								<div>{t('cursor')}:</div>
								<PlaySongSelector songKind={SONG_KIND.SOUND} ref={playCursorSoundSelectorRef} />
							</Flex>
							<Flex column spaced>
								<div>{t('confirmation')}:</div>
								<PlaySongSelector songKind={SONG_KIND.SOUND} ref={playConfirmationSoundSelectorRef} />
							</Flex>
							<Flex column spaced>
								<div>{t('cancel')}:</div>
								<PlaySongSelector songKind={SONG_KIND.SOUND} ref={playCancelSoundSelectorRef} />
							</Flex>
							<Flex column spaced>
								<div>{t('impossible')}:</div>
								<PlaySongSelector songKind={SONG_KIND.SOUND} ref={playImpossibleSoundSelectorRef} />
							</Flex>
						</Flex>
					</Groupbox>
					<Groupbox title={t('other.options')}>
						<Flex column spacedLarge>
							<Flex column spaced>
								<div>{t('default.dialog.box.options')}:</div>
								<Button onClick={handleClickDefaultDialogBoxOptions}>{t('select')}...</Button>
								<DialogCommandSetDialogBoxOptions
									commandKind={EVENT_COMMAND_KIND.SET_DIALOG_BOX_OPTIONS}
									isOpen={isDialogDefaultDialogBoxOptionsOpen}
									setIsOpen={setIsDialogDefaultDialogBoxOptionsOpen}
									list={dialogBoxbOptions.command}
									onAccept={handleAcceptDefaultDialogBoxOptions}
									onReject={() => {}}
								/>
							</Flex>
							<Flex column spaced>
								<div>
									{t('facesets.size')} ({t('in.px')}):
								</div>
								<InputNumber value={facesetsSize} onChange={setFacesetsSize} />
							</Flex>
							<Flex column spaced>
								<div>
									{t('faceset.scaling.width')} ({t('in.px')}):
								</div>
								<InputNumber value={facesetScalingWidth} onChange={setFacesetScalingWidth} />
							</Flex>
							<Flex column spaced>
								<div>
									{t('faceset.scaling.height')} ({t('in.px')}):
								</div>
								<InputNumber value={facesetScalingHeight} onChange={setFacesetScalingHeight} />
							</Flex>
							<Flex column spaced>
								<div>
									{t('icons.size')} ({t('in.px')}):
								</div>
								<InputNumber value={iconsSize} onChange={setIconsSize} />
							</Flex>
							<Flex column spaced>
								<div>{t('max.number.save.slots')}):</div>
								<InputNumber value={saveSlots} onChange={setSaveSlots} />
							</Flex>
							<Flex column spaced>
								<div>
									{t('price.sold.item')} ({t('of.default.price')}):
								</div>
								<DynamicValueSelector
									value={priceSoldItem}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER_DECIMAL}
								/>
							</Flex>
							<Button onClick={handleClickEnterNameOptions}>{t('enter.name.options')}...</Button>
						</Flex>
					</Groupbox>
				</Flex>
				<Flex column spaced fillWidth>
					<Flex spaced>
						<Flex one>
							<Groupbox title={t('font.sizes')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree constructorType={Model.FontSize} list={fontSizes} noScrollOnForce />
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('font.names')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree constructorType={Model.FontName} list={fontNames} noScrollOnForce />
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('colors')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree constructorType={Model.Color} list={colors} noScrollOnForce />
								</Flex>
							</Groupbox>
						</Flex>
					</Flex>
					<Flex spaced>
						<Flex one>
							<Groupbox title={t('window.skins')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree constructorType={Model.WindowSkin} list={windowSkins} noScrollOnForce />
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('currencies')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree constructorType={Model.Currency} list={currencies} noScrollOnForce />
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('speeds')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree constructorType={Model.Speed} list={speeds} noScrollOnForce />
								</Flex>
							</Groupbox>
						</Flex>
					</Flex>
					<Flex spaced>
						<Flex one>
							<Groupbox title={t('detections')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree constructorType={Model.Detection} list={detections} noScrollOnForce />
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('camera.properties')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree
										constructorType={Model.CameraProperty}
										list={cameraProperties}
										noScrollOnForce
									/>
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('frequencies')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree constructorType={Model.Frequency} list={frequencies} noScrollOnForce />
								</Flex>
							</Groupbox>
						</Flex>
					</Flex>
					<Flex spaced>
						<Flex one>
							<Groupbox title={t('skyboxes')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree constructorType={Model.Skybox} list={skyboxes} noScrollOnForce />
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('initial.party.members')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree
										constructorType={Model.InitialPartyMember}
										list={initialPartyMembers}
										noScrollOnForce
									/>
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one />
					</Flex>
				</Flex>
			</Flex>
			<DialogEnterNameOptions
				isOpen={isDialogEnterNameOptionsOpen}
				setIsOpen={setIsDialogEnterNameOptionOpen}
				options={enterNameTable}
				onAccept={handleAcceptEnterNameOptions}
			/>
		</>
	);
});

export default PanelSystem;
