/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	CONDITION_HEROES_KIND,
	DYNAMIC_VALUE_OPTIONS_TYPE,
	EVENT_COMMAND_KIND,
	JSONType,
	OPERATION_KIND,
	Utils,
} from '../../../common';
import { Project } from '../../../core/Project';
import { Model, Scene } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Button from '../../Button';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Tab from '../../Tab';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

enum SELECTION_TYPE {
	VARIABLE_PARAM_PROP = 0,
	HEROES = 1,
	CURRENCY = 2,
	ITEM = 3,
	WEAPON = 4,
	ARMOR = 5,
	KEY = 6,
	OBJECT_LOOKING = 9,
	OBJECT_CLIMBING = 11,
	CHRONOMETER = 10,
	ESCAPED_LAST_BATTLE = 8,
	SCRIPT = 7,
}

enum SELECTION_HEROES_TYPE {
	ARE_NAMED,
	ARE_IN_TEAM,
	ARE_ABLE_SKILL,
	ARE_EQUIPED_WITH,
	ARE_UNDER_EFFECT_STATUS,
	HAVE_STATISTIC,
}

enum SELECTION_HEROES_EQUIPED_TYPE {
	WEAPON,
	ARMOR,
}

enum CONDITION_OPERATOR {
	AND,
	OR,
}

const CONDITION_TREE_KIND = -1;

type ConditionTree = {
	condition?: MapObjectCommandType[];
	operator?: CONDITION_OPERATOR;
	children?: ConditionTree[];
};

const isConditionGroup = (tree: ConditionTree): tree is Required<Pick<ConditionTree, 'operator' | 'children'>> =>
	tree.children !== undefined;

const getConditionTree = (tree: ConditionTree, path: number[]): ConditionTree => {
	let current = tree;
	for (const index of path) {
		current = current.children![index];
	}
	return current;
};

const replaceConditionTree = (tree: ConditionTree, path: number[], replacement: ConditionTree): ConditionTree => {
	if (path.length === 0) {
		return replacement;
	}
	const [index, ...remainingPath] = path;
	return {
		...tree,
		children: tree.children!.map((child, childIndex) =>
			childIndex === index ? replaceConditionTree(child, remainingPath, replacement) : child,
		),
	};
};

const getFirstConditionPath = (tree: ConditionTree, path: number[] = []): number[] => {
	if (!isConditionGroup(tree)) {
		return path;
	}
	return getFirstConditionPath(tree.children[0], [...path, 0]);
};

const removeConditionTree = (tree: ConditionTree, path: number[]): ConditionTree | null => {
	if (path.length === 0) {
		return null;
	}
	const [index, ...remainingPath] = path;
	const child = tree.children![index];
	const nextChild = remainingPath.length === 0 ? null : removeConditionTree(child, remainingPath);
	const children = tree.children!.flatMap((current, currentIndex) =>
		currentIndex === index ? (nextChild ? [nextChild] : []) : [current],
	);
	if (children.length === 1) {
		return children[0];
	}
	return { ...tree, children };
};

function DialogCommandIf({ commandKind, setIsOpen, list: commandList, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [forcedTabIndex, setForcedTabIndex] = useState<number | null>(null);
	const [currentTabIndex, setCurrentTabIndex] = useState(0);
	const [selectionType, setSelectionType] = useStateNumber();
	const [variableParamProp] = useStateDynamicValue();
	const [variableParamPropCompare, setVariableParamPropCompare] = useStateNumber();
	const [variableParamPropCompareValue] = useStateDynamicValue();
	const [heroesSelection, setHeroesSelection] = useStateNumber();
	const [heroInstanceID] = useStateDynamicValue();
	const [isHeroesIn, setIsHeroesIn] = useStateBool();
	const [heroesInSelection, setHeroesInSelection] = useStateNumber();
	const [selectionHeroesType, setSelectionHeroesType] = useStateNumber();
	const [heroesNamed] = useStateDynamicValue();
	const [heroesAreInTeamSelection, setHeroesAreInTeamSelection] = useStateNumber();
	const [heroesAbleSkillID] = useStateDynamicValue();
	const [selectionHeroesEquipedType, setSelectionHeroesEquipedType] = useStateNumber();
	const [heroesEquipedWeaponID] = useStateDynamicValue();
	const [heroesEquipedArmorID] = useStateDynamicValue();
	const [heroesUnderEffectStatusID] = useStateDynamicValue();
	const [heroesHaveStatisticID] = useStateDynamicValue();
	const [heroesHaveStatisticCompare, setHeroesHaveStatisticCompare] = useStateNumber();
	const [heroesHaveStatisticCompareValue] = useStateDynamicValue();
	const [currencyID] = useStateDynamicValue();
	const [currencyCompare, setCurrencyCompare] = useStateNumber();
	const [currencyCompareValue] = useStateDynamicValue();
	const [itemID] = useStateDynamicValue();
	const [itemCompare, setItemCompare] = useStateNumber();
	const [itemCompareValue] = useStateDynamicValue();
	const [weaponID] = useStateDynamicValue();
	const [weaponCompare, setWeaponCompare] = useStateNumber();
	const [weaponCompareValue] = useStateDynamicValue();
	const [isCheckWeaponEquiped, setIsCheckWeaponEquiped] = useStateBool();
	const [armorID] = useStateDynamicValue();
	const [armorCompare, setArmorCompare] = useStateNumber();
	const [armorCompareValue] = useStateDynamicValue();
	const [isCheckArmorEquiped, setIsCheckArmorEquiped] = useStateBool();
	const [keyID] = useStateDynamicValue();
	const [keyValue] = useStateDynamicValue();
	const [objectLookingID] = useStateDynamicValue();
	const [objectLookingOrientationSelection, setObjectLookingOrientationSelection] = useStateNumber();
	const [objectClimbingID] = useStateDynamicValue();
	const [chronometerID] = useStateDynamicValue();
	const [chronometerCompare, setChronometerCompare] = useStateNumber();
	const [chronometerCompareValue] = useStateDynamicValue();
	const [script] = useStateDynamicValue();
	const [isAddElse, setIsAddElse] = useStateBool();
	const [conditionTree, setConditionTree] = useState<ConditionTree>({ condition: [] });
	const [selectedConditionPath, setSelectedConditionPath] = useState<number[]>([]);
	const [, setTrigger] = useStateBool();

	const isVariableParamProp = selectionType === SELECTION_TYPE.VARIABLE_PARAM_PROP;
	const isHeroes = selectionType === SELECTION_TYPE.HEROES;
	const isHeroesNamed = isHeroes && selectionHeroesType === SELECTION_HEROES_TYPE.ARE_NAMED;
	const isHeroesInTeam = isHeroes && selectionHeroesType === SELECTION_HEROES_TYPE.ARE_IN_TEAM;
	const isHeroesAbleSkill = isHeroes && selectionHeroesType === SELECTION_HEROES_TYPE.ARE_ABLE_SKILL;
	const isHeroesEquipedWith = isHeroes && selectionHeroesType === SELECTION_HEROES_TYPE.ARE_EQUIPED_WITH;
	const isHeroesEquipedWithWeapon =
		isHeroesEquipedWith && selectionHeroesEquipedType === SELECTION_HEROES_EQUIPED_TYPE.WEAPON;
	const isHeroesEquipedWithArmor =
		isHeroesEquipedWith && selectionHeroesEquipedType === SELECTION_HEROES_EQUIPED_TYPE.ARMOR;
	const isHeroesUnderEffectStatus = isHeroes && selectionHeroesType === SELECTION_HEROES_TYPE.ARE_UNDER_EFFECT_STATUS;
	const isHeroesHaveStatistic = isHeroes && selectionHeroesType === SELECTION_HEROES_TYPE.HAVE_STATISTIC;
	const isCurrency = selectionType === SELECTION_TYPE.CURRENCY;
	const isItem = selectionType === SELECTION_TYPE.ITEM;
	const isWeapon = selectionType === SELECTION_TYPE.WEAPON;
	const isArmor = selectionType === SELECTION_TYPE.ARMOR;
	const isKey = selectionType === SELECTION_TYPE.KEY;
	const isObjectLooking = selectionType === SELECTION_TYPE.OBJECT_LOOKING;
	const isObjectClimbing = selectionType === SELECTION_TYPE.OBJECT_CLIMBING;
	const isChronometer = selectionType === SELECTION_TYPE.CHRONOMETER;
	const isScript = selectionType === SELECTION_TYPE.SCRIPT;
	const compareOptions = Model.Base.getCompareOptions();
	const objectsList = Scene.Map.getCurrentMapObjectsList();

	const initialize = (conditionList: MapObjectCommandType[] | null | undefined = undefined, keepElse = false) => {
		let list = conditionList === undefined ? commandList : conditionList;
		const isTree = !keepElse && list?.[1] === CONDITION_TREE_KIND;
		if (isTree) {
			const tree = list![2] as unknown as {
				operator: CONDITION_OPERATOR;
				conditions?: MapObjectCommandType[][];
				children?: ConditionTree[];
			};
			const root: ConditionTree = tree.children
				? { operator: tree.operator, children: tree.children }
				: { operator: tree.operator, children: tree.conditions!.map((condition) => ({ condition })) };
			const path = getFirstConditionPath(root);
			setConditionTree(root);
			setSelectedConditionPath(path);
			list = [list![0], ...getConditionTree(root, path).condition!];
		}
		variableParamProp.updateToDefaultVariable();
		setVariableParamPropCompare(OPERATION_KIND.EQUAL_TO);
		variableParamPropCompareValue.updateToDefaultNumber(0, true);
		setHeroesSelection(CONDITION_HEROES_KIND.ALL_THE_HEROES);
		heroInstanceID.updateToDefaultVariable();
		setIsHeroesIn(false);
		setHeroesInSelection(0);
		setSelectionHeroesType(SELECTION_HEROES_TYPE.ARE_NAMED);
		heroesNamed.updateToDefaultText();
		setHeroesAreInTeamSelection(0);
		heroesAbleSkillID.updateToDefaultDatabase(Project.current!.skills.list);
		setSelectionHeroesEquipedType(SELECTION_HEROES_EQUIPED_TYPE.WEAPON);
		heroesEquipedWeaponID.updateToDefaultDatabase(Project.current!.weapons.list);
		heroesEquipedArmorID.updateToDefaultDatabase(Project.current!.armors.list);
		heroesUnderEffectStatusID.updateToDefaultDatabase(Project.current!.status.list);
		heroesHaveStatisticID.updateToDefaultDatabase(Project.current!.battleSystem.statistics);
		setHeroesHaveStatisticCompare(OPERATION_KIND.EQUAL_TO);
		heroesHaveStatisticCompareValue.updateToDefaultNumber(0, true);
		currencyID.updateToDefaultDatabase(Project.current!.systems.currencies);
		setCurrencyCompare(OPERATION_KIND.EQUAL_TO);
		currencyCompareValue.updateToDefaultNumber(0, true);
		itemID.updateToDefaultDatabase(Project.current!.items.list);
		setItemCompare(OPERATION_KIND.EQUAL_TO);
		itemCompareValue.updateToDefaultNumber(0, true);
		weaponID.updateToDefaultDatabase(Project.current!.weapons.list);
		setWeaponCompare(OPERATION_KIND.EQUAL_TO);
		weaponCompareValue.updateToDefaultNumber(0, true);
		setIsCheckWeaponEquiped(false);
		armorID.updateToDefaultDatabase(Project.current!.armors.list);
		setArmorCompare(OPERATION_KIND.EQUAL_TO);
		armorCompareValue.updateToDefaultNumber(0, true);
		setIsCheckArmorEquiped(false);
		keyID.updateToDefaultDatabase(Project.current!.keyboard.list);
		keyValue.updateToDefaultSwitch();
		objectLookingID.updateToDefaultDatabase(-1);
		setObjectLookingOrientationSelection(0);
		objectClimbingID.updateToDefaultDatabase(-1);
		chronometerID.updateToDefaultVariable();
		setChronometerCompare(OPERATION_KIND.EQUAL_TO);
		chronometerCompareValue.updateToDefaultNumber();
		script.updateToDefaultFormula();
		if (list?.length) {
			const iterator = Utils.generateIterator();
			if (!keepElse) {
				setIsAddElse(Utils.initializeBoolCommand(list, iterator));
			} else {
				iterator.i++;
			}
			const selection = list[iterator.i++] as SELECTION_TYPE;
			setForcedTabIndex(getTabIndex(selection));
			setSelectionType(selection);
			switch (selection) {
				case SELECTION_TYPE.VARIABLE_PARAM_PROP:
					variableParamProp.updateCommand(list, iterator);
					setVariableParamPropCompare(list[iterator.i++] as number);
					variableParamPropCompareValue.updateCommand(list, iterator);
					break;
				case SELECTION_TYPE.HEROES: {
					const hSelection = list[iterator.i++] as number;
					setHeroesSelection(hSelection);
					if (hSelection === CONDITION_HEROES_KIND.THE_HERO_WITH_INSTANCE_ID) {
						heroInstanceID.updateCommand(list, iterator);
					}
					const checked = Utils.initializeBoolCommand(list, iterator);
					setIsHeroesIn(checked);
					if (checked) {
						setHeroesInSelection(list[iterator.i++] as number);
					}
					const selectionHeroes = list[iterator.i++] as SELECTION_HEROES_TYPE;
					setSelectionHeroesType(selectionHeroes);
					switch (selectionHeroes) {
						case SELECTION_HEROES_TYPE.ARE_NAMED:
							heroesNamed.updateCommand(list, iterator);
							break;
						case SELECTION_HEROES_TYPE.ARE_IN_TEAM:
							setHeroesAreInTeamSelection(list[iterator.i++] as number);
							break;
						case SELECTION_HEROES_TYPE.ARE_ABLE_SKILL:
							heroesAbleSkillID.updateCommand(list, iterator);
							break;
						case SELECTION_HEROES_TYPE.ARE_EQUIPED_WITH: {
							const selectionHeroesEquiped = list[iterator.i++] as SELECTION_HEROES_EQUIPED_TYPE;
							setSelectionHeroesEquipedType(selectionHeroesEquiped);
							switch (selectionHeroesEquiped) {
								case SELECTION_HEROES_EQUIPED_TYPE.WEAPON:
									heroesEquipedWeaponID.updateCommand(list, iterator);
									break;
								case SELECTION_HEROES_EQUIPED_TYPE.ARMOR:
									heroesEquipedArmorID.updateCommand(list, iterator);
									break;
							}
							break;
						}
						case SELECTION_HEROES_TYPE.ARE_UNDER_EFFECT_STATUS:
							heroesUnderEffectStatusID.updateCommand(list, iterator);
							break;
						case SELECTION_HEROES_TYPE.HAVE_STATISTIC:
							heroesHaveStatisticID.updateCommand(list, iterator);
							setHeroesHaveStatisticCompare(list[iterator.i++] as number);
							heroesHaveStatisticCompareValue.updateCommand(list, iterator);
							break;
					}
					break;
				}
				case SELECTION_TYPE.CURRENCY:
					currencyID.updateCommand(list, iterator);
					setCurrencyCompare(list[iterator.i++] as number);
					currencyCompareValue.updateCommand(list, iterator);
					break;
				case SELECTION_TYPE.ITEM:
					itemID.updateCommand(list, iterator);
					setItemCompare(list[iterator.i++] as number);
					itemCompareValue.updateCommand(list, iterator);
					break;
				case SELECTION_TYPE.WEAPON:
					weaponID.updateCommand(list, iterator);
					setWeaponCompare(list[iterator.i++] as number);
					weaponCompareValue.updateCommand(list, iterator);
					setIsCheckWeaponEquiped(Utils.initializeBoolCommand(list, iterator));
					break;
				case SELECTION_TYPE.ARMOR:
					armorID.updateCommand(list, iterator);
					setArmorCompare(list[iterator.i++] as number);
					armorCompareValue.updateCommand(list, iterator);
					setIsCheckArmorEquiped(Utils.initializeBoolCommand(list, iterator));
					break;
				case SELECTION_TYPE.KEY:
					keyID.updateCommand(list, iterator);
					keyValue.updateCommand(list, iterator);
					break;
				case SELECTION_TYPE.OBJECT_LOOKING:
					objectLookingID.updateCommand(list, iterator);
					setObjectLookingOrientationSelection(list[iterator.i++] as number);
					break;
				case SELECTION_TYPE.OBJECT_CLIMBING:
					objectClimbingID.updateCommand(list, iterator);
					break;
				case SELECTION_TYPE.CHRONOMETER:
					chronometerID.updateCommand(list, iterator);
					setChronometerCompare(list[iterator.i++] as number);
					chronometerCompareValue.updateCommand(list, iterator);
					break;
				case SELECTION_TYPE.SCRIPT:
					script.updateCommand(list, iterator);
					break;
			}
		} else {
			setSelectionType(SELECTION_TYPE.VARIABLE_PARAM_PROP);
			setForcedTabIndex(0);
			if (!keepElse) {
				setIsAddElse(false);
			}
		}
		if (!keepElse && !isTree) {
			setConditionTree({ condition: list?.length ? list.slice(1) : [] });
			setSelectedConditionPath([]);
		}
		setTrigger((v) => !v);
	};

	const getTabIndex = (selection: SELECTION_TYPE): number => {
		switch (selection) {
			case SELECTION_TYPE.VARIABLE_PARAM_PROP:
				return 0;
			case SELECTION_TYPE.HEROES:
				return 1;
			case SELECTION_TYPE.CURRENCY:
			case SELECTION_TYPE.ITEM:
			case SELECTION_TYPE.WEAPON:
			case SELECTION_TYPE.ARMOR:
				return 2;
			case SELECTION_TYPE.KEY:
			case SELECTION_TYPE.OBJECT_LOOKING:
			case SELECTION_TYPE.OBJECT_CLIMBING:
			case SELECTION_TYPE.CHRONOMETER:
			case SELECTION_TYPE.ESCAPED_LAST_BATTLE:
			case SELECTION_TYPE.SCRIPT:
				return 3;
		}
	};

	const getCurrentCondition = (): MapObjectCommandType[] => {
		const newList: MapObjectCommandType[] = [];
		newList.push(selectionType);
		switch (selectionType) {
			case SELECTION_TYPE.VARIABLE_PARAM_PROP:
				variableParamProp.getCommand(newList);
				newList.push(variableParamPropCompare);
				variableParamPropCompareValue.getCommand(newList);
				break;
			case SELECTION_TYPE.HEROES:
				newList.push(heroesSelection);
				if (heroesSelection === CONDITION_HEROES_KIND.THE_HERO_WITH_INSTANCE_ID) {
					heroInstanceID.getCommand(newList);
				}
				newList.push(Utils.boolToNum(isHeroesIn));
				if (isHeroesIn) {
					newList.push(heroesInSelection);
				}
				newList.push(selectionHeroesType);
				switch (selectionHeroesType) {
					case SELECTION_HEROES_TYPE.ARE_NAMED:
						heroesNamed.getCommand(newList);
						break;
					case SELECTION_HEROES_TYPE.ARE_IN_TEAM:
						newList.push(heroesAreInTeamSelection);
						break;
					case SELECTION_HEROES_TYPE.ARE_ABLE_SKILL:
						heroesAbleSkillID.getCommand(newList);
						break;
					case SELECTION_HEROES_TYPE.ARE_EQUIPED_WITH:
						newList.push(selectionHeroesEquipedType);
						switch (selectionHeroesEquipedType) {
							case SELECTION_HEROES_EQUIPED_TYPE.WEAPON:
								heroesEquipedWeaponID.getCommand(newList);
								break;
							case SELECTION_HEROES_EQUIPED_TYPE.ARMOR:
								heroesEquipedArmorID.getCommand(newList);
								break;
						}
						break;
					case SELECTION_HEROES_TYPE.ARE_UNDER_EFFECT_STATUS:
						heroesUnderEffectStatusID.getCommand(newList);
						break;
					case SELECTION_HEROES_TYPE.HAVE_STATISTIC:
						heroesHaveStatisticID.getCommand(newList);
						newList.push(heroesHaveStatisticCompare);
						heroesHaveStatisticCompareValue.getCommand(newList);
						break;
				}
				break;
			case SELECTION_TYPE.CURRENCY:
				currencyID.getCommand(newList);
				newList.push(currencyCompare);
				currencyCompareValue.getCommand(newList);
				break;
			case SELECTION_TYPE.ITEM:
				itemID.getCommand(newList);
				newList.push(itemCompare);
				itemCompareValue.getCommand(newList);
				break;
			case SELECTION_TYPE.WEAPON:
				weaponID.getCommand(newList);
				newList.push(weaponCompare);
				weaponCompareValue.getCommand(newList);
				newList.push(Utils.boolToNum(isCheckWeaponEquiped));
				break;
			case SELECTION_TYPE.ARMOR:
				armorID.getCommand(newList);
				newList.push(armorCompare);
				armorCompareValue.getCommand(newList);
				newList.push(Utils.boolToNum(isCheckArmorEquiped));
				break;
			case SELECTION_TYPE.KEY:
				keyID.getCommand(newList);
				keyValue.getCommand(newList);
				break;
			case SELECTION_TYPE.OBJECT_LOOKING:
				objectLookingID.getCommand(newList);
				newList.push(objectLookingOrientationSelection);
				break;
			case SELECTION_TYPE.OBJECT_CLIMBING:
				objectClimbingID.getCommand(newList);
				break;
			case SELECTION_TYPE.CHRONOMETER:
				chronometerID.getCommand(newList);
				newList.push(chronometerCompare);
				chronometerCompareValue.getCommand(newList);
				break;
			case SELECTION_TYPE.SCRIPT:
				script.getCommand(newList);
				break;
		}
		return newList;
	};

	const saveCurrentCondition = () =>
		replaceConditionTree(conditionTree, selectedConditionPath, { condition: getCurrentCondition() });

	const handleCurrentConditionChanged = () => setTrigger((v) => !v);

	const handleClickCondition = (path: number[]) => {
		if (path.join() === selectedConditionPath.join()) {
			return;
		}
		const tree = saveCurrentCondition();
		setConditionTree(tree);
		setSelectedConditionPath(path);
		initialize([Utils.boolToNum(isAddElse), ...getConditionTree(tree, path).condition!], true);
	};

	const handleAddCondition = (path: number[]) => {
		const tree = saveCurrentCondition();
		const group = getConditionTree(tree, path);
		const childPath = [...path, group.children!.length];
		const nextTree = replaceConditionTree(tree, path, {
			...group,
			children: [...group.children!, { condition: [] }],
		});
		setConditionTree(nextTree);
		setSelectedConditionPath(childPath);
		initialize(null, true);
	};

	const handleAddParent = (path: number[]) => {
		const tree = saveCurrentCondition();
		const nextTree = replaceConditionTree(tree, path, {
			operator: CONDITION_OPERATOR.AND,
			children: [getConditionTree(tree, path), { condition: [] }],
		});
		setConditionTree(nextTree);
		setSelectedConditionPath([...path, 1]);
		initialize(null, true);
	};

	const handleRemoveCondition = (path: number[]) => {
		const tree = removeConditionTree(saveCurrentCondition(), path);
		if (!tree) {
			return;
		}
		const nextPath = getFirstConditionPath(tree);
		setConditionTree(tree);
		setSelectedConditionPath(nextPath);
		initialize([Utils.boolToNum(isAddElse), ...getConditionTree(tree, nextPath).condition!], true);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const tree = saveCurrentCondition();
		const newList: MapObjectCommandType[] = [Utils.boolToNum(isAddElse)];
		if (isConditionGroup(tree)) {
			newList.push(CONDITION_TREE_KIND, {
				operator: tree.operator,
				children: tree.children,
			} as unknown as JSONType);
		} else {
			newList.push(...tree.condition!);
		}
		onAccept(Model.MapObjectCommand.createCommand(commandKind, newList));
	};

	const handleReject = async () => {
		setIsOpen(false);
		onReject();
	};

	useLayoutEffect(() => {
		initialize();
	}, []);

	const handleChangeOperator = (path: number[], operator: CONDITION_OPERATOR) => {
		const tree = saveCurrentCondition();
		setConditionTree(replaceConditionTree(tree, path, { ...getConditionTree(tree, path), operator }));
	};

	const getConditionLabel = (condition: MapObjectCommandType[]) => {
		const command = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.IF, [0, ...condition]);
		const label = command.toStringIf(
			Utils.generateIterator(),
			Project.current!.currentMapObjectProperties.map((node) => node.content),
			Project.current!.currentMapObjectParameters,
		)[0];
		return label.slice(label.indexOf('(') + 1, -1);
	};

	const getConditionTreeContent = (tree: ConditionTree, path: number[] = []): ReactNode => {
		if (!isConditionGroup(tree)) {
			const label = getConditionLabel(
				path.join() === selectedConditionPath.join() ? getCurrentCondition() : tree.condition!,
			);
			return (
				<Flex column centerH centerV spaced key={path.join()} className='conditionTreeLeaf'>
					<Button
						active={path.join() === selectedConditionPath.join()}
						onClick={() => handleClickCondition(path)}
						onClose={path.length > 0 ? () => handleRemoveCondition(path) : undefined}
						title={label}
					>
						<span className='conditionTreeLabel'>{label}</span>
					</Button>
					<Button onClick={() => handleAddParent(path)}>+</Button>
				</Flex>
			);
		}
		return (
			<Flex
				column
				centerH
				centerV
				key={path.join()}
				className={path.length === 0 ? 'conditionTreeRoot' : undefined}
			>
				<div className='conditionTreeParentControl'>
					<Dropdown
						selectedID={tree.operator}
						onChange={(operator) => handleChangeOperator(path, operator as CONDITION_OPERATOR)}
						options={[
							Model.Base.create(CONDITION_OPERATOR.AND, t('and').toUpperCase()),
							Model.Base.create(CONDITION_OPERATOR.OR, t('or').toUpperCase()),
						]}
					/>
					<Button className='conditionTreeAddCondition' onClick={() => handleAddCondition(path)}>
						+
					</Button>
				</div>
				<div className='conditionTreeParentLine' />
				<Flex centerH className='flexTopVertically'>
					<Flex
						centerH
						className={
							tree.children.length > 1
								? 'conditionTreeChildren conditionTreeChildrenMultiple'
								: 'conditionTreeChildren'
						}
					>
						{tree.children.map((child, index) => (
							<div className='conditionTreeChild' key={index}>
								{getConditionTreeContent(child, [...path, index])}
							</div>
						))}
					</Flex>
				</Flex>
			</Flex>
		);
	};

	const getVariablesParamPropContent = () => (
		<Flex column spacedLarge key={0}>
			<Flex spaced centerV>
				<RadioButton value={SELECTION_TYPE.VARIABLE_PARAM_PROP}>{t('this')}</RadioButton>
				<DynamicValueSelector
					value={variableParamProp}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.VARIABLE_PARAM_PROP}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					disabled={!isVariableParamProp}
				/>
				<Flex disabledLabel>{t('is').toLowerCase()}</Flex>
			</Flex>
			<Flex spaced centerV>
				<Flex fillSmallSpace />
				<Dropdown
					selectedID={variableParamPropCompare}
					onChange={setVariableParamPropCompare}
					options={compareOptions}
					disabled={!isVariableParamProp}
				/>
				<DynamicValueSelector
					value={variableParamPropCompareValue}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.PARAMETER}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					disabled={!isVariableParamProp}
				/>
			</Flex>
		</Flex>
	);

	const getHeroesContent = () => (
		<Flex column spacedLarge key={1}>
			<Flex spaced centerV>
				<RadioButton value={SELECTION_TYPE.HEROES}>{t('hero.maybe.more')}</RadioButton>
				<Dropdown
					selectedID={heroesSelection}
					onChange={setHeroesSelection}
					options={Model.Base.HEROES_OPTIONS}
					disabled={!isHeroes}
					translateOptions
				/>
				{heroesSelection === CONDITION_HEROES_KIND.THE_HERO_WITH_INSTANCE_ID && (
					<DynamicValueSelector
						value={heroInstanceID}
						optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.PARAMETER}
						onChangeKind={handleCurrentConditionChanged}
						onChangeValue={handleCurrentConditionChanged}
						disabled={!isHeroes}
					/>
				)}
			</Flex>
			<Flex spaced centerV>
				<Flex fillSmallSpace />
				<Checkbox isChecked={isHeroesIn} onChange={setIsHeroesIn} disabled={!isHeroes}>
					{t('in').toLowerCase()}
				</Checkbox>
				<Dropdown
					selectedID={heroesInSelection}
					onChange={setHeroesInSelection}
					options={Model.Base.TEAM_OPTIONS}
					disabled={!isHeroes || !isHeroesIn}
					translateOptions
				/>
			</Flex>
			<RadioGroup selected={selectionHeroesType} onChange={setSelectionHeroesType}>
				<Flex column spacedLarge>
					<Flex spaced centerV>
						<Flex fillSmallSpace />
						<RadioButton value={SELECTION_HEROES_TYPE.ARE_NAMED} disabled={!isHeroes}>
							{t('are.named')}
						</RadioButton>
						<DynamicValueSelector
							value={heroesNamed}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.TEXT}
							onChangeKind={handleCurrentConditionChanged}
							onChangeValue={handleCurrentConditionChanged}
							disabled={!isHeroesNamed}
						/>
					</Flex>
					<Flex spaced centerV>
						<Flex fillSmallSpace />
						<RadioButton value={SELECTION_HEROES_TYPE.ARE_IN_TEAM} disabled={!isHeroes}>
							{t('are.in')}
						</RadioButton>
						<Dropdown
							selectedID={heroesAreInTeamSelection}
							onChange={setHeroesAreInTeamSelection}
							options={Model.Base.TEAM_OPTIONS}
							disabled={!isHeroesInTeam}
							translateOptions
						/>
					</Flex>
					<Flex spaced centerV>
						<Flex fillSmallSpace />
						<RadioButton value={SELECTION_HEROES_TYPE.ARE_ABLE_SKILL} disabled={!isHeroes}>
							{t('are.able.skill.id')}
						</RadioButton>
						<DynamicValueSelector
							value={heroesAbleSkillID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							onChangeKind={handleCurrentConditionChanged}
							onChangeValue={handleCurrentConditionChanged}
							databaseOptions={Project.current!.skills.list}
							disabled={!isHeroesAbleSkill}
						/>
					</Flex>
					<Flex spaced centerV>
						<Flex fillSmallSpace />
						<RadioButton value={SELECTION_HEROES_TYPE.ARE_EQUIPED_WITH} disabled={!isHeroes}>
							{t('are.equiped.with')}
						</RadioButton>
						<RadioGroup selected={selectionHeroesEquipedType} onChange={setSelectionHeroesEquipedType}>
							<Form>
								<Label disabled={!isHeroesEquipedWith}>
									<RadioButton value={SELECTION_HEROES_EQUIPED_TYPE.WEAPON}>
										{t('weapon.id')}
									</RadioButton>
								</Label>
								<Value>
									<DynamicValueSelector
										value={heroesEquipedWeaponID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										onChangeKind={handleCurrentConditionChanged}
										onChangeValue={handleCurrentConditionChanged}
										databaseOptions={Project.current!.weapons.list}
										disabled={!isHeroesEquipedWithWeapon}
									/>
								</Value>
								<Label disabled={!isHeroesEquipedWith}>
									<RadioButton value={SELECTION_HEROES_EQUIPED_TYPE.ARMOR}>
										{t('armor.id')}
									</RadioButton>
								</Label>
								<Value>
									<DynamicValueSelector
										value={heroesEquipedArmorID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
										onChangeKind={handleCurrentConditionChanged}
										onChangeValue={handleCurrentConditionChanged}
										databaseOptions={Project.current!.armors.list}
										disabled={!isHeroesEquipedWithArmor}
									/>
								</Value>
							</Form>
						</RadioGroup>
					</Flex>
					<Flex spaced centerV>
						<Flex fillSmallSpace />
						<RadioButton value={SELECTION_HEROES_TYPE.ARE_UNDER_EFFECT_STATUS} disabled={!isHeroes}>
							{t('are.under.effect.status.id')}
						</RadioButton>
						<DynamicValueSelector
							value={heroesUnderEffectStatusID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							onChangeKind={handleCurrentConditionChanged}
							onChangeValue={handleCurrentConditionChanged}
							databaseOptions={Project.current!.status.list}
							disabled={!isHeroesUnderEffectStatus}
						/>
					</Flex>
					<Flex spaced centerV>
						<Flex fillSmallSpace />
						<RadioButton value={SELECTION_HEROES_TYPE.HAVE_STATISTIC} disabled={!isHeroes}>
							{t('have.statistic.id')}
						</RadioButton>
						<DynamicValueSelector
							value={heroesHaveStatisticID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
							onChangeKind={handleCurrentConditionChanged}
							onChangeValue={handleCurrentConditionChanged}
							databaseOptions={Project.current!.battleSystem.statistics}
							disabled={!isHeroesHaveStatistic}
						/>
					</Flex>
					<Flex spaced centerV>
						<Flex fillSmallSpace />
						<Flex fillSmallSpace />
						<Dropdown
							selectedID={heroesHaveStatisticCompare}
							onChange={setHeroesHaveStatisticCompare}
							options={compareOptions}
							disabled={!isHeroesHaveStatistic}
						/>
						<DynamicValueSelector
							value={heroesHaveStatisticCompareValue}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.PARAMETER}
							onChangeKind={handleCurrentConditionChanged}
							onChangeValue={handleCurrentConditionChanged}
							disabled={!isHeroesHaveStatistic}
						/>
					</Flex>
				</Flex>
			</RadioGroup>
		</Flex>
	);

	const getPossessionsContent = () => (
		<Flex column spacedLarge key={2}>
			<Flex spaced centerV>
				<RadioButton value={SELECTION_TYPE.CURRENCY}>{t('currency.id')}:</RadioButton>
				<DynamicValueSelector
					value={currencyID}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					databaseOptions={Project.current!.systems.currencies}
					disabled={!isCurrency}
				/>
			</Flex>
			<Flex spaced centerV>
				<Flex fillSmallSpace />
				<Dropdown
					selectedID={currencyCompare}
					onChange={setCurrencyCompare}
					options={compareOptions}
					disabled={!isCurrency}
				/>
				<DynamicValueSelector
					value={currencyCompareValue}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.PARAMETER}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					disabled={!isCurrency}
				/>
			</Flex>
			<Flex spaced centerV>
				<RadioButton value={SELECTION_TYPE.ITEM}>{t('item.id')}:</RadioButton>
				<DynamicValueSelector
					value={itemID}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					databaseOptions={Project.current!.items.list}
					disabled={!isItem}
				/>
			</Flex>
			<Flex spaced centerV>
				<Flex fillSmallSpace />
				<Dropdown
					selectedID={itemCompare}
					onChange={setItemCompare}
					options={compareOptions}
					disabled={!isItem}
				/>
				<DynamicValueSelector
					value={itemCompareValue}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.PARAMETER}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					disabled={!isItem}
				/>
			</Flex>
			<Flex spaced centerV>
				<RadioButton value={SELECTION_TYPE.WEAPON}>{t('weapon.id')}:</RadioButton>
				<DynamicValueSelector
					value={weaponID}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					databaseOptions={Project.current!.weapons.list}
					disabled={!isWeapon}
				/>
			</Flex>
			<Flex spaced centerV>
				<Flex fillSmallSpace />
				<Dropdown
					selectedID={weaponCompare}
					onChange={setWeaponCompare}
					options={compareOptions}
					disabled={!isWeapon}
				/>
				<DynamicValueSelector
					value={weaponCompareValue}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.PARAMETER}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					disabled={!isWeapon}
				/>
			</Flex>
			<Flex spaced centerV>
				<Flex fillSmallSpace />
				<Checkbox isChecked={isCheckWeaponEquiped} onChange={setIsCheckWeaponEquiped} disabled={!isWeapon}>
					{t('check.weapons.equiped.too')}
				</Checkbox>
			</Flex>
			<Flex spaced centerV>
				<RadioButton value={SELECTION_TYPE.ARMOR}>{t('armor.id')}:</RadioButton>
				<DynamicValueSelector
					value={armorID}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					databaseOptions={Project.current!.armors.list}
					disabled={!isArmor}
				/>
			</Flex>
			<Flex spaced centerV>
				<Flex fillSmallSpace />
				<Dropdown
					selectedID={armorCompare}
					onChange={setArmorCompare}
					options={compareOptions}
					disabled={!isArmor}
				/>
				<DynamicValueSelector
					value={armorCompareValue}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.PARAMETER}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					disabled={!isArmor}
				/>
			</Flex>
			<Flex spaced centerV>
				<Flex fillSmallSpace />
				<Checkbox isChecked={isCheckArmorEquiped} onChange={setIsCheckArmorEquiped} disabled={!isArmor}>
					{t('check.armors.equiped.too')}
				</Checkbox>
			</Flex>
		</Flex>
	);

	const getOthersContent = () => (
		<Flex column spacedLarge key={3}>
			<Flex spaced centerV>
				<RadioButton value={SELECTION_TYPE.KEY}>{t('key.id')}:</RadioButton>
				<DynamicValueSelector
					value={keyID}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					databaseOptions={Project.current!.keyboard.list}
					disabled={!isKey}
				/>
				<Flex disabledLabel={!isKey}>{t('is').toLowerCase()}</Flex>
				<DynamicValueSelector
					value={keyValue}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.SWITCH}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					disabled={!isKey}
				/>
			</Flex>
			<Flex spaced centerV>
				<RadioButton value={SELECTION_TYPE.OBJECT_LOOKING}>{t('object.id')}:</RadioButton>
				<DynamicValueSelector
					value={objectLookingID}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					databaseOptions={objectsList}
					disabled={!isObjectLooking}
				/>
				<Flex disabledLabel={!isObjectLooking}>{t('is.looking.at').toLowerCase()}</Flex>
				<Dropdown
					selectedID={objectLookingOrientationSelection}
					onChange={setObjectLookingOrientationSelection}
					options={Model.Base.ORIENTATION_OPTIONS}
					disabled={!isObjectLooking}
					translateOptions
				/>
			</Flex>
			<Flex spaced centerV>
				<RadioButton value={SELECTION_TYPE.OBJECT_CLIMBING}>{t('object.id')}:</RadioButton>
				<DynamicValueSelector
					value={objectClimbingID}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					databaseOptions={objectsList}
					disabled={!isObjectClimbing}
				/>
				<Flex disabledLabel={!isObjectClimbing}>{t('is.climbing').toLowerCase()}</Flex>
			</Flex>
			<Flex spaced centerV>
				<RadioButton value={SELECTION_TYPE.CHRONOMETER}>{t('chronometer.id')}:</RadioButton>
				<DynamicValueSelector
					value={chronometerID}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					disabled={!isChronometer}
				/>
				<Dropdown
					selectedID={chronometerCompare}
					onChange={setChronometerCompare}
					options={compareOptions}
					disabled={!isChronometer}
				/>
			</Flex>
			<Flex spaced centerV>
				<Flex fillSmallSpace />
				<DynamicValueSelector
					value={chronometerCompareValue}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					disabled={!isChronometer}
				/>
				<Flex disabledLabel={!isChronometer}>{t('seconds').toLowerCase()}</Flex>
			</Flex>
			<RadioButton value={SELECTION_TYPE.ESCAPED_LAST_BATTLE}>{t('escaped.last.battle')}</RadioButton>
			<Flex spaced centerV>
				<RadioButton value={SELECTION_TYPE.SCRIPT}>{t('script')}:</RadioButton>
				<DynamicValueSelector
					value={script}
					optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.FORMULA}
					onChangeKind={handleCurrentConditionChanged}
					onChangeValue={handleCurrentConditionChanged}
					disabled={!isScript}
					isTextarea
					fillWidth
				/>
			</Flex>
		</Flex>
	);

	return (
		<Dialog
			title={`${t('condition')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='800px'
			initialHeight='500px'
			widthRefreshKey={JSON.stringify([conditionTree, currentTabIndex])}
			widthRefreshPadding={40}
			heightRefreshKey={JSON.stringify([conditionTree, currentTabIndex])}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge>
				{getConditionTreeContent(conditionTree)}
				<RadioGroup selected={selectionType} onChange={setSelectionType}>
					<Tab
						hideScroll
						titles={[
							Model.Base.create(1, t('variables.param.prop')),
							Model.Base.create(2, t('heroes')),
							Model.Base.create(3, t('possessions')),
							Model.Base.create(4, t('others')),
						]}
						contents={[
							getVariablesParamPropContent(),
							getHeroesContent(),
							getPossessionsContent(),
							getOthersContent(),
						]}
						forcedCurrentIndex={forcedTabIndex}
						setForcedCurrentIndex={setForcedTabIndex}
						onCurrentIndexChanged={setCurrentTabIndex}
						padding
					/>
				</RadioGroup>
				<Checkbox isChecked={isAddElse} onChange={setIsAddElse}>
					{t('add.else.conditions.not.apply')}
				</Checkbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandIf;
