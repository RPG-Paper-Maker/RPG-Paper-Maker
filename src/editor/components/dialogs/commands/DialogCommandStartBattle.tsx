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
import { DYNAMIC_VALUE_OPTIONS_TYPE, Utils } from '../../../common';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateDynamicValue from '../../../hooks/useStateDynamicValue';
import useStateNumber from '../../../hooks/useStateNumber';
import { MapObjectCommandType } from '../../../models';
import Checkbox from '../../Checkbox';
import Dropdown from '../../Dropdown';
import DynamicValueSelector from '../../DynamicValueSelector';
import Flex from '../../Flex';
import Form, { Label, Value } from '../../Form';
import Groupbox from '../../Groupbox';
import { PanelPositionRef } from '../../panels';
import PanelPosition from '../../panels/PanelPosition';
import RadioButton from '../../RadioButton';
import RadioGroup from '../../RadioGroup';
import Dialog, { Z_INDEX_LEVEL } from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';
import { CommandProps } from '../models';

enum SELECTION_TROOP_TYPE {
	TROOP,
	RANDOM,
}

function DialogCommandStartBattle({ commandKind, setIsOpen, list, onAccept, onReject }: CommandProps) {
	const { t } = useTranslation();

	const panelPositionRef = useRef<PanelPositionRef>(null);

	const [selectionTroopType, setSelectionTroopType] = useStateNumber();
	const [troopID] = useStateDynamicValue();
	const [isAllowEscape, setIsAllowEscape] = useStateBool();
	const [isDefeatGameOver, setIsDefeatGameOver] = useStateBool();
	const [start, setStart] = useStateNumber();
	const [startColor] = useStateDynamicValue();
	const [end, setEnd] = useStateNumber();
	const [endColor] = useStateDynamicValue();
	const [, setTrigger] = useStateBool();

	const initialize = () => {
		troopID.updateToDefaultDatabase();
		startColor.updateToDefaultDatabase();
		endColor.updateToDefaultDatabase();
		if (list) {
			const iterator = Utils.generateIterator();
			setIsAllowEscape(Utils.initializeBoolCommand(list, iterator));
			setIsDefeatGameOver(Utils.initializeBoolCommand(list, iterator));
			const selection = list[iterator.i++] as number;
			setSelectionTroopType(selection);
			if (selection === 0) {
				troopID.updateCommand(list, iterator);
			}
			panelPositionRef.current?.initialize(list, iterator);
			const s = list[iterator.i++] as number;
			setStart(s);
			if (s === 1) {
				startColor.updateCommand(list, iterator);
			}
			const e = list[iterator.i++] as number;
			setEnd(e);
			if (e === 1) {
				endColor.updateCommand(list, iterator);
			}
		} else {
			setSelectionTroopType(SELECTION_TROOP_TYPE.TROOP);
			panelPositionRef.current?.initialize();
			setIsAllowEscape(true);
			setIsDefeatGameOver(true);
			setStart(2);
			setEnd(2);
		}
		setTrigger((v) => !v);
	};

	const handleAccept = async () => {
		setIsOpen(false);
		const newList: MapObjectCommandType[] = [];
		newList.push(Utils.boolToNum(isAllowEscape));
		newList.push(Utils.boolToNum(isDefeatGameOver));
		newList.push(selectionTroopType);
		if (selectionTroopType === 0) {
			troopID.getCommand(newList);
		}
		panelPositionRef.current?.getCommand(newList);
		newList.push(start);
		if (start === 1) {
			startColor.getCommand(newList);
		}
		newList.push(end);
		if (end === 1) {
			endColor.getCommand(newList);
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
			title={`${t('start.battle')}...`}
			isOpen
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			zIndex={Z_INDEX_LEVEL.LAYER_TWO}
			initialHeight='min(calc(100% - 50px), 750px)'
		>
			<Flex one column spacedLarge className='scrollable'>
				<Groupbox title={t('troop.id')}>
					<RadioGroup selected={selectionTroopType} onChange={setSelectionTroopType}>
						<Flex column spacedLarge>
							<Flex spaced centerV>
								<RadioButton value={SELECTION_TROOP_TYPE.TROOP}>ID</RadioButton>
								<DynamicValueSelector
									value={troopID}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
									databaseOptions={Project.current!.troops.list}
									disabled={selectionTroopType !== SELECTION_TROOP_TYPE.TROOP}
								/>
							</Flex>
							<RadioButton value={SELECTION_TROOP_TYPE.RANDOM}>
								{t('random')} ({t('in.map.property')})
							</RadioButton>
						</Flex>
					</RadioGroup>
				</Groupbox>
				<PanelPosition isBattleMap ref={panelPositionRef} />
				<Groupbox title={t('options')}>
					<Flex column spacedLarge>
						<Checkbox isChecked={isAllowEscape} onChange={setIsAllowEscape}>
							{t('allow.escape')}
						</Checkbox>
						<Checkbox isChecked={isDefeatGameOver} onChange={setIsDefeatGameOver}>
							{t('defeat.causes.game.over')}
						</Checkbox>
					</Flex>
				</Groupbox>
				<Groupbox title={t('transition')}>
					<Form>
						<Label>{t('start')}</Label>
						<Value>
							<Flex spaced>
								<Dropdown
									selectedID={start}
									onChange={setStart}
									options={Model.Base.TRANSITION_START_OPTIONS}
									translateOptions
								/>
								<DynamicValueSelector
									value={startColor}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
									databaseOptions={Project.current!.systems.colors}
									disabled={start !== 1}
								/>
							</Flex>
						</Value>
						<Label>{t('end')}</Label>
						<Value>
							<Flex spaced>
								<Dropdown
									selectedID={end}
									onChange={setEnd}
									options={Model.Base.TRANSITION_END_OPTIONS}
									translateOptions
								/>
								<DynamicValueSelector
									value={endColor}
									optionsType={DYNAMIC_VALUE_OPTIONS_TYPE.DATABASE}
									databaseOptions={Project.current!.systems.colors}
									disabled={end !== 1}
								/>
							</Flex>
						</Value>
					</Form>
				</Groupbox>
			</Flex>
		</Dialog>
	);
}

export default DialogCommandStartBattle;
