/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CONDITION_HEROES_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, HEROES_MONSTERS_KIND } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { Base } from '../../../models';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	conditions: Model.TroopReactionConditions;
};

function DialogTroopReactionConditions({ isOpen, setIsOpen, conditions }: Props) {
	const { t } = useTranslation();

	const [isNumberOfTurn, setIsNumberOfTurn] = useStateBool();
	const [numberOfTurnPlus] = useStateDynamicValue();
	const [numberOfTurnTimes] = useStateDynamicValue();
	const [isHeroesMonsters, setIsHeroesMonsters] = useStateBool();
	const [heroesMonsters, setHeroesMonsters] = useStateNumber();
	const [conditionHeroesKind, setConditionHeroesKind] = useStateNumber();
	const [heroInstanceID] = useStateDynamicValue();
	const [isStatusID, setIsStatusID] = useStateBool();
	const [statusID] = useStateDynamicValue();
	const [isStatisticID, setIsStatisticID] = useStateBool();
	const [statisticID] = useStateDynamicValue();
	const [statisticOperationKind, setStatisticOperationKind] = useStateNumber();
	const [statisticCompare] = useStateDynamicValue();
	const [statisticCompareUnit, setStatisticCompareUnit] = useStateNumber();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		setIsNumberOfTurn(conditions.isNumberOfTurn);
		numberOfTurnPlus.copy(conditions.numberOfTurnPlus);
		numberOfTurnTimes.copy(conditions.numberOfTurnTimes);
		setIsHeroesMonsters(conditions.isHeroesMonsters);
		setHeroesMonsters(conditions.isHeroes ? HEROES_MONSTERS_KIND.HEROES : HEROES_MONSTERS_KIND.MONSTERS);
		setConditionHeroesKind(conditions.conditionHeroesKind);
		heroInstanceID.copy(conditions.heroInstanceID);
		setIsStatusID(conditions.isStatusID);
		statusID.copy(conditions.statusID);
		setIsStatisticID(conditions.isStatisticID);
		statisticID.copy(conditions.statisticID);
		setStatisticOperationKind(conditions.statisticOperationKind);
		statisticCompare.copy(conditions.statisticCompare);
		setStatisticCompareUnit(conditions.statisticCompareUnit ? 0 : 1);
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		conditions.applyDefault();
		conditions.isNumberOfTurn = isNumberOfTurn;
		if (isNumberOfTurn) {
			conditions.numberOfTurnPlus.copy(numberOfTurnPlus);
			conditions.numberOfTurnTimes.copy(numberOfTurnTimes);
		}
		conditions.isHeroesMonsters = isHeroesMonsters;
		if (isHeroesMonsters) {
			conditions.isHeroes = heroesMonsters === HEROES_MONSTERS_KIND.HEROES;
			conditions.conditionHeroesKind = conditionHeroesKind;
			if (conditions.conditionHeroesKind === CONDITION_HEROES_KIND.THE_HERO_WITH_INSTANCE_ID) {
				conditions.heroInstanceID.copy(heroInstanceID);
			}
			conditions.isStatusID = isStatusID;
			if (isStatusID) {
				conditions.statusID.copy(statusID);
			}
			conditions.isStatisticID = isStatisticID;
			if (isStatisticID) {
				conditions.statisticID.copy(statisticID);
				conditions.statisticOperationKind = statisticOperationKind;
				conditions.statisticCompare.copy(statisticCompare);
				conditions.statisticCompareUnit = statisticCompareUnit === 0;
			}
		}
		setIsOpen(false);
	};

	const handleReject = async () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('set.conditions')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge>
				<Flex spaced centerV>
					<Checkbox isChecked={isNumberOfTurn} onChange={setIsNumberOfTurn}>
						{t('number.of.turns')}
					</Checkbox>
					<DynamicValueSelector
						value={numberOfTurnPlus}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
						disabled={!isNumberOfTurn}
					/>
					<Flex disabledLabel={!isNumberOfTurn}>+</Flex>
					<DynamicValueSelector
						value={numberOfTurnTimes}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
						disabled={!isNumberOfTurn}
					/>
					<Flex disabledLabel={!isNumberOfTurn}>-</Flex>
				</Flex>
				<Flex spaced centerV>
					<Checkbox isChecked={isHeroesMonsters} onChange={setIsHeroesMonsters}>
						{t('the.s')}
					</Checkbox>
					<Dropdown
						selectedID={heroesMonsters}
						onChange={setHeroesMonsters}
						options={Base.HEROES_MONSTERS_OPTIONS}
						disabled={!isHeroesMonsters}
						translateOptions
					/>
					<Dropdown
						selectedID={conditionHeroesKind}
						onChange={setConditionHeroesKind}
						options={Base.CONDITION_HEROES_OPTIONS}
						disabled={!isHeroesMonsters}
						translateOptions
					/>
					{conditionHeroesKind === CONDITION_HEROES_KIND.THE_HERO_WITH_INSTANCE_ID && (
						<DynamicValueSelector
							value={heroInstanceID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							disabled={!isHeroesMonsters}
						/>
					)}
				</Flex>
				<Flex spaced centerV>
					<Flex fillSmallSpace />
					<Checkbox isChecked={isStatusID} onChange={setIsStatusID} disabled={!isHeroesMonsters}>
						{t('are.under.effect.status.id')}
					</Checkbox>
					<DynamicValueSelector
						value={statusID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						disabled={!isHeroesMonsters || !isStatusID}
						databaseOptions={Project.current!.status.list}
					/>
				</Flex>
				<Flex spaced centerV>
					<Flex fillSmallSpace />
					<Checkbox isChecked={isStatisticID} onChange={setIsStatisticID} disabled={!isHeroesMonsters}>
						{t('have.statistic.id')}
					</Checkbox>
					<DynamicValueSelector
						value={statisticID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.battleSystem.statistics}
						disabled={!isHeroesMonsters || !isStatisticID}
					/>
					<Dropdown
						selectedID={statisticOperationKind}
						onChange={setStatisticOperationKind}
						options={Base.getCompareOptions()}
						disabled={!isHeroesMonsters || !isStatisticID}
					/>
				</Flex>
				<Flex spaced centerV>
					<Flex fillSmallSpace />
					<Flex fillSmallSpace />
					<DynamicValueSelector
						value={statisticCompare}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
						disabled={!isHeroesMonsters || !isStatisticID}
					/>
					<Dropdown
						selectedID={statisticCompareUnit}
						onChange={setStatisticCompareUnit}
						options={Base.getUnitOptions()}
						disabled={!isHeroesMonsters || !isStatisticID}
					/>
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogTroopReactionConditions;
