/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node, Project } from '../../../core';
import { Model } from '../../../Editor';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree from '../../Tree';

const PanelMainMenu = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [itemsTypes, setItemsTypes] = useState<Node[]>([]);
	const [inventoryFilters, setInventoryFilters] = useState<Node[]>([]);
	const [mainMenuCommands, setMainMenuCommands] = useState<Node[]>([]);
	const [heroesStatisticsDisplay, setHeroesStatisticsDisplay] = useState<Node[]>([]);

	const initialize = () => {
		const system = Project.current!.systems;
		setItemsTypes(Node.createList(system.itemsTypes));
		setInventoryFilters(Node.createList(system.inventoryFilters));
		setMainMenuCommands(Node.createList(system.mainMenuCommands));
		setHeroesStatisticsDisplay(Node.createList(system.heroesStatisticsDisplay));
	};

	const updateItemsTypes = () => {
		Project.current!.systems.itemsTypes = Node.createListFromNodes(itemsTypes);
	};

	const accept = () => {
		const system = Project.current!.systems;
		system.itemsTypes = Node.createListFromNodes(itemsTypes);
		system.inventoryFilters = Node.createListFromNodes(inventoryFilters);
		system.mainMenuCommands = Node.createListFromNodes(mainMenuCommands);
		system.heroesStatisticsDisplay = Node.createListFromNodes(heroesStatisticsDisplay);
	};

	useImperativeHandle(ref, () => ({
		initialize,
		accept,
	}));

	useLayoutEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, []);

	return (
		<Flex column spacedLarge fillWidth fillHeight>
			<Flex one spacedLarge>
				<Flex one>
					<Groupbox title={t('items.types')} fillWidth>
						<Flex one fillHeight>
							<Tree
								constructorType={Model.Localization}
								list={itemsTypes}
								onListUpdated={updateItemsTypes}
								noScrollOnForce
								scrollable
							/>
						</Flex>
					</Groupbox>
				</Flex>
				<Flex one>
					<Groupbox title={t('inventory.filters')} fillWidth>
						<Flex one fillHeight>
							<Tree
								constructorType={Model.InventoryFilter}
								list={inventoryFilters}
								noScrollOnForce
								scrollable
							/>
						</Flex>
					</Groupbox>
				</Flex>
			</Flex>
			<Flex one spacedLarge>
				<Flex one>
					<Groupbox title={t('main.menu.commands')} fillWidth>
						<Flex one fillHeight>
							<Tree
								constructorType={Model.MainMenuCommand}
								list={mainMenuCommands}
								noScrollOnForce
								scrollable
							/>
						</Flex>
					</Groupbox>
				</Flex>
				<Flex one>
					<Groupbox title={t('heroes.statistics.to.display')} fillWidth>
						<Flex one fillHeight>
							<Tree
								constructorType={Model.HeroStatisticDisplay}
								list={heroesStatisticsDisplay}
								noScrollOnForce
								scrollable
							/>
						</Flex>
					</Groupbox>
				</Flex>
			</Flex>
		</Flex>
	);
});

export default PanelMainMenu;
