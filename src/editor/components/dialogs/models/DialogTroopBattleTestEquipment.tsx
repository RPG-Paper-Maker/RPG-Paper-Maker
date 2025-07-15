/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_KIND, NONE_WEAPON_ARMOR_KIND } from '../../../common';
import { DynamicValue } from '../../../core/DynamicValue';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import Dropdown from '../../Dropdown';
import Form, { Label, Value } from '../../Form';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogTroopBattleTestHeroEquipment({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const equipment = model as Model.TroopBattleTestHeroEquipment;

	const { t } = useTranslation();

	const [kind, setKind] = useStateNumber();
	const [weaponID, setWeaponID] = useStateNumber();
	const [armorID, setArmorID] = useStateNumber();

	const equipmentID = useMemo(() => DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, equipment.id), [equipment]);
	const weapons = useMemo(
		() => Project.current!.battleSystem.getWeaponsArmorsByEquipmentID(equipmentID, true),
		[equipmentID]
	);
	const armors = useMemo(
		() => Project.current!.battleSystem.getWeaponsArmorsByEquipmentID(equipmentID, false),
		[equipmentID]
	);

	const initialize = () => {
		setKind(equipment.kind);
		setWeaponID(equipment.kind === NONE_WEAPON_ARMOR_KIND.WEAPON ? equipment.weaponArmorID : 1);
		setArmorID(equipment.kind === NONE_WEAPON_ARMOR_KIND.ARMOR ? equipment.weaponArmorID : 1);
	};

	const handleAccept = async () => {
		equipment.kind = kind;
		equipment.weaponArmorID = kind === NONE_WEAPON_ARMOR_KIND.WEAPON ? weaponID : armorID;
		onAccept();
		setIsOpen(false);
	};

	const handleReject = async () => {
		onReject?.();
		setIsOpen(false);
	};

	useEffect(() => {
		if (isOpen) {
			initialize();
		}
	}, [isOpen]);

	useEffect(() => {
		setWeaponID(weapons[0]?.id ?? 1);
	}, [weapons, setWeaponID]);

	useEffect(() => {
		setArmorID(armors[0]?.id ?? 1);
	}, [armors, setArmorID]);

	return (
		<Dialog
			title={`${t('common.equipment')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<RadioGroup selected={kind} onChange={setKind}>
				<Form>
					<Label hideColon>
						<RadioButton value={NONE_WEAPON_ARMOR_KIND.NONE}>{t('none')}</RadioButton>
					</Label>
					<Value />
					{weapons.length > 0 && (
						<>
							<Label>
								<RadioButton value={NONE_WEAPON_ARMOR_KIND.WEAPON}>{t('weapon')}</RadioButton>
							</Label>
							<Value>
								<Dropdown
									selectedID={weaponID}
									onChange={setWeaponID}
									options={weapons}
									disabled={kind !== NONE_WEAPON_ARMOR_KIND.WEAPON}
									displayIDs
								/>
							</Value>
						</>
					)}
					{armors.length > 0 && (
						<>
							<Label>
								<RadioButton value={NONE_WEAPON_ARMOR_KIND.ARMOR}>{t('armor')}</RadioButton>
							</Label>
							<Value>
								<Dropdown
									selectedID={armorID}
									onChange={setArmorID}
									options={armors}
									disabled={kind !== NONE_WEAPON_ARMOR_KIND.ARMOR}
									displayIDs
								/>
							</Value>
						</>
					)}
				</Form>
			</RadioGroup>
		</Dialog>
	);
}

export default DialogTroopBattleTestHeroEquipment;
