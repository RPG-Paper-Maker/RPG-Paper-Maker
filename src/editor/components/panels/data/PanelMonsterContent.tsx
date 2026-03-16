/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DYNAMIC_VALUE_KIND } from '../../../common';
import { DynamicValue } from '../../../core/DynamicValue';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import { Base, Monster, MonsterAction, MonsterLoot, ProgressionTable } from '../../../models';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tab from '../../Tab';
import Tree, { TREES_MIN_HEIGHT } from '../../Tree';
import PanelProgression from '../PanelProgression';
import PanelHeroContent from './PanelHeroContent';

type Props = {
	selectedMonster: Monster | null;
	disabled?: boolean;
};

function PanelMonsterContent({ selectedMonster, disabled = false }: Props) {
	const { t } = useTranslation();

	const [loots, setLoots] = useState<Node[]>([]);
	const [actions, setActions] = useState<Node[]>([]);

	const currenciesTitles = useMemo(
		() => Project.current!.systems.currencies.map((currency, index) => Base.create(index, currency.getName())),
		[],
	);
	const upperClass = useMemo(() => Project.current!.classes.getByID(selectedMonster?.class ?? 1), [selectedMonster]);

	const update = async () => {
		if (selectedMonster) {
			setLoots(Node.createList(selectedMonster.loots, false));
			MonsterAction.selectedMonsterActions = selectedMonster.actions;
			setActions(Node.createList(selectedMonster.actions, false));
			ProgressionTable.selectedClassInitialLevel =
				selectedMonster.classInherit.initialLevel === -1
					? upperClass!.initialLevel
					: selectedMonster.classInherit.initialLevel;
			ProgressionTable.selectedClassFinalLevel =
				selectedMonster.classInherit.finalLevel === -1
					? upperClass!.finalLevel
					: selectedMonster.classInherit.finalLevel;
		} else {
			setLoots([]);
			setActions([]);
			MonsterAction.selectedMonsterActions = [];
		}
	};

	const handleUpdateLoots = () => {
		if (selectedMonster) {
			selectedMonster.loots = Node.createListFromNodes(loots);
		}
	};

	const handleUpdateActions = () => {
		if (selectedMonster) {
			selectedMonster.actions = Node.createListFromNodes(actions);
			MonsterAction.selectedMonsterActions = selectedMonster.actions;
		}
	};

	useLayoutEffect(() => {
		update().catch(console.error);
	}, [selectedMonster]);

	const getCurrenciesContents = () =>
		Project.current!.systems.currencies.map((currency) => {
			let progression = selectedMonster?.currencies?.get(currency.id);
			if (selectedMonster?.currencies && !progression) {
				progression = ProgressionTable.createProgression(
					DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
					DynamicValue.create(DYNAMIC_VALUE_KIND.NUMBER, 0),
					0,
				);
				selectedMonster.currencies.set(currency.id, progression);
			}
			return <PanelProgression progression={progression} disabled={disabled} key={currency.id} />;
		});

	return (
		<Flex column one spacedLarge>
			<PanelHeroContent selectedHero={selectedMonster} disabled={disabled} />
			<Flex column spacedLarge>
				<Groupbox title={t('rewards')} disabled={disabled}>
					<Flex column spacedLarge>
						<Flex columnMobile spacedLarge>
							<Flex one column spaced>
								<div>{t('experience')}:</div>
								<PanelProgression progression={selectedMonster?.experience} disabled={disabled} />
							</Flex>
							<Flex one column spaced>
								<div>{t('currencies')}:</div>
								<Tab
									titles={currenciesTitles}
									contents={getCurrenciesContents()}
									lazyLoadingContent
									noScrollToSelectedElement
								/>
							</Flex>
						</Flex>
						<Flex one column spaced>
							<div>{t('loots')}:</div>
							<Tree
								constructorType={MonsterLoot}
								list={loots}
								onListUpdated={handleUpdateLoots}
								height={TREES_MIN_HEIGHT}
								disabled={disabled}
								scrollable
								canBeEmpty
								byIndex
								cannotUpdateListSize
							/>
						</Flex>
					</Flex>
				</Groupbox>
				<Groupbox title={t('actions')} disabled={disabled}>
					<Tree
						constructorType={MonsterAction}
						list={actions}
						onListUpdated={handleUpdateActions}
						height={TREES_MIN_HEIGHT}
						disabled={disabled}
						scrollable
						canBeEmpty
						byIndex
						cannotUpdateListSize
					/>
				</Groupbox>
			</Flex>
		</Flex>
	);
}

export default PanelMonsterContent;
