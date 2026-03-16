/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DAMAGES_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, EFFECT_KIND, EVENT_COMMAND_KIND } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommand } from '../../../models';
import Button from '../../Button';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import VariableSelector from '../../VariableSelector';
import DialogCommandCallACommonReaction from '../commands/DialogCommandCallACommonReaction';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogEffect({ setIsOpen, model, onAccept, onReject }: Props) {
	const effect = model as Model.Effect;

	const { t } = useTranslation();

	const [kind, setKind] = useStateNumber();
	const [damageKind, setDamageKind] = useStateNumber();
	const [damageStatisticID] = useStateDynamicValue();
	const [damageCurrencyID] = useStateDynamicValue();
	const [damageVariableID, setDamageVariableID] = useStateNumber();
	const [forcedDamageVariableID, setForcedDamageVariableID] = useState<number | null>(null);
	const [damageFormula] = useStateDynamicValue();
	const [isDamagesMinimum, setIsDamagesMinimum] = useStateBool();
	const [damagesMinimumFormula] = useStateDynamicValue();
	const [isDamagesMaximum, setIsDamagesMaximum] = useStateBool();
	const [damagesMaximumFormula] = useStateDynamicValue();
	const [isDamageElement, setIsDamageElement] = useStateBool();
	const [damageElementID] = useStateDynamicValue();
	const [isDamageVariance, setIsDamageVariance] = useStateBool();
	const [damageVarianceFormula] = useStateDynamicValue();
	const [isDamageCritical, setIsDamageCritical] = useStateBool();
	const [damageCriticalFormula] = useStateDynamicValue();
	const [isDamagePrecision, setIsDamagePrecision] = useStateBool();
	const [damagePrecisionFormula] = useStateDynamicValue();
	const [isDamageStockVariableID, setIsDamageStockVariableID] = useStateBool();
	const [damageStockVariableID, setDamageStockVariableID] = useStateNumber();
	const [forcedDamageStockVariableID, setForcedDamageStockVariableID] = useState<number | null>(null);
	const [isDamageDisplayName, setIsDamageDisplayName] = useStateBool();
	const [addRemoveStatus, setAddRemoveStatus] = useStateNumber();
	const [statusID] = useStateDynamicValue();
	const [statusPrecisionFormula] = useStateDynamicValue();
	const [addRemoveSkill, setAddRemoveSkill] = useStateNumber();
	const [addSkillID] = useStateDynamicValue();
	const [performSkillID] = useStateDynamicValue();
	const [commonReaction, setCommonReaction] = useState<MapObjectCommand | null>(null);
	const [isDialogCommonReactionOpen, setIsDialogCommonReactionOpen] = useState(false);
	const [specialActionKind, setSpecialActionKind] = useStateNumber();
	const [scriptFormula] = useStateDynamicValue();
	const [isTemporarilyChangeTarget, setIsTemporarilyChangeTarget] = useStateBool();
	const [temporarilyChangeTargetFormula] = useStateDynamicValue();

	const initialize = () => {
		setKind(effect.kind);
		setDamageKind(effect.damageKind);
		damageStatisticID.copy(effect.damageStatisticID);
		damageCurrencyID.copy(effect.damageCurrencyID);
		setDamageVariableID(effect.damageVariableID);
		setForcedDamageVariableID(effect.damageVariableID);
		damageFormula.copy(effect.damageFormula);
		setIsDamagesMinimum(effect.isDamagesMinimum);
		damagesMinimumFormula.copy(effect.damagesMinimumFormula);
		setIsDamagesMaximum(effect.isDamagesMaximum);
		damagesMaximumFormula.copy(effect.damagesMaximumFormula);
		setIsDamageElement(effect.isDamageElement);
		damageElementID.copy(effect.damageElementID);
		setIsDamageVariance(effect.isDamageVariance);
		damageVarianceFormula.copy(effect.damageVarianceFormula);
		setIsDamageCritical(effect.isDamageCritical);
		damageCriticalFormula.copy(effect.damageCriticalFormula);
		setIsDamagePrecision(effect.isDamagePrecision);
		damagePrecisionFormula.copy(effect.damagePrecisionFormula);
		setIsDamageStockVariableID(effect.isDamageStockVariableID);
		setDamageStockVariableID(effect.damageStockVariableID);
		setForcedDamageStockVariableID(effect.damageStockVariableID);
		setIsDamageDisplayName(effect.isDamageDisplayName);
		setAddRemoveStatus(effect.isAddStatus ? 0 : 1);
		statusID.copy(effect.statusID);
		statusPrecisionFormula.copy(effect.statusPrecisionFormula);
		setAddRemoveSkill(effect.isAddSkill ? 0 : 1);
		addSkillID.copy(effect.addSkillID);
		performSkillID.copy(effect.performSkillID);
		setCommonReaction(effect.commonReaction === null ? null : effect.commonReaction.clone());
		setSpecialActionKind(effect.specialActionKind);
		scriptFormula.copy(effect.scriptFormula);
		setIsTemporarilyChangeTarget(effect.isTemporarilyChangeTarget);
		temporarilyChangeTargetFormula.copy(effect.temporarilyChangeTargetFormula);
	};

	const handleChangeKind = (k: EFFECT_KIND) => {
		setKind(k);
		if (k === EFFECT_KIND.COMMON_REACTION && commonReaction === null) {
			setIsDialogCommonReactionOpen(true);
		}
	};

	const handleClickCommonReaction = () => {
		setIsDialogCommonReactionOpen(true);
	};

	const handleAcceptCommonReaction = (command: MapObjectCommand) => {
		if (commonReaction === null) {
			setCommonReaction(command);
		} else {
			commonReaction.command = command.command;
		}
	};

	const handleRejectCommonReaction = () => {
		if (commonReaction === null) {
			setKind(EFFECT_KIND.DAMAGES);
		}
	};

	const handleAccept = async () => {
		effect.applyDefault();
		effect.kind = kind;
		switch (kind) {
			case EFFECT_KIND.DAMAGES:
				effect.damageKind = damageKind;
				switch (damageKind) {
					case DAMAGES_KIND.STAT:
						effect.damageStatisticID.copy(damageStatisticID);
						break;
					case DAMAGES_KIND.CURRENCY:
						effect.damageCurrencyID.copy(damageCurrencyID);
						break;
					case DAMAGES_KIND.VARIABLE:
						effect.damageVariableID = damageVariableID;
						break;
				}
				effect.damageFormula.copy(damageFormula);
				effect.isDamagesMinimum = isDamagesMinimum;
				if (effect.isDamagesMinimum) {
					effect.damagesMinimumFormula.copy(damagesMinimumFormula);
				}
				effect.isDamagesMaximum = isDamagesMaximum;
				if (effect.isDamagesMaximum) {
					effect.damagesMaximumFormula.copy(damagesMaximumFormula);
				}
				effect.isDamageElement = isDamageElement;
				if (effect.isDamageElement) {
					effect.damageElementID.copy(damageElementID);
				}
				effect.isDamageVariance = isDamageVariance;
				if (effect.isDamageVariance) {
					effect.damageVarianceFormula.copy(damageVarianceFormula);
				}
				effect.isDamageCritical = isDamageCritical;
				if (effect.isDamageCritical) {
					effect.damageCriticalFormula.copy(damageCriticalFormula);
				}
				effect.isDamagePrecision = isDamagePrecision;
				if (effect.isDamagePrecision) {
					effect.damagePrecisionFormula.copy(damagePrecisionFormula);
				}
				effect.isDamageStockVariableID = isDamageStockVariableID;
				if (effect.isDamageStockVariableID) {
					effect.damageStockVariableID = damageStockVariableID;
				}
				effect.isDamageDisplayName = isDamageDisplayName;
				break;
			case EFFECT_KIND.STATUS:
				effect.isAddStatus = addRemoveStatus === 0;
				effect.statusID.copy(statusID);
				effect.statusPrecisionFormula.copy(statusPrecisionFormula);
				break;
			case EFFECT_KIND.ADD_REMOVE_SKILL:
				effect.isAddSkill = addRemoveSkill === 0;
				effect.addSkillID.copy(addSkillID);
				break;
			case EFFECT_KIND.PERFORM_SKILL:
				effect.performSkillID.copy(performSkillID);
				break;
			case EFFECT_KIND.COMMON_REACTION:
				effect.commonReaction = commonReaction;
				break;
			case EFFECT_KIND.SPECIAL_ACTIONS:
				effect.specialActionKind = specialActionKind;
				break;
			case EFFECT_KIND.SCRIPT:
				effect.scriptFormula.copy(scriptFormula);
				break;
		}
		effect.isTemporarilyChangeTarget = isTemporarilyChangeTarget;
		if (effect.isTemporarilyChangeTarget) {
			effect.temporarilyChangeTargetFormula.copy(temporarilyChangeTargetFormula);
		}
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		initialize();
	}, []);

	const getFooter = () => (
		<Flex spaced centerV>
			<Flex columnMobile>
				<Checkbox isChecked={isTemporarilyChangeTarget} onChange={setIsTemporarilyChangeTarget}>
					{t('temporarily.change.target')}:
				</Checkbox>
				<DynamicValueSelector
					value={temporarilyChangeTargetFormula}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
					disabled={!isTemporarilyChangeTarget}
				/>
			</Flex>
			<Flex one />
			<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />
		</Flex>
	);

	return (
		<>
			<Dialog
				title={`${t('set.effect')}...`}
				isOpen
				footer={getFooter()}
				onClose={handleReject}
				initialHeight='500px'
			>
				<RadioGroup selected={kind} onChange={handleChangeKind}>
					<Flex one column>
						<Flex one column scrollable zeroHeight>
							<Form verticalMobile>
								<Label>
									<RadioButton value={EFFECT_KIND.DAMAGES}>{t('damages.on')}</RadioButton>
								</Label>
								<Value>
									<Flex spaced centerV>
										<Dropdown
											selectedID={damageKind}
											onChange={setDamageKind}
											options={Model.Base.DAMAGE_KIND_OPTIONS}
											translateOptions
										/>
										{damageKind === DAMAGES_KIND.STAT && (
											<DynamicValueSelector
												value={damageStatisticID}
												optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
												databaseOptions={Project.current!.battleSystem.statistics}
												disabled={kind !== EFFECT_KIND.DAMAGES}
											/>
										)}
										{damageKind === DAMAGES_KIND.CURRENCY && (
											<DynamicValueSelector
												value={damageCurrencyID}
												optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
												databaseOptions={Project.current!.systems.currencies}
												disabled={kind !== EFFECT_KIND.DAMAGES}
											/>
										)}
										{damageKind === DAMAGES_KIND.VARIABLE && (
											<VariableSelector
												variableID={damageVariableID}
												onChange={setDamageVariableID}
												forcedVariableID={forcedDamageVariableID}
												setForcedVariableID={setForcedDamageVariableID}
												disabled={kind !== EFFECT_KIND.DAMAGES}
											/>
										)}
									</Flex>
								</Value>
								<Label disabledColon={kind !== EFFECT_KIND.DAMAGES}>
									<Flex centerV>
										<Flex fillSmallSpace />
										<Flex disabledLabel={kind !== EFFECT_KIND.DAMAGES}>{t('with.formula')}</Flex>
									</Flex>
								</Label>
								<Value>
									<DynamicValueSelector
										value={damageFormula}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
										disabled={kind !== EFFECT_KIND.DAMAGES}
									/>
								</Value>
								<Label disabledColon={kind !== EFFECT_KIND.DAMAGES}>
									<Flex centerV>
										<Flex fillSmallSpace />
										<Checkbox
											isChecked={isDamagesMinimum}
											onChange={setIsDamagesMinimum}
											disabled={kind !== EFFECT_KIND.DAMAGES}
										>
											{t('minimum')}
										</Checkbox>
									</Flex>
								</Label>
								<Value>
									<DynamicValueSelector
										value={damagesMinimumFormula}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
										disabled={kind !== EFFECT_KIND.DAMAGES || !isDamagesMinimum}
									/>
								</Value>
								<Label disabledColon={kind !== EFFECT_KIND.DAMAGES}>
									<Flex centerV>
										<Flex fillSmallSpace />
										<Checkbox
											isChecked={isDamagesMaximum}
											onChange={setIsDamagesMaximum}
											disabled={kind !== EFFECT_KIND.DAMAGES}
										>
											{t('maximum')}
										</Checkbox>
									</Flex>
								</Label>
								<Value>
									<DynamicValueSelector
										value={damagesMaximumFormula}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
										disabled={kind !== EFFECT_KIND.DAMAGES || !isDamagesMaximum}
									/>
								</Value>
								<Label disabledColon={kind !== EFFECT_KIND.DAMAGES}>
									<Flex centerV>
										<Flex fillSmallSpace />
										<Checkbox
											isChecked={isDamageElement}
											onChange={setIsDamageElement}
											disabled={kind !== EFFECT_KIND.DAMAGES}
										>
											{t('element.id')}
										</Checkbox>
									</Flex>
								</Label>
								<Value>
									<DynamicValueSelector
										value={damageElementID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.battleSystem.elements}
										disabled={kind !== EFFECT_KIND.DAMAGES || !isDamageElement}
									/>
								</Value>
								<Label disabledColon={kind !== EFFECT_KIND.DAMAGES}>
									<Flex centerV>
										<Flex fillSmallSpace />
										<Checkbox
											isChecked={isDamageVariance}
											onChange={setIsDamageVariance}
											disabled={kind !== EFFECT_KIND.DAMAGES}
										>
											{t('variance')}
										</Checkbox>
									</Flex>
								</Label>
								<Value>
									<Flex spaced centerV>
										<DynamicValueSelector
											value={damageVarianceFormula}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
											disabled={kind !== EFFECT_KIND.DAMAGES || !isDamageVariance}
										/>
										<Flex disabledLabel={kind !== EFFECT_KIND.DAMAGES || !isDamageVariance}>%</Flex>
									</Flex>
								</Value>
								<Label disabledColon={kind !== EFFECT_KIND.DAMAGES}>
									<Flex centerV>
										<Flex fillSmallSpace />
										<Checkbox
											isChecked={isDamageCritical}
											onChange={setIsDamageCritical}
											disabled={kind !== EFFECT_KIND.DAMAGES}
										>
											{t('critical')}
										</Checkbox>
									</Flex>
								</Label>
								<Value>
									<Flex spaced centerV>
										<DynamicValueSelector
											value={damageCriticalFormula}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
											disabled={kind !== EFFECT_KIND.DAMAGES || !isDamageCritical}
										/>
										<Flex disabledLabel={kind !== EFFECT_KIND.DAMAGES || !isDamageCritical}>%</Flex>
									</Flex>
								</Value>
								<Label disabledColon={kind !== EFFECT_KIND.DAMAGES}>
									<Flex centerV>
										<Flex fillSmallSpace />
										<Checkbox
											isChecked={isDamagePrecision}
											onChange={setIsDamagePrecision}
											disabled={kind !== EFFECT_KIND.DAMAGES}
										>
											{t('precision')}
										</Checkbox>
									</Flex>
								</Label>
								<Value>
									<Flex spaced centerV>
										<DynamicValueSelector
											value={damagePrecisionFormula}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
											disabled={kind !== EFFECT_KIND.DAMAGES || !isDamagePrecision}
										/>
										<Flex disabledLabel={kind !== EFFECT_KIND.DAMAGES || !isDamagePrecision}>
											%
										</Flex>
									</Flex>
								</Value>
								<Label disabledColon={kind !== EFFECT_KIND.DAMAGES}>
									<Flex centerV>
										<Flex fillSmallSpace />
										<Checkbox
											isChecked={isDamageStockVariableID}
											onChange={setIsDamageStockVariableID}
											disabled={kind !== EFFECT_KIND.DAMAGES}
										>
											{t('stock.value.in')}
										</Checkbox>
									</Flex>
								</Label>
								<Value>
									<VariableSelector
										variableID={damageStockVariableID}
										onChange={setDamageStockVariableID}
										forcedVariableID={forcedDamageStockVariableID}
										setForcedVariableID={setForcedDamageStockVariableID}
										disabled={kind !== EFFECT_KIND.DAMAGES || !isDamageStockVariableID}
									/>
								</Value>
								<Label hideColon>
									<Flex centerV>
										<Flex fillSmallSpace />
										<Checkbox
											isChecked={isDamageDisplayName}
											onChange={setIsDamageDisplayName}
											disabled={kind !== EFFECT_KIND.DAMAGES}
										>
											{t('display.damage.type.name')}
										</Checkbox>
									</Flex>
								</Label>
								<Value />
								<Label>
									<RadioButton value={EFFECT_KIND.STATUS}>{t('status')}</RadioButton>
								</Label>
								<Value>
									<Flex spaced centerV>
										<Dropdown
											selectedID={addRemoveStatus}
											onChange={setAddRemoveStatus}
											options={Model.Base.ADD_REMOVE_OPTIONS}
											disabled={kind !== EFFECT_KIND.STATUS}
											translateOptions
										/>
										<DynamicValueSelector
											value={statusID}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
											databaseOptions={Project.current!.status.list}
											disabled={kind !== EFFECT_KIND.STATUS}
										/>
									</Flex>
								</Value>
								<Label disabledColon={kind !== EFFECT_KIND.STATUS}>
									<Flex centerV>
										<Flex fillSmallSpace />
										<Flex disabled={kind !== EFFECT_KIND.STATUS}>
											{t('with.precision').toLowerCase()}
										</Flex>
									</Flex>
								</Label>
								<Value>
									<Flex spaced centerV>
										<DynamicValueSelector
											value={statusPrecisionFormula}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
											disabled={kind !== EFFECT_KIND.STATUS}
										/>
										<Flex disabledLabel={kind !== EFFECT_KIND.STATUS}>%</Flex>
									</Flex>
								</Value>
								<Label>
									<RadioButton value={EFFECT_KIND.ADD_REMOVE_SKILL}>{t('skill')}</RadioButton>
								</Label>
								<Value>
									<Flex spaced centerV>
										<Dropdown
											selectedID={addRemoveSkill}
											onChange={setAddRemoveSkill}
											options={Model.Base.ADD_REMOVE_OPTIONS}
											disabled={kind !== EFFECT_KIND.ADD_REMOVE_SKILL}
											translateOptions
										/>
										<DynamicValueSelector
											value={addSkillID}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
											databaseOptions={Project.current!.skills.list}
											disabled={kind !== EFFECT_KIND.ADD_REMOVE_SKILL}
										/>
									</Flex>
								</Value>
								<Label>
									<RadioButton value={EFFECT_KIND.PERFORM_SKILL}>{t('perform.skill')}</RadioButton>
								</Label>
								<Value>
									<DynamicValueSelector
										value={performSkillID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.skills.list}
										disabled={kind !== EFFECT_KIND.PERFORM_SKILL}
									/>
								</Value>
								<Label>
									<RadioButton value={EFFECT_KIND.COMMON_REACTION}>
										{t('call.a.common.reaction')}
									</RadioButton>
								</Label>
								<Value>
									<Button
										onClick={handleClickCommonReaction}
										disabled={kind !== EFFECT_KIND.COMMON_REACTION}
									>
										{t('select')}...
									</Button>
								</Value>
								<Label>
									<RadioButton value={EFFECT_KIND.SPECIAL_ACTIONS}>{t('special.action')}</RadioButton>
								</Label>
								<Value>
									<Dropdown
										selectedID={specialActionKind}
										onChange={setSpecialActionKind}
										options={Model.Base.EFFECT_SPECIAL_ACTION_OPTIONS}
										disabled={kind !== EFFECT_KIND.SPECIAL_ACTIONS}
										translateOptions
									/>
								</Value>
								<Label>
									<RadioButton value={EFFECT_KIND.SCRIPT}>{t('script')}</RadioButton>
								</Label>
								<Value>
									<DynamicValueSelector
										value={scriptFormula}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
										disabled={kind !== EFFECT_KIND.SCRIPT}
									/>
								</Value>
							</Form>
						</Flex>
					</Flex>
				</RadioGroup>
			</Dialog>
			{isDialogCommonReactionOpen && (
				<DialogCommandCallACommonReaction
					setIsOpen={setIsDialogCommonReactionOpen}
					commandKind={EVENT_COMMAND_KIND.CALL_A_COMMON_REACTION}
					list={commonReaction ? commonReaction.command : undefined}
					onAccept={handleAcceptCommonReaction}
					onReject={handleRejectCommonReaction}
				/>
			)}
		</>
	);
}

export default DialogEffect;
