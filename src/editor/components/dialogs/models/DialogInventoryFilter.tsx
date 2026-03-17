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
import { DYNAMIC_VALUE_OPTIONS_TYPE, INVENTORY_FILTER_KIND } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import useStateString from '../../../hooks/useStateString';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import InputLocalization from '../../InputLocalization';
import TextArea from '../../TextArea';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogInventoryFilter({ setIsOpen, model, onAccept, onReject }: Props) {
	const inventoryFilter = model as Model.InventoryFilter;

	const { t } = useTranslation();

	const [localization, setLocalization] = useState(inventoryFilter);
	const [kind, setKind] = useStateNumber();
	const [itemTypeID] = useStateDynamicValue();
	const [script, setScript] = useStateString();

	const initialize = () => {
		setLocalization(inventoryFilter);
		setKind(inventoryFilter.kind);
		itemTypeID.copy(inventoryFilter.itemTypeID);
		setScript(inventoryFilter.script);
	};

	const handleAccept = async () => {
		inventoryFilter.copy(localization);
		inventoryFilter.kind = kind;
		if (kind === INVENTORY_FILTER_KIND.CUSTOM) {
			inventoryFilter.itemTypeID.copy(itemTypeID);
		} else {
			inventoryFilter.itemTypeID.updateToDefaultDatabase();
		}
		inventoryFilter.script = kind === INVENTORY_FILTER_KIND.SCRIPT ? script : '';
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

	return (
		<Dialog
			title={`${t('set.inventory.filter')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='450px'
			initialHeight='400px'
		>
			<Flex column spacedLarge fillWidth>
				<Form>
					<Label>{t('name')}</Label>
					<Value>
						<InputLocalization localization={localization} />
					</Value>
					<Label>{t('kind')}</Label>
					<Value>
						<Dropdown
							selectedID={kind}
							onChange={setKind}
							options={Model.Base.INVENTORY_FILTER_OPTIONS}
							translateOptions
						/>
					</Value>
					{kind === INVENTORY_FILTER_KIND.CUSTOM && (
						<>
							<Label>{t('item.type.id')}</Label>
							<Value>
								<DynamicValueSelector
									value={itemTypeID}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
									databaseOptions={Project.current!.systems.itemsTypes}
								/>
							</Value>
						</>
					)}
				</Form>
				<Flex one>
					{kind === INVENTORY_FILTER_KIND.SCRIPT && (
						<TextArea text={script} onChange={setScript} fillHeight />
					)}
				</Flex>
			</Flex>
		</Dialog>
	);
}

export default DialogInventoryFilter;
