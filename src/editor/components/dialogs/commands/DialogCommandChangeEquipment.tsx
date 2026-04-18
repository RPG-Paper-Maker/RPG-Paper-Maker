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
import { DYNAMIC_VALUE_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import PanelSelectionHero, { PanelSelectionHeroRef } from '../../panels/PanelSelectionHero';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandChangeEquipment({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const panelSelectionHeroRef = useRef<PanelSelectionHeroRef>(null);

	const [initialized, setInitialized] = useState(false);
	const [equipmentID] = useStateDynamicValue();
	const [weaponArmorKind, setWeaponArmorKind] = useStateNumber();
	const [weaponID] = useStateDynamicValue();
	const [armorID] = useStateDynamicValue();
	const [isApplyOnlyIfInInventory, setIsApplyOnlyIfInInventory] = useStateBool();
	const [, setTrigger] = useStateBool();

	const weaponArmorID = weaponArmorKind === 0 ? weaponID : armorID;

	const getWeaponArmorDatabase = (kind?: number) =>
		Project.current!.battleSystem.getWeaponsArmorsByEquipmentID(equipmentID, (kind ?? weaponArmorKind) === 0);

	const initialize = () => {
		weaponID.updateToDefaultDatabase(Project.current!.weapons.list);
		armorID.updateToDefaultDatabase(Project.current!.armors.list);
		if (list) {
			const iterator = Utils.generateIterator();
			equipmentID.updateCommand(list, iterator);
			const isWeapon = Utils.initializeBoolCommand(list, iterator);
			setWeaponArmorKind(isWeapon ? 0 : 1);
			(isWeapon ? weaponID : armorID).updateCommand(list, iterator);
			panelSelectionHeroRef.current?.initialize(list, iterator);
			setIsApplyOnlyIfInInventory(Utils.initializeBoolCommand(list, iterator));
		} else {
			equipmentID.updateToDefaultDatabase(Project.current!.battleSystem.equipments);
			panelSelectionHeroRef.current?.initialize();
			setIsApplyOnlyIfInInventory(false);
		}
		setTimeout(() => {
			setInitialized(true);
		}, 0);
	};

	const handleChangeEquipment = () => {
		if (initialized) {
			weaponID.updateToDefaultNumber(1);
			armorID.updateToDefaultNumber(1);
			if (equipmentID.kind === DYNAMIC_VALUE_KIND.NUMBER || equipmentID.kind === DYNAMIC_VALUE_KIND.DATABASE) {
				if (
					Project.current!.battleSystem.weaponsKind.some(
						(kind) => kind.equipments[equipmentID.value as number],
					)
				) {
					setWeaponArmorKind(0);
					const db = getWeaponArmorDatabase(0);
					weaponID.updateToDefaultDatabase(db);
				} else if (
					Project.current!.battleSystem.armorsKind.some(
						(kind) => kind.equipments[equipmentID.value as number],
					)
				) {
					setWeaponArmorKind(1);
					const db = getWeaponArmorDatabase(1);
					armorID.updateToDefaultDatabase(db);
				}
			}
			setTrigger((v) => !v);
		}
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		equipmentID.getCommand(newList);
		newList.push(Utils.boolToNum(weaponArmorKind === 0));
		(weaponArmorKind === 0 ? weaponID : armorID).getCommand(newList);
		panelSelectionHeroRef.current?.getCommand(newList);
		newList.push(Utils.boolToNum(isApplyOnlyIfInInventory));
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Dialog
			title={`${t('change.equipment')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge>
				<PanelSelectionHero ref={panelSelectionHeroRef} />
				<Groupbox title={t('value')}>
					<Form>
						<Label>{t('equipment.id')}</Label>
						<Value>
							<Flex spaced centerV>
								<DynamicValueSelector
									value={equipmentID}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
									databaseOptions={Project.current!.battleSystem.equipments}
									onChangeKind={handleChangeEquipment}
									onChangeValue={handleChangeEquipment}
								/>
								{t('with').toLowerCase()}
							</Flex>
						</Value>
						<Label hideColon>
							<Dropdown
								selectedID={weaponArmorKind}
								onChange={setWeaponArmorKind}
								options={Model.Base.WEAPON_ARMOR_ID_OPTIONS}
								translateOptions
							/>
						</Label>
						<Value>
							<DynamicValueSelector
								value={weaponArmorID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={getWeaponArmorDatabase()}
							/>
						</Value>
					</Form>
				</Groupbox>
				<Checkbox isChecked={isApplyOnlyIfInInventory} onChange={setIsApplyOnlyIfInInventory}>
					{t('apply.only.if.in.inventory')}
				</Checkbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandChangeEquipment;
