/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, ITEM_KIND, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import PanelOperation, { SELECTION_OPERATION_TYPE } from '../../panels/PanelOperation';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandModifyInventory({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [selectionItem, setSelectionItem] = useStateNumber();
	const [itemID] = useStateDynamicValue();
	const [weaponID] = useStateDynamicValue();
	const [armorID] = useStateDynamicValue();
	const [selectionOperationType, setSelectionOperationType] = useStateNumber();
	const [value] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		itemID.updateToDefaultDatabase(Project.current!.items.list);
		weaponID.updateToDefaultDatabase(Project.current!.weapons.list);
		armorID.updateToDefaultDatabase(Project.current!.armors.list);
		if (list) {
			const iterator = Utils.generateIterator();
			const selection = list[iterator.i++] as ITEM_KIND;
			setSelectionItem(selection);
			switch (selection) {
				case ITEM_KIND.ITEM:
					itemID.updateCommand(list, iterator);
					break;
				case ITEM_KIND.WEAPON:
					weaponID.updateCommand(list, iterator);
					break;
				case ITEM_KIND.ARMOR:
					armorID.updateCommand(list, iterator);
					break;
			}
			setSelectionOperationType(list[iterator.i++] as SELECTION_OPERATION_TYPE);
			value.updateCommand(list, iterator);
		} else {
			setSelectionItem(ITEM_KIND.ITEM);
			setSelectionOperationType(SELECTION_OPERATION_TYPE.PLUS);
			value.updateToDefaultNumber(1);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(selectionItem);
		switch (selectionItem) {
			case ITEM_KIND.ITEM:
				itemID.getCommand(newList);
				break;
			case ITEM_KIND.WEAPON:
				weaponID.getCommand(newList);
				break;
			case ITEM_KIND.ARMOR:
				armorID.getCommand(newList);
				break;
		}
		newList.push(selectionOperationType);
		value.getCommand(newList);
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
			title={`${t('modify.inventory')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge fillWidth>
				<Groupbox title={t('selection')}>
					<RadioGroup selected={selectionItem} onChange={setSelectionItem}>
						<Form>
							<Label>
								<RadioButton value={ITEM_KIND.ITEM}>{t('item.id')}</RadioButton>
							</Label>
							<Value>
								<DynamicValueSelector
									value={itemID}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
									databaseOptions={Project.current!.items.list}
									disabled={selectionItem !== ITEM_KIND.ITEM}
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
									disabled={selectionItem !== ITEM_KIND.WEAPON}
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
									disabled={selectionItem !== ITEM_KIND.ARMOR}
								/>
							</Value>
						</Form>
					</RadioGroup>
				</Groupbox>
				<PanelOperation selectionType={selectionOperationType} setSelectionType={setSelectionOperationType} />
				<Groupbox title={t('number')}>
					<DynamicValueSelector value={value} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandModifyInventory;
