/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, ITEM_KIND } from '../../../common';
import { Project } from '../../../core';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
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

function DialogMonsterLoot({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const monsterLoot = model as Model.MonsterLoot;

	const { t } = useTranslation();

	const [kind, setKind] = useStateNumber();
	const [itemID] = useStateDynamicValue();
	const [weaponID] = useStateDynamicValue();
	const [armorID] = useStateDynamicValue();
	const [number] = useStateDynamicValue();
	const [probability] = useStateDynamicValue();
	const [initial] = useStateDynamicValue();
	const [final] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		setKind(monsterLoot.kind);
		itemID.updateToDefaultDatabase();
		weaponID.updateToDefaultDatabase();
		armorID.updateToDefaultDatabase();
		switch (monsterLoot.kind) {
			case ITEM_KIND.ITEM:
				itemID.copy(monsterLoot.lootID);
				break;
			case ITEM_KIND.WEAPON:
				weaponID.copy(monsterLoot.lootID);
				break;
			case ITEM_KIND.ITEM:
				armorID.copy(monsterLoot.lootID);
				break;
		}
		number.copy(monsterLoot.number);
		probability.copy(monsterLoot.probability);
		initial.copy(monsterLoot.initial);
		final.copy(monsterLoot.final);
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		monsterLoot.kind = kind;
		switch (kind) {
			case ITEM_KIND.ITEM:
				monsterLoot.lootID.copy(itemID);
				break;
			case ITEM_KIND.WEAPON:
				monsterLoot.lootID.copy(weaponID);
				break;
			case ITEM_KIND.ITEM:
				monsterLoot.lootID.copy(armorID);
				break;
		}
		monsterLoot.number.copy(number);
		monsterLoot.probability.copy(probability);
		monsterLoot.initial.copy(initial);
		monsterLoot.final.copy(final);
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

	return (
		<Dialog
			title={`${t('set.loot')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
		>
			<Flex column spacedLarge fillWidth fillHeight>
				<Groupbox title={t('loot')}>
					<RadioGroup selected={kind} onChange={setKind}>
						<Form>
							<Label>
								<RadioButton value={ITEM_KIND.ITEM}>{t('item.id')}</RadioButton>
							</Label>
							<Value>
								<DynamicValueSelector
									value={itemID}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
									databaseOptions={Project.current!.items.list}
								/>
							</Value>
							<Label>
								<RadioButton value={ITEM_KIND.WEAPON}>{t('weapon.id')}</RadioButton>
							</Label>
							<Value>
								<DynamicValueSelector
									value={weaponID}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
									databaseOptions={Project.current!.weapons.list}
								/>
							</Value>
							<Label>
								<RadioButton value={ITEM_KIND.ARMOR}>{t('armor.id')}</RadioButton>
							</Label>
							<Value>
								<DynamicValueSelector
									value={armorID}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
									databaseOptions={Project.current!.armors.list}
								/>
							</Value>
						</Form>
					</RadioGroup>
				</Groupbox>
				<Form>
					<Label>{t('number')}</Label>
					<Value>
						<DynamicValueSelector value={number} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
					</Value>
					<Label>{t('probability')}</Label>
					<Value>
						<DynamicValueSelector value={probability} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
					</Value>
				</Form>
				<div>{t('level.between')}:</div>
				<Flex spaced>
					<DynamicValueSelector value={initial} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
					{t('and').toLowerCase()}
					<DynamicValueSelector value={final} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogMonsterLoot;
