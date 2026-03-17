/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, MONSTER_ACTION_KIND } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import VariableSelector from '../../VariableSelector';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogMonsterAction({ setIsOpen, model, onAccept, onReject }: Props) {
	const monsterAction = model as Model.MonsterAction;

	const { t } = useTranslation();

	const [actionKind, setActionKind] = useStateNumber();
	const [skillID] = useStateDynamicValue();
	const [itemID] = useStateDynamicValue();
	const [itemNumberMax] = useStateDynamicValue();
	const [priority] = useStateDynamicValue();
	const [probability, setProbability] = useStateString();
	const [targetKind, setTargetKind] = useStateNumber();
	const [isConditionTurn, setIsConditionTurn] = useStateBool();
	const [operationKindTurn, setOperationKindTurn] = useStateNumber();
	const [turnValueCompare] = useStateDynamicValue();
	const [isConditionStatistic, setIsConditionStatistic] = useStateBool();
	const [statisticID] = useStateDynamicValue();
	const [operationKindStatistic, setOperationKindStatistic] = useStateNumber();
	const [statisticValueCompare] = useStateDynamicValue();
	const [isConditionVariable, setIsConditionVariable] = useStateBool();
	const [variableID, setVariableID] = useStateNumber();
	const [forcedVariableID, setForcedVariableID] = useState<number | null>(null);
	const [operationKindVariable, setOperationKindVariable] = useStateNumber();
	const [variableValueCompare] = useStateDynamicValue();
	const [isConditionStatus, setIsConditionStatus] = useStateBool();
	const [statusID] = useStateDynamicValue();
	const [isConditionScript, setIsConditionScript] = useStateBool();
	const [script] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		setActionKind(monsterAction.actionKind);
		updateDefault();
		switch (monsterAction.actionKind) {
			case MONSTER_ACTION_KIND.USE_SKILL: {
				skillID.copy(monsterAction.skillID);
				break;
			}
			case MONSTER_ACTION_KIND.USE_ITEM: {
				itemID.copy(monsterAction.itemID);
				itemNumberMax.copy(monsterAction.itemNumberMax);
				break;
			}
		}
		priority.copy(monsterAction.priority);
		updateProbability();
		setTargetKind(monsterAction.targetKind);
		setIsConditionTurn(monsterAction.isConditionTurn);
		setOperationKindTurn(monsterAction.operationKindTurn);
		turnValueCompare.copy(monsterAction.turnValueCompare);
		setIsConditionStatistic(monsterAction.isConditionStatistic);
		statisticID.copy(monsterAction.statisticID);
		setOperationKindStatistic(monsterAction.operationKindStatistic);
		statisticValueCompare.copy(monsterAction.statisticValueCompare);
		setIsConditionVariable(monsterAction.isConditionVariable);
		setVariableID(monsterAction.variableID);
		setForcedVariableID(monsterAction.variableID);
		setOperationKindVariable(monsterAction.operationKindVariable);
		variableValueCompare.copy(monsterAction.variableValueCompare);
		setIsConditionStatus(monsterAction.isConditionStatus);
		statusID.copy(monsterAction.statusID);
		setIsConditionScript(monsterAction.isConditionScript);
		script.copy(monsterAction.script);
		setTrigger((v) => !v);
	};

	const updateDefault = () => {
		skillID.updateToDefaultDatabase();
		itemID.updateToDefaultDatabase();
		itemNumberMax.updateToDefaultNumber(1);
	};

	const updateProbability = () => {
		setProbability(monsterAction.getProbability(priority.getFixNumberValue()));
	};

	const handleAccept = async () => {
		monsterAction.applyDefault();
		monsterAction.actionKind = actionKind;
		switch (actionKind) {
			case MONSTER_ACTION_KIND.USE_SKILL: {
				monsterAction.skillID.copy(skillID);
				break;
			}
			case MONSTER_ACTION_KIND.USE_ITEM: {
				monsterAction.itemID.copy(itemID);
				monsterAction.itemNumberMax.copy(itemNumberMax);
				break;
			}
		}
		monsterAction.priority.copy(priority);
		monsterAction.targetKind = targetKind;
		monsterAction.isConditionTurn = isConditionTurn;
		monsterAction.isConditionStatistic = isConditionStatistic;
		monsterAction.isConditionVariable = isConditionVariable;
		monsterAction.isConditionStatus = isConditionStatus;
		monsterAction.isConditionScript = isConditionScript;
		if (isConditionTurn) {
			monsterAction.operationKindTurn = operationKindTurn;
			monsterAction.turnValueCompare.copy(turnValueCompare);
		}
		if (isConditionStatistic) {
			monsterAction.statisticID.copy(statisticID);
			monsterAction.operationKindStatistic = operationKindStatistic;
			monsterAction.statisticValueCompare.copy(statisticValueCompare);
		}
		if (isConditionVariable) {
			monsterAction.variableID = variableID;
			monsterAction.operationKindVariable = operationKindVariable;
			monsterAction.variableValueCompare.copy(variableValueCompare);
		}
		if (isConditionStatus) {
			monsterAction.statusID.copy(statusID);
		}
		if (isConditionScript) {
			monsterAction.script.copy(script);
		}
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('action')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge fillWidth fillHeight>
				<Flex spacedLarge>
					<Flex one>
						<Groupbox title={t('action')} fillWidth>
							<RadioGroup selected={actionKind} onChange={setActionKind}>
								<Form>
									<Label>
										<RadioButton value={MONSTER_ACTION_KIND.USE_SKILL}>
											{t('use.skill.id')}
										</RadioButton>
									</Label>
									<Value>
										<DynamicValueSelector
											value={skillID}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
											databaseOptions={Project.current!.skills.list}
											disabled={actionKind !== MONSTER_ACTION_KIND.USE_SKILL}
										/>
									</Value>
									<Label>
										<RadioButton value={MONSTER_ACTION_KIND.USE_ITEM}>
											{t('use.item.id')}
										</RadioButton>
									</Label>
									<Value>
										<DynamicValueSelector
											value={itemID}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
											databaseOptions={Project.current!.items.list}
											disabled={actionKind !== MONSTER_ACTION_KIND.USE_ITEM}
										/>
									</Value>
									<Label>
										<Flex spaced centerV>
											<Flex fillSmallSpace />
											{t('number.max')}
										</Flex>
									</Label>
									<Value>
										<DynamicValueSelector
											value={itemNumberMax}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
											disabled={actionKind !== MONSTER_ACTION_KIND.USE_ITEM}
										/>
									</Value>
									<Label>
										<RadioButton value={MONSTER_ACTION_KIND.DO_NOTHING}>
											{t('do.nothing')}
										</RadioButton>
									</Label>
									<Value />
								</Form>
							</RadioGroup>
						</Groupbox>
					</Flex>
					<Flex one column>
						<Form>
							<Label>{t('priority')}</Label>
							<Value>
								<DynamicValueSelector
									value={priority}
									onChangeKind={updateProbability}
									onChangeValue={updateProbability}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
								/>
							</Value>
							<Label>{t('probability')}</Label>
							<Value>{probability}</Value>
							<Label>{t('target')}</Label>
							<Value>
								<Dropdown
									selectedID={targetKind}
									onChange={setTargetKind}
									options={Model.Base.MONSTER_ACTION_TARGET_OPTIONS}
									translateOptions
								/>
							</Value>
						</Form>
						<Flex one />
					</Flex>
				</Flex>
				<Groupbox title={t('conditions')}>
					<Flex column spacedLarge>
						<Flex spaced centerV>
							<Checkbox isChecked={isConditionTurn} onChange={setIsConditionTurn}>
								{t('turn.value.is')}
							</Checkbox>
							<Dropdown
								selectedID={operationKindTurn}
								onChange={setOperationKindTurn}
								options={Model.Base.getCompareOptions()}
								disabled={!isConditionTurn}
							/>
							<DynamicValueSelector
								value={turnValueCompare}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
								disabled={!isConditionTurn}
							/>
						</Flex>
						<Flex spaced centerV>
							<Checkbox isChecked={isConditionStatistic} onChange={setIsConditionStatistic}>
								{t('statistic.id')}
							</Checkbox>
							<DynamicValueSelector
								value={statisticID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.battleSystem.statistics}
								disabled={!isConditionStatistic}
							/>
							<Flex whiteSpaceNowrap disabledLabel={!isConditionStatistic}>
								{t('value.is').toLowerCase()}
							</Flex>
							<Dropdown
								selectedID={operationKindStatistic}
								onChange={setOperationKindStatistic}
								options={Model.Base.getCompareOptions()}
								disabled={!isConditionStatistic}
							/>
							<DynamicValueSelector
								value={statisticValueCompare}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
								disabled={!isConditionStatistic}
							/>
							<Flex disabledLabel={!isConditionStatistic}>%</Flex>
						</Flex>
						<Flex spaced centerV>
							<Checkbox isChecked={isConditionVariable} onChange={setIsConditionVariable}>
								{t('variable')}
							</Checkbox>
							<VariableSelector
								variableID={variableID}
								onChange={setVariableID}
								forcedVariableID={forcedVariableID}
								setForcedVariableID={setForcedVariableID}
								disabled={!isConditionVariable}
							/>
							<Flex whiteSpaceNowrap disabledLabel={!isConditionVariable}>
								{t('value.is').toLowerCase()}
							</Flex>
							<Dropdown
								selectedID={operationKindVariable}
								onChange={setOperationKindVariable}
								options={Model.Base.getCompareOptions()}
								disabled={!isConditionVariable}
							/>
							<DynamicValueSelector
								value={variableValueCompare}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
								disabled={!isConditionVariable}
							/>
						</Flex>
						<Flex spaced centerV>
							<Checkbox isChecked={isConditionStatus} onChange={setIsConditionStatus}>
								{t('is.under.effect.of.status.id')}
							</Checkbox>
							<DynamicValueSelector
								value={statusID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.status.list}
								disabled={!isConditionStatus}
							/>
						</Flex>
						<Flex spaced centerV>
							<Checkbox isChecked={isConditionScript} onChange={setIsConditionScript}>
								{t('script')}
							</Checkbox>
							<DynamicValueSelector
								value={script}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
								disabled={!isConditionScript}
							/>
						</Flex>
					</Flex>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogMonsterAction;
