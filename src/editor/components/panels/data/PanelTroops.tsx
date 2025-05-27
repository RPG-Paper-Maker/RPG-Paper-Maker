/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import BattleMapPreviewer from '../../BattleMapPreviewer';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree, { TREES_MIN_WIDTH } from '../../Tree';

const PanelTroops = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [troops, setTroops] = useState<Node[]>([]);
	const [selectedTroop, setSelectedTroop] = useState<Model.Troop | null>(null);
	const [monsters, setMonsters] = useState<Node[]>([]);

	const isTroopDisabled = useMemo(() => selectedTroop === null || selectedTroop.id === -1, [selectedTroop]);

	const initialize = () => {
		setTroops(Node.createList(Project.current!.troops.list, false));
	};

	const handleSelectTroop = (node: Node | null) => {
		const troop = (node?.content as Model.Troop) ?? null;
		setSelectedTroop(troop);
		if (troop) {
			setMonsters(Node.createList(troop.list, false));
		} else {
			setMonsters([]);
		}
	};

	const handleListUpdated = () => {
		Project.current!.troops.list = Node.createListFromNodes(troops);
	};

	const handleMonstersListUpdated = () => {
		if (selectedTroop) {
			selectedTroop.list = Node.createListFromNodes(monsters);
		}
	};

	useImperativeHandle(ref, () => ({}));

	useLayoutEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	return (
		<Flex spacedLarge fillWidth fillHeight>
			<Groupbox title={t('troops')}>
				<Flex one fillHeight>
					<Tree
						constructorType={Model.Troop}
						list={troops}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleSelectTroop}
						onListUpdated={handleListUpdated}
						noScrollOnForce
						scrollable
						showEditName
						isLocalization
						applyDefault
					/>
				</Flex>
			</Groupbox>
			<Flex one column>
				<Flex one column scrollable zeroHeight>
					<Flex column one spacedLarge>
						<Flex spaced>
							<Flex one>
								<Groupbox title={t('monsters.list')} fillWidth>
									<Tree
										constructorType={Model.TroopMonster}
										list={monsters}
										//onSelectedItem={handleSelectTroop}
										onListUpdated={handleMonstersListUpdated}
										noScrollOnForce
										scrollable
										applyDefault
									/>
								</Groupbox>
							</Flex>
							<BattleMapPreviewer monsters={selectedTroop?.list ?? []} />
						</Flex>
						<Groupbox title={t('reactions')}>
							<Flex spaced>Test</Flex>
							<Flex spaced>Test</Flex>
							<Flex spaced>Test</Flex>
						</Groupbox>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
});

export default PanelTroops;
