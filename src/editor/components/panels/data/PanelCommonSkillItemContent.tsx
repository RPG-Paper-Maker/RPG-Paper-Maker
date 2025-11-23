/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	COMMON_SKILL_ITEM_KIND,
	DAMAGES_KIND,
	DYNAMIC_VALUE_OPTIONS_TYPE,
	INPUT_TYPE_WIDTH,
	PICTURE_KIND,
	SONG_KIND,
} from '../../../common';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { Base, Characteristic, CommonSkillItem, Cost, Effect, Localization } from '../../../models';
import AssetSelector, { ASSET_SELECTOR_TYPE } from '../../AssetSelector';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import InputLocalization from '../../InputLocalization';
import PlaySongSelector, { PlaySongSelectorRef } from '../../PlaySongSelector';
import TextureIconPreviewer from '../../TextureIconPreviewer';
import Tree from '../../Tree';

type Props = {
	selectedElement: CommonSkillItem | null;
	kind: COMMON_SKILL_ITEM_KIND;
	disabled?: boolean;
};

function PanelCommonSkillItemContent({ selectedElement, kind, disabled = false }: Props) {
	const { t } = useTranslation();

	const playSoundSelectorRef = useRef<PlaySongSelectorRef>(null);

	const getDefaultCost = () => {
		const cost = new Cost();
		cost.applyDefault();
		cost.kind = DAMAGES_KIND.STAT;
		cost.valueFormula.value = '1';
		return cost;
	};

	const [elementType, setElementType] = useStateNumber();
	const [consumable, setConsumable] = useStateBool();
	const [oneHand, setOneHand] = useStateBool();
	const [iconID, setIconID] = useStateNumber();
	const [iconIndexX, setIconIndexX] = useStateNumber();
	const [iconIndexY, setIconIndexY] = useStateNumber();
	const [description, setDescription] = useState<Localization>(new Localization());
	const [conditionFormula, setConditionFormula] = useStateDynamicValue();
	const [targetKind, setTargetKind] = useStateNumber();
	const [targetConditionFormula, setTargetConditionFormula] = useStateDynamicValue();
	const [availableKind, setAvailableKind] = useStateNumber();
	const [animationUserID, setAnimationUserID] = useStateDynamicValue();
	const [animationTargetID, setAnimationTargetID] = useStateDynamicValue();
	const [canBeSold, setCanBeSold] = useStateDynamicValue();
	const [battleMessage, setBattleMessage] = useState<Localization>(new Localization());
	const [price, setPrice] = useState<Node[]>([]);
	const [costs, setCosts] = useState<Node[]>([]);
	const [defaultCost] = useState(getDefaultCost());
	const [effects, setEffects] = useState<Node[]>([]);
	const [characteristics, setCharacteristics] = useState<Node[]>([]);

	const types = useMemo(() => {
		switch (kind) {
			case COMMON_SKILL_ITEM_KIND.ITEM:
				return Project.current!.systems.itemsTypes;
			case COMMON_SKILL_ITEM_KIND.WEAPON:
				return Project.current!.battleSystem.weaponsKind;
			case COMMON_SKILL_ITEM_KIND.ARMOR:
				return Project.current!.battleSystem.armorsKind;
		}
		return [];
	}, [kind]);

	const update = () => {
		if (selectedElement) {
			setElementType(selectedElement.type);
			setConsumable(selectedElement.consumable);
			setOneHand(selectedElement.oneHand);
			setIconID(selectedElement.pictureID);
			setIconIndexX(selectedElement.pictureIndexX);
			setIconIndexY(selectedElement.pictureIndexY);
			setDescription(selectedElement.description);
			setConditionFormula(selectedElement.conditionFormula);
			setTargetKind(selectedElement.targetKind);
			setTargetConditionFormula(selectedElement.targetConditionFormula);
			setAvailableKind(selectedElement.availableKind);
			playSoundSelectorRef.current?.initialize(selectedElement.sound);
			setAnimationUserID(selectedElement.animationUserID);
			setAnimationTargetID(selectedElement.animationTargetID);
			setCanBeSold(selectedElement.canBeSold);
			setBattleMessage(selectedElement.battleMessage);
			setPrice(Node.createList(selectedElement.price, false));
			setCosts(Node.createList(selectedElement.costs, false));
			setEffects(Node.createList(selectedElement.effects, false));
			setCharacteristics(Node.createList(selectedElement.characteristics, false));
		}
	};

	const handleChangeElementType = (n: number) => {
		setElementType(n);
		selectedElement!.type = n;
	};

	const handleChangeConsumable = (b: boolean) => {
		setConsumable(b);
		selectedElement!.consumable = b;
	};

	const handleChangeOneHand = (b: boolean) => {
		setOneHand(b);
		selectedElement!.oneHand = b;
	};

	const handleChangeIcon = (id: number, indexX: number, indexY: number) => {
		setIconID(id);
		setIconIndexX(indexX);
		setIconIndexY(indexY);
		selectedElement!.pictureID = id;
		selectedElement!.pictureIndexX = indexX;
		selectedElement!.pictureIndexY = indexY;
	};

	const handleChangeTargetKind = (n: number) => {
		setTargetKind(n);
		selectedElement!.targetKind = n;
	};

	const handleChangeAvailableKind = (n: number) => {
		setAvailableKind(n);
		selectedElement!.availableKind = n;
	};

	const handleUpdatePrice = () => {
		selectedElement!.price = Node.createListFromNodes(price);
	};

	const handleUpdateCosts = () => {
		selectedElement!.costs = Node.createListFromNodes(costs);
	};

	const handleUpdateEffects = () => {
		selectedElement!.effects = Node.createListFromNodes(effects);
	};

	const handleUpdateCharacteristics = () => {
		selectedElement!.characteristics = Node.createListFromNodes(characteristics);
	};

	useLayoutEffect(() => {
		update();
	}, [selectedElement]);

	return (
		<Flex one column spacedLarge fillWidth fillHeight>
			<Flex spaced centerV>
				{kind !== COMMON_SKILL_ITEM_KIND.SKILL && (
					<>
						<Flex disabledLabel={disabled}>{t('type')}:</Flex>
						<Dropdown
							selectedID={elementType}
							onChange={handleChangeElementType}
							options={types}
							disabled={disabled}
							displayIDs
						/>
					</>
				)}
				{kind === COMMON_SKILL_ITEM_KIND.ITEM && (
					<Checkbox isChecked={consumable} onChange={handleChangeConsumable} disabled={disabled}>
						{t('consomable')}
					</Checkbox>
				)}
				{kind === COMMON_SKILL_ITEM_KIND.WEAPON && (
					<Checkbox isChecked={oneHand} onChange={handleChangeOneHand} disabled={disabled}>
						{t('one.hand')}
					</Checkbox>
				)}
				<Flex one />
				<Flex disabledLabel={disabled}>{t('icon')}:</Flex>
				<AssetSelector
					selectionType={ASSET_SELECTOR_TYPE.PICTURES}
					kind={PICTURE_KIND.ICONS}
					selectedID={iconID}
					indexX={iconIndexX}
					indexY={iconIndexY}
					onChange={handleChangeIcon}
				/>
				<TextureIconPreviewer id={iconID} indexX={iconIndexX} indexY={iconIndexY} />
			</Flex>
			<Flex one spacedLarge>
				<Flex column spacedLarge>
					<Flex disabledLabel={disabled}>{t('description')}:</Flex>
					<InputLocalization
						localization={description}
						disabled={disabled}
						widthType={INPUT_TYPE_WIDTH.FILL}
					/>
					<Form>
						<Label disabled={disabled}>{t('condition.formula')}</Label>
						<Value>
							<DynamicValueSelector
								value={conditionFormula}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
								disabled={disabled}
								addNoneOption
							/>
						</Value>
						{kind !== COMMON_SKILL_ITEM_KIND.ARMOR && (
							<>
								<Label disabled={disabled}>{t('target')}</Label>
								<Value>
									<Dropdown
										selectedID={targetKind}
										onChange={handleChangeTargetKind}
										options={Base.TARGET_KIND_OPTIONS}
										disabled={disabled}
										translateOptions
									/>
								</Value>
								<Label disabled={disabled}>{t('target.conditions.formula')}</Label>
								<Value>
									<DynamicValueSelector
										value={targetConditionFormula}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
										disabled={disabled}
										addNoneOption
									/>
								</Value>
								{(kind === COMMON_SKILL_ITEM_KIND.ITEM || kind === COMMON_SKILL_ITEM_KIND.SKILL) && (
									<>
										<Label disabled={disabled}>{t('available')}</Label>
										<Value>
											<Dropdown
												selectedID={availableKind}
												onChange={handleChangeAvailableKind}
												options={Base.AVAILABLE_KIND_OPTIONS}
												disabled={disabled}
												translateOptions
											/>
										</Value>
									</>
								)}
								{(kind === COMMON_SKILL_ITEM_KIND.ITEM || kind === COMMON_SKILL_ITEM_KIND.SKILL) && (
									<>
										<Label disabled={disabled}>{`${t('sound.effect')} (${t(
											'main.menu',
										).toLowerCase()})`}</Label>
										<Value>
											<PlaySongSelector
												songKind={SONG_KIND.SOUND}
												ref={playSoundSelectorRef}
												disabled={disabled}
											/>
										</Value>
									</>
								)}
								<Label disabled={disabled}>{t('user.animation.id')}</Label>
								<Value>
									<DynamicValueSelector
										value={animationUserID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.animations.list}
										disabled={disabled}
										addNoneOption
									/>
								</Value>
								<Label disabled={disabled}>{t('target.animation.id')}</Label>
								<Value>
									<DynamicValueSelector
										value={animationTargetID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										databaseOptions={Project.current!.animations.list}
										disabled={disabled}
										addNoneOption
									/>
								</Value>
							</>
						)}
						{kind !== COMMON_SKILL_ITEM_KIND.SKILL && (
							<>
								<Label disabled={disabled}>{t('can.be.sold')}</Label>
								<Value>
									<DynamicValueSelector
										value={canBeSold}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.SWITCH}
										disabled={disabled}
									/>
								</Value>
							</>
						)}
						{(kind === COMMON_SKILL_ITEM_KIND.ITEM || kind === COMMON_SKILL_ITEM_KIND.SKILL) && (
							<>
								<Label disabled={disabled}>{t('battle.message')}</Label>
								<Value>
									<InputLocalization
										localization={battleMessage}
										disabled={disabled}
										widthType={INPUT_TYPE_WIDTH.FILL}
									/>
								</Value>
							</>
						)}
					</Form>
					<Flex one>
						{kind !== COMMON_SKILL_ITEM_KIND.SKILL && (
							<Groupbox title={t('price')} disabled={disabled} fillWidth>
								<Flex one fillHeight>
									<Tree
										constructorType={Cost}
										list={price}
										onListUpdated={handleUpdatePrice}
										disabled={disabled}
										noScrollOnForce
										scrollable
										canBeEmpty
										byIndex
										cannotUpdateListSize
									/>
								</Flex>
							</Groupbox>
						)}
						{(kind === COMMON_SKILL_ITEM_KIND.WEAPON || kind === COMMON_SKILL_ITEM_KIND.SKILL) && (
							<Groupbox title={t('costs')} disabled={disabled} fillWidth>
								<Flex one fillHeight>
									<Tree
										constructorType={Cost}
										list={costs}
										onListUpdated={handleUpdateCosts}
										disabled={disabled}
										defaultNewModel={defaultCost}
										noScrollOnForce
										scrollable
										canBeEmpty
										byIndex
										cannotUpdateListSize
									/>
								</Flex>
							</Groupbox>
						)}
					</Flex>
				</Flex>
				<Flex one column>
					{kind !== COMMON_SKILL_ITEM_KIND.ARMOR && (
						<Flex one>
							<Groupbox title={t('effects')} disabled={disabled} fillWidth>
								<Flex one fillHeight>
									<Tree
										constructorType={Effect}
										list={effects}
										onListUpdated={handleUpdateEffects}
										disabled={disabled}
										noScrollOnForce
										scrollable
										canBeEmpty
										byIndex
										cannotUpdateListSize
									/>
								</Flex>
							</Groupbox>
						</Flex>
					)}
					{(kind === COMMON_SKILL_ITEM_KIND.WEAPON || kind === COMMON_SKILL_ITEM_KIND.ARMOR) && (
						<Flex one>
							<Groupbox title={t('characteristics')} disabled={disabled} fillWidth>
								<Flex one fillHeight>
									<Tree
										constructorType={Characteristic}
										list={characteristics}
										onListUpdated={handleUpdateCharacteristics}
										disabled={disabled}
										noScrollOnForce
										scrollable
										canBeEmpty
										byIndex
										cannotUpdateListSize
									/>
								</Flex>
							</Groupbox>
						</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
}

export default PanelCommonSkillItemContent;
