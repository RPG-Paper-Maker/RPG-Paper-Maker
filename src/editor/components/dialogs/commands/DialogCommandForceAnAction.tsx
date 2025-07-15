/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_OPTIONS_TYPE, MONSTER_ACTION_KIND, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { Base, MapObjectCommandType } from '../../../models';
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

enum SELECTION_TARGET_KIND {
	RANDOM,
	LAST_TARGET,
	CUSTOM,
}

function DialogCommandForceAndAction({ commandKind, isOpen, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const panelSelectionHeroRef = useRef<PanelSelectionHeroRef>(null);
	const panelSelectionHeroTargetRef = useRef<PanelSelectionHeroRef>(null);

	const [action, setAction] = useStateNumber();
	const [skillID] = useStateDynamicValue();
	const [itemID] = useStateDynamicValue();
	const [targetKind, setTargetKind] = useStateNumber();
	const [useBattlerTurn, setUseBattlerTurn] = useStateBool();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		skillID.updateToDefaultDatabase();
		itemID.updateToDefaultDatabase();
		if (list) {
			const iterator = Utils.generateIterator();
			panelSelectionHeroRef.current?.initialize(list, iterator);
			const a = list[iterator.i++] as MONSTER_ACTION_KIND;
			setAction(a);
			switch (a) {
				case MONSTER_ACTION_KIND.USE_SKILL:
					skillID.updateCommand(list, iterator);
					break;
				case MONSTER_ACTION_KIND.USE_ITEM:
					itemID.updateCommand(list, iterator);
					break;
			}
			const tk = list[iterator.i++] as SELECTION_TARGET_KIND;
			setTargetKind(tk);
			if (tk === SELECTION_TARGET_KIND.CUSTOM) {
				panelSelectionHeroTargetRef.current?.initialize(list, iterator);
			} else {
				panelSelectionHeroTargetRef.current?.initialize();
			}
			setUseBattlerTurn(Utils.initializeBoolCommand(list, iterator));
		} else {
			panelSelectionHeroRef.current?.initialize();
			setAction(MONSTER_ACTION_KIND.USE_SKILL);
			setTargetKind(SELECTION_TARGET_KIND.RANDOM);
			panelSelectionHeroTargetRef.current?.initialize();
			setUseBattlerTurn(false);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		panelSelectionHeroRef.current?.getCommand(newList);
		newList.push(action);
		switch (action) {
			case MONSTER_ACTION_KIND.USE_SKILL:
				skillID.getCommand(newList);
				break;
			case MONSTER_ACTION_KIND.USE_ITEM:
				itemID.getCommand(newList);
				break;
		}
		newList.push(targetKind);
		if (targetKind === SELECTION_TARGET_KIND.CUSTOM) {
			panelSelectionHeroTargetRef.current?.getCommand(newList);
		}
		newList.push(Utils.boolToNum(useBattlerTurn));
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
	}, [isOpen]);

	return (
		<Dialog
			title={`${t('force.an.action')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
		>
			<Flex column spacedLarge>
				<PanelSelectionHero ref={panelSelectionHeroRef} isEnemy />
				<Groupbox title={t('action')}>
					<Form>
						<Label>{t('use.skill.id')}</Label>
						<Value>
							<DynamicValueSelector
								value={skillID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.skills.list}
							/>
						</Value>
						<Label>{t('use.item.id')}</Label>
						<Value>
							<DynamicValueSelector
								value={itemID}
								optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
								databaseOptions={Project.current!.items.list}
							/>
						</Value>
					</Form>
				</Groupbox>
				<Groupbox title={t('target')}>
					<Flex column spaced>
						<Dropdown
							selectedID={targetKind}
							onChange={setTargetKind}
							options={Base.SELECTION_TARGET_OPTIONS}
							translateOptions
						/>
						<Flex
							one
							className={Utils.getClassName({
								visibilityHidden: targetKind !== SELECTION_TARGET_KIND.CUSTOM,
							})}
						>
							<PanelSelectionHero ref={panelSelectionHeroTargetRef} isEnemy />
						</Flex>
					</Flex>
				</Groupbox>
				<Checkbox isChecked={useBattlerTurn} onChange={setUseBattlerTurn}>
					{t('use.battler.turn')}
				</Checkbox>
			</Flex>
		</Dialog>
	); //MONSTER_ACTION_KIND
}

export default DialogCommandForceAndAction;
