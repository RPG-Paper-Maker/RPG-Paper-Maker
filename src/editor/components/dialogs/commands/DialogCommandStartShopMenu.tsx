/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, EVENT_COMMAND_KIND, Utils } from '../../../common';
import { Node } from '../../../core';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import { MapObjectCommandType } from '../../../models';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Tree from '../../Tree';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

function DialogCommandStartShopMenu({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [shopItems, setShopItems] = useState<Node[]>([]);
	const [buyOnly] = useStateDynamicValue();
	const [shopID] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const isRestock = commandKind === EVENT_COMMAND_KIND.RESTOCK_SHOP;

	const initialize = () => {
		if (list) {
			const iterator = Utils.generateIterator();
			if (!isRestock) {
				buyOnly.updateCommand(list, iterator);
			}
			shopID.updateCommand(list, iterator);
			const items: Model.MapObjectCommandShopItem[] = [];
			while (iterator.i < list.length) {
				const shopItem = new Model.MapObjectCommandShopItem();
				shopItem.applyDefault();
				shopItem.initialize(list, iterator);
				shopItem.id = items.length + 1;
				items.push(shopItem);
			}
			setShopItems(Node.createList(items, false));
		} else {
			setShopItems([]);
			buyOnly.updateToDefaultSwitch(false);
			shopID.updateToDefaultNumber(1);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		if (!isRestock) {
			buyOnly.getCommand(newList);
		}
		shopID.getCommand(newList);
		for (const node of shopItems) {
			const shopItem = node.content as Model.MapObjectCommandShopItem;
			shopItem.getCommand(newList);
		}
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		if (isOpen) {
			initialize();
		}
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('start.shop.menu')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='50%'
			initialHeight='60%'
		>
			<Flex one column spacedLarge fillHeight>
				<Flex one zeroHeight>
					<Tree constructorType={Model.MapObjectCommandShopItem} list={shopItems} />
				</Flex>
				<Form>
					{!isRestock && (
						<>
							<Label>{t('buy.only')}</Label>
							<Value>
								<DynamicValueSelector value={buyOnly} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.SWITCH} />
							</Value>
						</>
					)}
					<Label>{t('shop.id')}</Label>
					<Value>
						<DynamicValueSelector value={shopID} optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER} />
					</Value>
				</Form>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandStartShopMenu;
