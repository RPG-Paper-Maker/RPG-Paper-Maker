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
import { DYNAMIC_VALUE_OPTIONS_TYPE, SONG_KIND } from '../../../common';
import { Node, Project } from '../../../core';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import PlaySongSelector, { PlaySongSelectorRef } from '../../PlaySongSelector';
import Tree from '../../Tree';

const TREES_STYLE_HEIGHT = { height: '200px' };

const PanelBattleSystem = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const playBattleMusicSelectorRef = useRef<PlaySongSelectorRef>();
	const playBattleLevelUpSelectorRef = useRef<PlaySongSelectorRef>();
	const playBattleVictorySelectorRef = useRef<PlaySongSelectorRef>();

	const [levelStatisticID, setLevelStatisticID] = useStateNumber();
	const [expStatisticID, setExpStatisticID] = useStateNumber();
	const [formulaIsDead] = useStateDynamicValue();
	const [formulaCrit] = useStateDynamicValue();
	const [heroesBattlersCenterOffset] = useStateDynamicValue();
	const [heroesBattlersOffset] = useStateDynamicValue();
	const [troopsBattlersCenterOffset] = useStateDynamicValue();
	const [troopsBattlersOffset] = useStateDynamicValue();
	const [battleMaps, setBattleMaps] = useState<Node[]>([]);
	const [cameraMoveInBattle, setcameraMoveInBattle] = useStateBool();
	const [forcedCurrentIndex, setForcedCurrentIndex] = useState<number | null>(null);
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
		const battleSystem = Project.current!.battleSystem;
		setLevelStatisticID(battleSystem.levelStatisticID);
		setExpStatisticID(battleSystem.expStatisticID);
		formulaIsDead.copy(battleSystem.formulaIsDead);
		formulaCrit.copy(battleSystem.formulaCrit);
		heroesBattlersCenterOffset.copy(battleSystem.heroesBattlersCenterOffset);
		heroesBattlersOffset.copy(battleSystem.heroesBattlersOffset);
		troopsBattlersCenterOffset.copy(battleSystem.troopsBattlersCenterOffset);
		troopsBattlersOffset.copy(battleSystem.troopsBattlersOffset);
		playBattleMusicSelectorRef.current?.initialize(battleSystem.battleMusic);
		playBattleLevelUpSelectorRef.current?.initialize(battleSystem.battleLevelUp);
		playBattleVictorySelectorRef.current?.initialize(battleSystem.battleVictory);
		setBattleMaps(Node.createList(battleSystem.battleMaps));
		setcameraMoveInBattle(battleSystem.cameraMoveInBattle);
	};

	const accept = () => {
		const battleSystem = Project.current!.battleSystem;
		battleSystem.levelStatisticID = levelStatisticID;
		battleSystem.expStatisticID = expStatisticID;
		battleSystem.formulaIsDead.copy(formulaIsDead);
		battleSystem.formulaCrit.copy(formulaCrit);
		battleSystem.heroesBattlersCenterOffset.copy(heroesBattlersCenterOffset);
		battleSystem.heroesBattlersOffset.copy(heroesBattlersOffset);
		battleSystem.troopsBattlersCenterOffset.copy(troopsBattlersCenterOffset);
		battleSystem.troopsBattlersOffset.copy(troopsBattlersOffset);
		playBattleMusicSelectorRef.current!.accept(battleSystem.battleMusic);
		playBattleLevelUpSelectorRef.current!.accept(battleSystem.battleLevelUp);
		playBattleVictorySelectorRef.current!.accept(battleSystem.battleVictory);
		battleSystem.battleMaps = Node.createListFromNodes(battleMaps);
		battleSystem.cameraMoveInBattle = cameraMoveInBattle;
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
						<div>{t('statistic.associated.level')}:</div>
						<Dropdown
							selectedID={levelStatisticID}
							onChange={setLevelStatisticID}
							options={Project.current!.battleSystem.statistics}
							displayIDs
							fillWidth
						/>
					</Flex>
					<Flex column spaced>
						<div>{t('statistic.associated.exp')}:</div>
						<Dropdown
							selectedID={expStatisticID}
							onChange={setExpStatisticID}
							options={Project.current!.battleSystem.statistics}
							displayIDs
							fillWidth
						/>
					</Flex>
					<Groupbox title={t('formulas')}>
						<Flex column spacedLarge>
							<Flex column spaced>
								<div>{t('is.dead')}:</div>
								<DynamicValueSelector
									value={formulaIsDead}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
								/>
							</Flex>
							<Flex column spaced>
								<div>{t('critical.influence')}:</div>
								<DynamicValueSelector
									value={formulaCrit}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
								/>
							</Flex>
							<Flex column spaced>
								<div>{t('heroes.battlers.center.offset')}:</div>
								<DynamicValueSelector
									value={heroesBattlersCenterOffset}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
								/>
							</Flex>
							<Flex column spaced>
								<div>{t('heroes.battlers.offset')}:</div>
								<DynamicValueSelector
									value={heroesBattlersOffset}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
								/>
							</Flex>
							<Flex column spaced>
								<div>{t('troops.battlers.center.offset')}:</div>
								<DynamicValueSelector
									value={troopsBattlersCenterOffset}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
								/>
							</Flex>
							<Flex column spaced>
								<div>{t('troops.battlers.offset')}:</div>
								<DynamicValueSelector
									value={troopsBattlersOffset}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
								/>
							</Flex>
						</Flex>
					</Groupbox>
					<Groupbox title={t('musics')}>
						<Flex column spacedLarge>
							<Flex column spaced>
								<div>{t('battle')}:</div>
								<PlaySongSelector songKind={SONG_KIND.MUSIC} ref={playBattleMusicSelectorRef} />
							</Flex>
							<Flex column spaced>
								<div>{t('level.up')}:</div>
								<PlaySongSelector songKind={SONG_KIND.MUSIC} ref={playBattleLevelUpSelectorRef} />
							</Flex>
							<Flex column spaced>
								<div>{t('victory')}:</div>
								<PlaySongSelector songKind={SONG_KIND.MUSIC} ref={playBattleVictorySelectorRef} />
							</Flex>
						</Flex>
					</Groupbox>
					<Groupbox title={t('battle.maps')}>
						<Flex one style={TREES_STYLE_HEIGHT}>
							<Tree
								constructorType={Model.BattleMap}
								list={battleMaps}
								forcedCurrentSelectedItemIndex={forcedCurrentIndex}
								setForcedCurrentSelectedItemIndex={setForcedCurrentIndex}
								noScrollOnForce
							/>
						</Flex>
					</Groupbox>
					<Checkbox isChecked={cameraMoveInBattle} onChange={setcameraMoveInBattle}>
						{t('camera.move.in.battle')}
					</Checkbox>
				</Flex>
				<Flex column spaced fillWidth>
					<Flex spaced>
						<Flex one>
							<Groupbox title={t('font.sizes')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree
										constructorType={Model.FontSize}
										list={fontSizes}
										forcedCurrentSelectedItemIndex={forcedCurrentIndex}
										setForcedCurrentSelectedItemIndex={setForcedCurrentIndex}
										noScrollOnForce
									/>
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('font.names')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree
										constructorType={Model.FontName}
										list={fontNames}
										forcedCurrentSelectedItemIndex={forcedCurrentIndex}
										setForcedCurrentSelectedItemIndex={setForcedCurrentIndex}
										noScrollOnForce
									/>
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('colors')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree
										constructorType={Model.Color}
										list={colors}
										forcedCurrentSelectedItemIndex={forcedCurrentIndex}
										setForcedCurrentSelectedItemIndex={setForcedCurrentIndex}
										noScrollOnForce
									/>
								</Flex>
							</Groupbox>
						</Flex>
					</Flex>
					<Flex spaced>
						<Flex one>
							<Groupbox title={t('window.skins')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree
										constructorType={Model.WindowSkin}
										list={windowSkins}
										forcedCurrentSelectedItemIndex={forcedCurrentIndex}
										setForcedCurrentSelectedItemIndex={setForcedCurrentIndex}
										noScrollOnForce
									/>
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('currencies')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree
										constructorType={Model.Currency}
										list={currencies}
										forcedCurrentSelectedItemIndex={forcedCurrentIndex}
										setForcedCurrentSelectedItemIndex={setForcedCurrentIndex}
										noScrollOnForce
									/>
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('speeds')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree
										constructorType={Model.Speed}
										list={speeds}
										forcedCurrentSelectedItemIndex={forcedCurrentIndex}
										setForcedCurrentSelectedItemIndex={setForcedCurrentIndex}
										noScrollOnForce
									/>
								</Flex>
							</Groupbox>
						</Flex>
					</Flex>
					<Flex spaced>
						<Flex one>
							<Groupbox title={t('detections')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree
										constructorType={Model.Detection}
										list={detections}
										forcedCurrentSelectedItemIndex={forcedCurrentIndex}
										setForcedCurrentSelectedItemIndex={setForcedCurrentIndex}
										noScrollOnForce
									/>
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('camera.properties')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree
										constructorType={Model.CameraProperty}
										list={cameraProperties}
										forcedCurrentSelectedItemIndex={forcedCurrentIndex}
										setForcedCurrentSelectedItemIndex={setForcedCurrentIndex}
										noScrollOnForce
									/>
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('frequencies')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree
										constructorType={Model.Frequency}
										list={frequencies}
										forcedCurrentSelectedItemIndex={forcedCurrentIndex}
										setForcedCurrentSelectedItemIndex={setForcedCurrentIndex}
										noScrollOnForce
									/>
								</Flex>
							</Groupbox>
						</Flex>
					</Flex>
					<Flex spaced>
						<Flex one>
							<Groupbox title={t('skyboxes')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree
										constructorType={Model.Skybox}
										list={skyboxes}
										forcedCurrentSelectedItemIndex={forcedCurrentIndex}
										setForcedCurrentSelectedItemIndex={setForcedCurrentIndex}
										noScrollOnForce
									/>
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one>
							<Groupbox title={t('initial.party.members')} fillWidth>
								<Flex one style={TREES_STYLE_HEIGHT}>
									<Tree
										constructorType={Model.InitialPartyMember}
										list={initialPartyMembers}
										forcedCurrentSelectedItemIndex={forcedCurrentIndex}
										setForcedCurrentSelectedItemIndex={setForcedCurrentIndex}
										noScrollOnForce
									/>
								</Flex>
							</Groupbox>
						</Flex>
						<Flex one />
					</Flex>
				</Flex>
			</Flex>
		</>
	);
});

export default PanelBattleSystem;
