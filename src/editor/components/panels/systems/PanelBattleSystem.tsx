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
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
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

	const playBattleMusicSelectorRef = useRef<PlaySongSelectorRef>(null);
	const playBattleLevelUpSelectorRef = useRef<PlaySongSelectorRef>(null);
	const playBattleVictorySelectorRef = useRef<PlaySongSelectorRef>(null);

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
	const [elements, setElements] = useState<Node[]>([]);
	const [statistics, setStatistics] = useState<Node[]>([]);
	const [weaponsKind, setWeaponsKind] = useState<Node[]>([]);
	const [armorsKind, setArmorsKind] = useState<Node[]>([]);
	const [equipments, setEquipments] = useState<Node[]>([]);
	const [battleCommands, setBattleCommands] = useState<Node[]>([]);

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
		setElements(Node.createList(battleSystem.elements));
		setStatistics(Node.createList(battleSystem.statistics));
		setWeaponsKind(Node.createList(battleSystem.weaponsKind));
		setArmorsKind(Node.createList(battleSystem.armorsKind));
		setEquipments(Node.createList(battleSystem.equipments));
		setBattleCommands(Node.createList(battleSystem.battleCommands));
	};

	const updateElements = () => {
		Project.current!.battleSystem.elements = Node.createListFromNodes(elements);
	};

	const updateStatistics = () => {
		Project.current!.battleSystem.statistics = Node.createListFromNodes(statistics);
	};

	const updateEquipments = () => {
		Project.current!.battleSystem.equipments = Node.createListFromNodes(equipments);
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
		battleSystem.elements = Node.createListFromNodes(elements);
		battleSystem.statistics = Node.createListFromNodes(statistics);
		battleSystem.weaponsKind = Node.createListFromNodes(weaponsKind);
		battleSystem.armorsKind = Node.createListFromNodes(armorsKind);
		battleSystem.equipments = Node.createListFromNodes(equipments);
		battleSystem.battleCommands = Node.createListFromNodes(battleCommands);
	};

	useImperativeHandle(ref, () => ({
		initialize,
		accept,
	}));

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
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
						<Tree constructorType={Model.BattleMap} list={battleMaps} noScrollOnForce />
					</Flex>
				</Groupbox>
				<Checkbox isChecked={cameraMoveInBattle} onChange={setcameraMoveInBattle}>
					{t('camera.move.in.battle')}
				</Checkbox>
			</Flex>
			<Flex column spaced fillWidth>
				<Flex spaced>
					<Flex one>
						<Groupbox title={t('elements')} fillWidth>
							<Flex one style={TREES_STYLE_HEIGHT}>
								<Tree
									constructorType={Model.Element}
									list={elements}
									onListUpdated={updateElements}
									noScrollOnForce
								/>
							</Flex>
						</Groupbox>
					</Flex>
					<Flex one>
						<Groupbox title={t('common.statistics')} fillWidth>
							<Flex one style={TREES_STYLE_HEIGHT}>
								<Tree
									constructorType={Model.Statistic}
									list={statistics}
									onListUpdated={updateStatistics}
									noScrollOnForce
								/>
							</Flex>
						</Groupbox>
					</Flex>
					<Flex one>
						<Groupbox title={t('weapons.kind')} fillWidth>
							<Flex one style={TREES_STYLE_HEIGHT}>
								<Tree constructorType={Model.WeaponArmorKind} list={weaponsKind} noScrollOnForce />
							</Flex>
						</Groupbox>
					</Flex>
				</Flex>
				<Flex spaced>
					<Flex one>
						<Groupbox title={t('common.battle.commands')} fillWidth>
							<Flex one style={TREES_STYLE_HEIGHT}>
								<Tree constructorType={Model.BattleCommand} list={battleCommands} noScrollOnForce />
							</Flex>
						</Groupbox>
					</Flex>
					<Flex one>
						<Groupbox title={t('common.equipments')} fillWidth>
							<Flex one style={TREES_STYLE_HEIGHT}>
								<Tree
									constructorType={Model.Localization}
									list={equipments}
									onListUpdated={updateEquipments}
									noScrollOnForce
								/>
							</Flex>
						</Groupbox>
					</Flex>
					<Flex one>
						<Groupbox title={t('armors.kind')} fillWidth>
							<Flex one style={TREES_STYLE_HEIGHT}>
								<Tree constructorType={Model.WeaponArmorKind} list={armorsKind} noScrollOnForce />
							</Flex>
						</Groupbox>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
});

PanelBattleSystem.displayName = 'PanelBattleSystem';

export default PanelBattleSystem;
