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
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

enum SELECTION_TYPE {
	CREATE,
	ENEMY,
	MODIFY,
}

enum SELECTION_HERO_MONSTER_TYPE {
	HERO,
	MONSTER,
}

function DialogCommandModifyTeam({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const [selectionType, setSelectionType] = useStateNumber();
	const [createInstanceLevel] = useStateDynamicValue();
	const [createTeamSelection, setCreateTeamSelection] = useStateNumber();
	const [selectionHeroMonsterType, setSelectionHeroMonsterType] = useStateNumber();
	const [heroID] = useStateDynamicValue();
	const [monsterID] = useStateDynamicValue();
	const [createStockInstanceID] = useStateDynamicValue();
	const [enemyInstanceID] = useStateDynamicValue();
	const [enemyTeamSelection, setEnemyTeamSelection] = useStateNumber();
	const [moveRemoveSelection, setMoveRemoveSelection] = useStateNumber();
	const [modifyInstanceID] = useStateDynamicValue();
	const [modifyTeamSelection, setModifyTeamSelection] = useStateNumber();
	const [, setTrigger] = useStateBool();

	const isCreate = selectionType === SELECTION_TYPE.CREATE;
	const isHero = selectionHeroMonsterType === SELECTION_HERO_MONSTER_TYPE.HERO;
	const isMonster = selectionHeroMonsterType === SELECTION_HERO_MONSTER_TYPE.MONSTER;
	const isEnemy = selectionType === SELECTION_TYPE.ENEMY;
	const isModify = selectionType === SELECTION_TYPE.MODIFY;
	const isRemove = moveRemoveSelection === 1;

	const initialize = () => {
		createInstanceLevel.updateToDefaultNumber(1);
		heroID.updateToDefaultDatabase();
		monsterID.updateToDefaultDatabase();
		createStockInstanceID.updateToDefaultVariable();
		enemyInstanceID.updateToDefaultVariable();
		modifyInstanceID.updateToDefaultVariable();
		let cts = 0;
		let shmt = SELECTION_HERO_MONSTER_TYPE.HERO;
		let ets = 0;
		let mrs = 0;
		let mts = 0;
		if (list) {
			const iterator = Utils.generateIterator();
			const selection = list[iterator.i++] as SELECTION_TYPE;
			setSelectionType(selection);
			switch (selection) {
				case SELECTION_TYPE.CREATE:
					createInstanceLevel.updateCommand(list, iterator);
					cts = list[iterator.i++] as number;
					createStockInstanceID.updateCommand(list, iterator);
					shmt = list[iterator.i++] as SELECTION_HERO_MONSTER_TYPE;
					if (shmt === 0) {
						heroID.updateCommand(list, iterator);
					} else {
						monsterID.updateCommand(list, iterator);
					}
					break;
				case SELECTION_TYPE.ENEMY:
					enemyInstanceID.updateCommand(list, iterator);
					ets = list[iterator.i++] as number;
					break;
				case SELECTION_TYPE.MODIFY:
					mrs = list[iterator.i++] as number;
					modifyInstanceID.updateCommand(list, iterator);
					mts = list[iterator.i++] as number;
					break;
			}
		} else {
			setSelectionType(SELECTION_TYPE.CREATE);
		}
		setCreateTeamSelection(cts);
		setSelectionHeroMonsterType(shmt);
		setEnemyTeamSelection(ets);
		setMoveRemoveSelection(mrs);
		setModifyTeamSelection(mts);
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(selectionType);
		switch (selectionType) {
			case SELECTION_TYPE.CREATE:
				createInstanceLevel.getCommand(newList);
				newList.push(createTeamSelection);
				createStockInstanceID.getCommand(newList);
				newList.push(selectionHeroMonsterType);
				if (selectionHeroMonsterType === 0) {
					heroID.getCommand(newList);
				} else {
					monsterID.getCommand(newList);
				}
				break;
			case SELECTION_TYPE.ENEMY:
				enemyInstanceID.getCommand(newList);
				newList.push(enemyTeamSelection);
				break;
			case SELECTION_TYPE.MODIFY:
				newList.push(moveRemoveSelection);
				modifyInstanceID.getCommand(newList);
				newList.push(modifyTeamSelection);
				break;
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

	return (
		<Dialog
			title={`${t('modify.team')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<RadioGroup selected={selectionType} onChange={setSelectionType}>
				<Flex column spacedLarge>
					<Flex spaced>
						<RadioButton value={SELECTION_TYPE.CREATE}>{t('create.new.instance.with.level')}</RadioButton>
						<DynamicValueSelector
							value={createInstanceLevel}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							disabled={!isCreate}
						/>
						<div className={Utils.getClassName({ disabledLabel: !isCreate })}>{t('in')}</div>
						<Dropdown
							selectedID={createTeamSelection}
							onChange={setCreateTeamSelection}
							options={Model.Base.TEAM_OPTIONS}
							translateOptions
							disabled={!isCreate}
						/>
						<div className={Utils.getClassName({ disabledLabel: !isCreate })}>{t('of')}</div>
					</Flex>
					<Flex spaced>
						<Flex fillSmallSpace />
						<RadioGroup selected={selectionHeroMonsterType} onChange={setSelectionHeroMonsterType}>
							<Flex column spacedLarge>
								<Form>
									<Label>
										<RadioButton value={SELECTION_HERO_MONSTER_TYPE.HERO} disabled={!isCreate}>
											{t('hero.id')}
										</RadioButton>
									</Label>
									<Value>
										<DynamicValueSelector
											value={heroID}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
											databaseOptions={Project.current!.heroes.list}
											disabled={!isHero || !isCreate}
										/>
									</Value>
									<Label>
										<RadioButton value={SELECTION_HERO_MONSTER_TYPE.MONSTER} disabled={!isCreate}>
											{t('monster.id')}
										</RadioButton>
									</Label>
									<Value>
										<DynamicValueSelector
											value={monsterID}
											optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
											databaseOptions={Project.current!.monsters.list}
											disabled={!isMonster || !isCreate}
										/>
									</Value>
								</Form>
								<Flex spaced>
									<div className={Utils.getClassName({ disabledLabel: !isCreate })}>
										{t('stock.instance.id.in')}
									</div>
									<DynamicValueSelector
										value={createStockInstanceID}
										optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
										disabled={!isCreate}
									/>
								</Flex>
							</Flex>
						</RadioGroup>
					</Flex>
					<Flex spaced>
						<RadioButton value={SELECTION_TYPE.ENEMY}>{t('add.enemy.instance.id')}:</RadioButton>
						<DynamicValueSelector
							value={enemyInstanceID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							disabled={!isEnemy}
						/>
						<div className={Utils.getClassName({ disabledLabel: !isEnemy })}>{t('in')}</div>
						<Dropdown
							selectedID={enemyTeamSelection}
							onChange={setEnemyTeamSelection}
							options={Model.Base.TEAM_OPTIONS}
							translateOptions
							disabled={!isEnemy}
						/>
					</Flex>
					<Flex spaced>
						<RadioButton value={SELECTION_TYPE.MODIFY}>{t('Modify')}:</RadioButton>
						<Dropdown
							selectedID={moveRemoveSelection}
							onChange={setMoveRemoveSelection}
							options={Model.Base.MOVE_REMOVE_OPTIONS}
							translateOptions
							disabled={!isModify}
						/>
						<div className={Utils.getClassName({ disabledLabel: !isModify })}>
							{t('character.with.instance.id').toLowerCase()}
						</div>
						<DynamicValueSelector
							value={modifyInstanceID}
							optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.NUMBER}
							disabled={!isModify}
						/>
						<div className={Utils.getClassName({ disabledLabel: !isModify || isRemove })}>
							{t('to').toLowerCase()}
						</div>
						<Dropdown
							selectedID={modifyTeamSelection}
							onChange={setModifyTeamSelection}
							options={Model.Base.TEAM_OPTIONS}
							translateOptions
							disabled={!isModify || isRemove}
						/>
					</Flex>
				</Flex>
			</RadioGroup>
		</Dialog>
	);
}

export default DialogCommandModifyTeam;
