/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	CHARACTERISTIC_KIND,
	DYNAMIC_VALUE_KIND,
	DYNAMIC_VALUE_OPTIONS_TYPE,
	INCREASE_DECREASE_KIND,
} from '../../../common';
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Tab from '../../Tab';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogCharacteristic({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const characteristic = model as Model.Characteristic;

	const { t } = useTranslation();

	const [forcedCurrentIndex, setForcedCurrentIndex] = useState<number | null>(null);
	const [kind, setKind] = useStateNumber();
	const [increaseDescrease, setIncreaseDecrease] = useStateNumber();
	const [increaseDescreaseKind, setIncreaseDecreaseKind] = useStateNumber();
	const [statisticValueID] = useStateDynamicValue();
	const [elementResID] = useStateDynamicValue();
	const [statusResID] = useStateDynamicValue();
	const [currencyGainID] = useStateDynamicValue();
	const [skillCostSelection, setSkillCostSelection] = useStateNumber();
	const [skillCostID] = useStateDynamicValue();
	const [operationSelection, setOperationSelection] = useStateNumber();
	const [value] = useStateDynamicValue();
	const [unitSelection, setUnitSelection] = useStateNumber();
	const [allowEquipSelection, setAllowEquipSelection] = useStateNumber();
	const [allowEquipWeaponSelection, setAllowEquipWeaponSelection] = useStateNumber();
	const [equipWeaponTypeID] = useStateDynamicValue();
	const [equipArmorTypeID] = useStateDynamicValue();
	const [allowChangeEquipment, setAllowChangeEquipment] = useStateNumber();
	const [changeEquipmentID] = useStateDynamicValue();
	const [beginEquipmentID] = useStateDynamicValue();
	const [beginEquipmentUpdate, setBeginEquipmentUpdate] = useStateBool();
	const [beginWeaponArmorSelection, setBeginWeaponArmorSelection] = useStateNumber();
	const [beginWeaponArmorID] = useStateDynamicValue();
	const [elementID] = useStateDynamicValue();
	const [script] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const beginEquipmentDatabase = useMemo(
		() =>
			Project.current!.battleSystem.getWeaponsArmorsByEquipmentID(
				beginEquipmentID,
				beginWeaponArmorSelection === 0
			),
		// eslint-disable-next-line
		[beginEquipmentUpdate, beginWeaponArmorSelection]
	);

	const initialize = () => {
		setForcedCurrentIndex(getCharacteristicTabIndex());
		setKind(characteristic.kind);
		setIncreaseDecrease(characteristic.isIncreaseDecrease ? 0 : 1);
		setIncreaseDecreaseKind(characteristic.increaseDecreaseKind);
		statisticValueID.copy(characteristic.statisticValueID);
		elementResID.copy(characteristic.elementResID);
		statusResID.copy(characteristic.statusResID);
		currencyGainID.copy(characteristic.currencyGainID);
		setSkillCostSelection(characteristic.isAllSkillCost ? 0 : 1);
		skillCostID.copy(characteristic.skillCostID);
		setOperationSelection(characteristic.operation ? 0 : 1);
		value.copy(characteristic.value);
		setUnitSelection(characteristic.unit ? 0 : 1);
		setAllowEquipSelection(characteristic.isAllowEquip ? 0 : 1);
		setAllowEquipWeaponSelection(characteristic.isAllowEquipWeapon ? 0 : 1);
		equipWeaponTypeID.copy(characteristic.equipWeaponTypeID);
		equipArmorTypeID.copy(characteristic.equipArmorTypeID);
		setAllowChangeEquipment(characteristic.isAllowChangeEquipment ? 0 : 1);
		changeEquipmentID.copy(characteristic.changeEquipmentID);
		beginEquipmentID.copy(characteristic.beginEquipmentID);
		setBeginWeaponArmorSelection(characteristic.isBeginWeapon ? 0 : 1);
		beginWeaponArmorID.copy(characteristic.beginWeaponArmorID);
		elementID.copy(characteristic.elementID);
		script.copy(characteristic.script);
	};

	const getCharacteristicTabIndex = () => {
		switch (characteristic.kind) {
			case CHARACTERISTIC_KIND.INCREASE_DECREASE:
				return 0;
			case CHARACTERISTIC_KIND.ALLOW_FORBID_EQUIP:
			case CHARACTERISTIC_KIND.ALLOW_FORBID_CHANGE:
			case CHARACTERISTIC_KIND.BEGIN_EQUIPMENT:
			case CHARACTERISTIC_KIND.ELEMENT:
				return 1;
			case CHARACTERISTIC_KIND.SCRIPT:
				return 2;
		}
	};

	const updateBeginEquipmentDatabase = () => {
		setBeginEquipmentUpdate((b) => !b);
	};

	const handleAccept = async () => {
		characteristic.applyDefault();
		characteristic.kind = kind;
		switch (kind) {
			case CHARACTERISTIC_KIND.INCREASE_DECREASE:
				characteristic.isIncreaseDecrease = increaseDescrease === 0;
				characteristic.increaseDecreaseKind = increaseDescreaseKind;
				characteristic.statisticValueID.copy(statisticValueID);
				characteristic.elementResID.copy(elementResID);
				characteristic.statusResID.copy(statusResID);
				characteristic.currencyGainID.copy(currencyGainID);
				characteristic.isAllSkillCost = skillCostSelection === 0;
				characteristic.skillCostID.copy(skillCostID);
				characteristic.operation = operationSelection === 0;
				characteristic.value.copy(value);
				characteristic.unit = unitSelection === 0;
				break;
			case CHARACTERISTIC_KIND.ALLOW_FORBID_EQUIP:
				characteristic.isAllowEquip = allowEquipSelection === 0;
				characteristic.isAllowEquipWeapon = allowEquipWeaponSelection === 0;
				characteristic.equipWeaponTypeID.copy(equipWeaponTypeID);
				characteristic.equipArmorTypeID.copy(equipArmorTypeID);
				break;
			case CHARACTERISTIC_KIND.ALLOW_FORBID_CHANGE:
				characteristic.isAllowChangeEquipment = allowChangeEquipment === 0;
				characteristic.changeEquipmentID.copy(changeEquipmentID);
				break;
			case CHARACTERISTIC_KIND.BEGIN_EQUIPMENT:
				characteristic.beginEquipmentID.copy(beginEquipmentID);
				characteristic.isBeginWeapon = beginWeaponArmorSelection === 0;
				characteristic.beginWeaponArmorID.copy(beginWeaponArmorID);
				break;
			case CHARACTERISTIC_KIND.ELEMENT:
				characteristic.elementID.copy(elementID);
				break;
			case CHARACTERISTIC_KIND.SCRIPT:
				characteristic.script.copy(script);
				break;
		}
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	useLayoutEffect(() => {
		if (beginWeaponArmorID.kind === DYNAMIC_VALUE_KIND.DATABASE && beginEquipmentDatabase.length === 0) {
			beginWeaponArmorID.kind = DYNAMIC_VALUE_KIND.NUMBER;
			beginWeaponArmorID.value = 0;
			setTrigger((b) => !b);
		}
		if (beginEquipmentDatabase.length > 0) {
			beginWeaponArmorID.kind = DYNAMIC_VALUE_KIND.DATABASE;
			beginWeaponArmorID.value = beginEquipmentDatabase[0].id;
			setTrigger((b) => !b);
		}
	}, [beginEquipmentDatabase, setTrigger, beginWeaponArmorID]);

	const getBuffContent = () => (
		<Form>
			<Label>
				<RadioButton value={CHARACTERISTIC_KIND.INCREASE_DECREASE}>{t('buff')}</RadioButton>
			</Label>
			<Value>
				<Flex spaced>
					<Dropdown
						selectedID={increaseDescrease}
						onChange={setIncreaseDecrease}
						options={Model.Base.SELECTION_INCREASE_DECREASE_OPTIONS}
						disabled={kind !== CHARACTERISTIC_KIND.INCREASE_DECREASE}
						translateOptions
					/>
					<Dropdown
						selectedID={increaseDescreaseKind}
						onChange={setIncreaseDecreaseKind}
						options={Model.Base.INCREASE_DECREASE_OPTIONS}
						disabled={kind !== CHARACTERISTIC_KIND.INCREASE_DECREASE}
						translateOptions
					/>
					{getBuffContentSelection()}
				</Flex>
			</Value>
			<Label hideColon />
			<Value>
				<Flex spaced>
					<Dropdown
						selectedID={operationSelection}
						onChange={setOperationSelection}
						options={Model.Base.mapListIndex(['*', '+'])}
						disabled={kind !== CHARACTERISTIC_KIND.INCREASE_DECREASE}
					/>
					<DynamicValueSelector
						value={value}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
						disabled={kind !== CHARACTERISTIC_KIND.INCREASE_DECREASE}
					/>
					<Dropdown
						selectedID={unitSelection}
						onChange={setUnitSelection}
						options={Model.Base.mapListIndex(['%', t('fix')])}
						disabled={kind !== CHARACTERISTIC_KIND.INCREASE_DECREASE}
					/>
				</Flex>
			</Value>
		</Form>
	);

	const getBuffContentSelection = () => {
		switch (increaseDescreaseKind) {
			case INCREASE_DECREASE_KIND.STAT_VALUE:
				return (
					<DynamicValueSelector
						value={statisticValueID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.battleSystem.statistics}
						disabled={kind !== CHARACTERISTIC_KIND.INCREASE_DECREASE}
					/>
				);
			case INCREASE_DECREASE_KIND.ELEMENT_RES:
				return (
					<DynamicValueSelector
						value={elementResID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.battleSystem.elements}
						disabled={kind !== CHARACTERISTIC_KIND.INCREASE_DECREASE}
					/>
				);
			case INCREASE_DECREASE_KIND.STATUS_RES:
				return (
					<DynamicValueSelector
						value={statusResID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.status.list}
						disabled={kind !== CHARACTERISTIC_KIND.INCREASE_DECREASE}
					/>
				);
			case INCREASE_DECREASE_KIND.EXPERIENCE_GAIN:
				return null;
			case INCREASE_DECREASE_KIND.CURRENCY_GAIN:
				return (
					<DynamicValueSelector
						value={currencyGainID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.systems.currencies}
						disabled={kind !== CHARACTERISTIC_KIND.INCREASE_DECREASE}
					/>
				);
			case INCREASE_DECREASE_KIND.SKILL_COST:
				return (
					<Flex spaced>
						<Dropdown
							selectedID={skillCostSelection}
							onChange={setSkillCostSelection}
							options={Model.Base.SELECTION_ALL_SKILL_COST_OPTIONS}
							disabled={kind !== CHARACTERISTIC_KIND.INCREASE_DECREASE}
							translateOptions
						/>
						{skillCostSelection === 1 && (
							<DynamicValueSelector
								value={skillCostID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.skills.list}
								disabled={kind !== CHARACTERISTIC_KIND.INCREASE_DECREASE}
							/>
						)}
					</Flex>
				);
		}
	};

	const getCharacterSpecificContent = () => {
		return (
			<Form>
				<Label>
					<RadioButton value={CHARACTERISTIC_KIND.ALLOW_FORBID_EQUIP}>{t('equip')}</RadioButton>
				</Label>
				<Value>
					<Flex spaced>
						<Dropdown
							selectedID={allowEquipSelection}
							onChange={setAllowEquipSelection}
							options={Model.Base.ALLOW_FORBID_OPTIONS}
							disabled={kind !== CHARACTERISTIC_KIND.ALLOW_FORBID_EQUIP}
							translateOptions
						/>
						<Dropdown
							selectedID={allowEquipWeaponSelection}
							onChange={setAllowEquipWeaponSelection}
							options={Model.Base.WEAPON_ARMOR_OPTIONS}
							disabled={kind !== CHARACTERISTIC_KIND.ALLOW_FORBID_EQUIP}
							translateOptions
						/>
						{allowEquipWeaponSelection === 0 && (
							<DynamicValueSelector
								value={equipWeaponTypeID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.battleSystem.weaponsKind}
								disabled={kind !== CHARACTERISTIC_KIND.ALLOW_FORBID_EQUIP}
							/>
						)}
						{allowEquipWeaponSelection === 1 && (
							<DynamicValueSelector
								value={equipArmorTypeID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.battleSystem.armorsKind}
								disabled={kind !== CHARACTERISTIC_KIND.ALLOW_FORBID_EQUIP}
							/>
						)}
					</Flex>
				</Value>
				<Label>
					<RadioButton value={CHARACTERISTIC_KIND.ALLOW_FORBID_CHANGE}>{t('change.equipment')}</RadioButton>
				</Label>
				<Value>
					<Flex spaced>
						<Dropdown
							selectedID={allowChangeEquipment}
							onChange={setAllowChangeEquipment}
							options={Model.Base.ALLOW_FORBID_OPTIONS}
							disabled={kind !== CHARACTERISTIC_KIND.ALLOW_FORBID_CHANGE}
							translateOptions
						/>
						<DynamicValueSelector
							value={changeEquipmentID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.battleSystem.equipments}
							disabled={kind !== CHARACTERISTIC_KIND.ALLOW_FORBID_CHANGE}
						/>
					</Flex>
				</Value>
				<Label>
					<RadioButton value={CHARACTERISTIC_KIND.BEGIN_EQUIPMENT}>{t('begin.equipment')}</RadioButton>
				</Label>
				<Value>
					<Flex spaced>
						<DynamicValueSelector
							value={beginEquipmentID}
							onChangeKind={updateBeginEquipmentDatabase}
							onChangeValue={updateBeginEquipmentDatabase}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.battleSystem.equipments}
							disabled={kind !== CHARACTERISTIC_KIND.BEGIN_EQUIPMENT}
						/>
						<Flex disabledLabel={kind !== CHARACTERISTIC_KIND.BEGIN_EQUIPMENT}>
							{t('with').toLocaleLowerCase()}
						</Flex>
					</Flex>
				</Value>
				<Label hideColon />
				<Value>
					<Flex spaced>
						<Dropdown
							selectedID={beginWeaponArmorSelection}
							onChange={setBeginWeaponArmorSelection}
							options={Model.Base.WEAPON_ARMOR_OPTIONS}
							disabled={kind !== CHARACTERISTIC_KIND.BEGIN_EQUIPMENT}
							translateOptions
						/>
						<DynamicValueSelector
							value={beginWeaponArmorID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							databaseOptions={Project.current!.battleSystem.getWeaponsArmorsByEquipmentID(
								beginEquipmentID,
								beginWeaponArmorSelection === 0
							)}
							disabled={kind !== CHARACTERISTIC_KIND.BEGIN_EQUIPMENT}
						/>
					</Flex>
				</Value>
				<Label>
					<RadioButton value={CHARACTERISTIC_KIND.ELEMENT}>{t('element.id')}</RadioButton>
				</Label>
				<Value>
					<DynamicValueSelector
						value={elementID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
						databaseOptions={Project.current!.battleSystem.elements}
						disabled={kind !== CHARACTERISTIC_KIND.ELEMENT}
					/>
				</Value>
			</Form>
		);
	};

	const getOtherContent = () => {
		return (
			<Form>
				<Label>
					<RadioButton value={CHARACTERISTIC_KIND.SCRIPT}>{t('script')}</RadioButton>
				</Label>
				<Value>
					<DynamicValueSelector
						value={script}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
						disabled={kind !== CHARACTERISTIC_KIND.SCRIPT}
					/>
				</Value>
			</Form>
		);
	};

	return (
		<Dialog
			title={`${t('set.characteristic')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='700px'
			initialHeight='300px'
		>
			<RadioGroup selected={kind} onChange={setKind}>
				<Tab
					titles={Model.Base.mapListIndex([t('buff'), t('character.specific'), t('other')])}
					contents={[getBuffContent(), getCharacterSpecificContent(), getOtherContent()]}
					forcedCurrentIndex={forcedCurrentIndex}
					setForcedCurrentIndex={setForcedCurrentIndex}
					lazyLoadingContent
					hideScroll
					padding
				/>
			</RadioGroup>
		</Dialog>
	);
}

export default DialogCharacteristic;
