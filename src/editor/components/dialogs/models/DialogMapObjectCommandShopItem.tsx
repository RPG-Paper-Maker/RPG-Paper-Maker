/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DAMAGES_KIND, DYNAMIC_VALUE_OPTIONS_TYPE, ITEM_KIND } from '../../../common';
import { Project } from '../../../core/Project';

import { Node } from '../../../core/Node';
import { Model } from '../../../Editor';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Tree from '../../Tree';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
	model: Model.Base;
	onAccept: () => void;
	onReject?: () => void;
};

function DialogMapObjectCommandShopItem({ isOpen, setIsOpen, model, onAccept, onReject }: Props) {
	const shopItem = model as Model.MapObjectCommandShopItem;

	const { t } = useTranslation();

	const getDefaultCost = () => {
		const cost = new Model.Cost();
		cost.applyDefault();
		cost.kind = DAMAGES_KIND.CURRENCY;
		cost.valueFormula.value = '1';
		return cost;
	};

	const [selectionItem, setSelectionItem] = useStateNumber();
	const [itemID] = useStateDynamicValue();
	const [weaponID] = useStateDynamicValue();
	const [armorID] = useStateDynamicValue();
	const [selectionPrice, setSelectionPrice] = useStateNumber();
	const [specificPrice, setSpecificPrice] = useState<Node[]>([]);
	const [selectionStock, setSelectionStock] = useStateNumber();
	const [specificStock] = useStateDynamicValue();
	const [defaultCost] = useState(getDefaultCost());

	const initialize = () => {
		setSelectionItem(shopItem.selectionItem);
		itemID.copy(shopItem.itemID);
		weaponID.copy(shopItem.weaponID);
		armorID.copy(shopItem.armorID);
		setSelectionPrice(shopItem.selectionPrice ? 1 : 0);
		setSpecificPrice(Node.createList(shopItem.specificPrice));
		setSelectionStock(shopItem.selectionStock ? 1 : 0);
		specificStock.copy(shopItem.specificStock);
	};

	const handleAccept = async () => {
		shopItem.selectionItem = selectionItem;
		shopItem.itemID.copy(itemID);
		shopItem.weaponID.copy(weaponID);
		shopItem.armorID.copy(armorID);
		shopItem.selectionPrice = selectionPrice === 1;
		shopItem.specificPrice = specificPrice.map((price) => price.content.clone() as Model.Cost);
		shopItem.selectionStock = selectionStock === 1;
		shopItem.specificStock.copy(specificStock);
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

	return (
		<Dialog
			title={`${t('item')} / ${t('price')} / ${t('stock')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialHeight='70%'
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge fillHeight>
				<Groupbox title={t('item')}>
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
				<Flex one>
					<Groupbox title={t('price')} fillWidth>
						<RadioGroup selected={selectionPrice} onChange={setSelectionPrice}>
							<Flex column spacedLarge fillWidth fillHeight>
								<RadioButton value={0}>{t('default')}</RadioButton>
								<RadioButton value={1}>{t('specific')}:</RadioButton>
								<Flex one zeroHeight>
									<Tree
										constructorType={Model.Cost}
										defaultNewModel={defaultCost}
										list={specificPrice}
										disabled={selectionPrice !== 1}
									/>
								</Flex>
							</Flex>
						</RadioGroup>
					</Groupbox>
				</Flex>
				<Groupbox title={t('stock')}>
					<RadioGroup selected={selectionStock} onChange={setSelectionStock}>
						<Form>
							<Label hideColon>
								<RadioButton value={0}>{t('unlimited')}</RadioButton>
							</Label>
							<Value />
							<Label>
								<RadioButton value={1}>{t('specific')}</RadioButton>
							</Label>
							<Value>
								<DynamicValueSelector
									value={specificStock}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
									disabled={selectionStock !== 1}
								/>
							</Value>
						</Form>
					</RadioGroup>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogMapObjectCommandShopItem;
