/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TROOP_REACTION_FREQUENCY_KIND } from '../../../common';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import useStateNumber from '../../../hooks/useStateNumber';
import { Base, TroopMonster } from '../../../models';
import BattleMapPreviewer from '../../BattleMapPreviewer';
import Button from '../../Button';
import DialogTroopBattleTest from '../../dialogs/DialogTroopBattleTest';
import DialogTroopReactionConditions from '../../dialogs/models/DialogTroopReactionConditions';
import Dropdown from '../../Dropdown';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree, { TREES_LARGE_MIN_HEIGHT, TREES_MIN_WIDTH } from '../../Tree';
import TreeCommands from '../../TreeCommands';

const PanelTroops = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [isDialogBattleTestOpen, setIsDialogBattleTestOpen] = useState(false);
	const [troops, setTroops] = useState<Node[]>([]);
	const [selectedTroop, setSelectedTroop] = useState<Model.Troop | null>(null);
	const [monsters, setMonsters] = useState<Node[]>([]);
	const [reactions, setReactions] = useState<Node[]>([]);
	const [selectedReaction, setSelectedReaction] = useState<Model.TroopReaction | null>(null);
	const [isDialogReactionConditionsOpen, setIsDialogReactionConditionsOpen] = useStateBool();
	const [frequency, setFrequency] = useStateNumber();
	const [commands, setCommands] = useState<Node[]>([]);
	const [triggerUpdate, setTriggerUpdate] = useStateBool();

	const isTroopDisabled = useMemo(() => selectedTroop === null || selectedTroop.id === -1, [selectedTroop]);
	const isReactionDisabled = useMemo(
		() => selectedReaction === null || selectedReaction.id === -1,
		[selectedReaction],
	);

	const initialize = () => {
		setTroops(Node.createList(Project.current!.troops.list, false));
	};

	const handleSelectTroop = (node: Node | null) => {
		const troop = (node?.content as Model.Troop) ?? null;
		setSelectedTroop(troop);
		if (troop) {
			setMonsters(Node.createList(troop.list, false));
			TroopMonster.currentMonsters = troop.list;
			setReactions(Node.createList(troop.reactions, false));
		} else {
			setMonsters([]);
			setReactions([]);
		}
	};

	const handleListUpdated = () => {
		Project.current!.troops.list = Node.createListFromNodes(troops);
	};

	const handleMonstersListUpdated = () => {
		if (selectedTroop) {
			selectedTroop.list = Node.createListFromNodes(monsters);
			TroopMonster.currentMonsters = selectedTroop.list;
			setTriggerUpdate((v) => !v);
		}
	};

	const handleClickTest = () => {
		setIsDialogBattleTestOpen(true);
	};

	const handleSelectReaction = (node: Node | null) => {
		const reaction = (node?.content as Model.TroopReaction) ?? null;
		setSelectedReaction(reaction);
		if (reaction) {
			setFrequency(reaction.frequency);
			setCommands(reaction.commands.map((node) => node.clone()));
		} else {
			setFrequency(TROOP_REACTION_FREQUENCY_KIND.ONE_TIME);
			setCommands([]);
		}
	};

	const handleReactionsListUpdated = () => {
		if (selectedTroop) {
			selectedTroop.reactions = Node.createListFromNodes(reactions);
		}
	};

	const handleClickReactionConditions = () => {
		setIsDialogReactionConditionsOpen(true);
	};

	const handleChangeFrequency = (f: number) => {
		setFrequency(f);
		if (selectedReaction) {
			selectedReaction.frequency = f;
		}
	};

	const handleUpdateCommands = () => {
		if (selectedReaction) {
			selectedReaction.commands = commands.map((node) => node.clone());
		}
	};

	useImperativeHandle(ref, () => ({}));

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<>
			<Flex spacedLarge fillWidth fillHeight>
				<Groupbox title={t('troops')}>
					<Tree
						constructorType={Model.Troop}
						list={troops}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleSelectTroop}
						onListUpdated={handleListUpdated}
						scrollable
						showEditName
						isLocalization
						applyDefault
						doNotOpenDialog
					/>
				</Groupbox>
				<Flex one column>
					<Flex one column scrollable zeroHeight>
						<Flex column one spacedLarge>
							<Flex spaced>
								<Flex one column spacedLarge>
									<Button onClick={handleClickTest} disabled={isTroopDisabled}>
										{t('test')}...
									</Button>
									<Flex one>
										<Groupbox title={t('monsters.list')} fillWidth disabled={isTroopDisabled}>
											<Tree
												constructorType={Model.TroopMonster}
												list={monsters}
												onListUpdated={handleMonstersListUpdated}
												scrollable
												applyDefault
												disabled={isTroopDisabled}
												cannotUpdateListSize
											/>
										</Groupbox>
									</Flex>
								</Flex>
								<BattleMapPreviewer
									monsters={selectedTroop?.list ?? []}
									triggerUpdate={triggerUpdate}
									disabled={isTroopDisabled}
								/>
							</Flex>
							<Flex one>
								<Groupbox title={t('reactions')} disabled={isTroopDisabled} fillWidth>
									<Flex spacedLarge fillHeight>
										<Flex>
											<Tree
												constructorType={Model.TroopReaction}
												list={reactions}
												onListUpdated={handleReactionsListUpdated}
												onSelectedItem={handleSelectReaction}
												height={TREES_LARGE_MIN_HEIGHT}
												minWidth={TREES_MIN_WIDTH}
												disabled={isTroopDisabled}
												scrollable
												applyDefault
												showEditName
												cannotUpdateListSize
												doNotOpenDialog
												canBeEmpty
											/>
										</Flex>
										<Flex one column spaced>
											<Flex spacedLarge>
												<Flex spaced centerV>
													<Flex disabledLabel={isTroopDisabled || isReactionDisabled}>
														{t('conditions')}:
													</Flex>
													<Button
														onClick={handleClickReactionConditions}
														disabled={isTroopDisabled || isReactionDisabled}
													>
														...
													</Button>
												</Flex>
												<Flex spaced centerV>
													<Flex disabledLabel={isTroopDisabled || isReactionDisabled}>
														{t('frequency')}:
													</Flex>
													<Dropdown
														selectedID={frequency}
														onChange={handleChangeFrequency}
														options={Base.TROOP_REACTION_FREQUENCY_OPTIONS}
														disabled={isTroopDisabled || isReactionDisabled}
														translateOptions
													/>
												</Flex>
											</Flex>
											<TreeCommands
												list={commands}
												onListUpdated={handleUpdateCommands}
												disabled={isTroopDisabled || isReactionDisabled}
											/>
										</Flex>
									</Flex>
								</Groupbox>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
			{isDialogBattleTestOpen && (
				<DialogTroopBattleTest setIsOpen={setIsDialogBattleTestOpen} troopID={selectedTroop?.id ?? -1} />
			)}
			{isDialogReactionConditionsOpen && selectedReaction && (
				<DialogTroopReactionConditions
					setIsOpen={setIsDialogReactionConditionsOpen}
					conditions={selectedReaction.conditions}
				/>
			)}
		</>
	);
});

PanelTroops.displayName = 'PanelTroops';

export default PanelTroops;
