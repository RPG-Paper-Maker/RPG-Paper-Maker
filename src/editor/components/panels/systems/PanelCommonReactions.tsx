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
import useStateBool from '../../../hooks/useStateBool';
import Checkbox from '../../Checkbox';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree, { TREES_MIN_HEIGHT, TREES_MIN_WIDTH } from '../../Tree';
import TreeCommands from '../../TreeCommands';

const PanelCommonReactions = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const [reactions, setReactions] = useState<Node[]>([]);
	const [selectedReaction, setSelectedReaction] = useState<Model.CommonReaction | null>(null);
	const [parameters, setParameters] = useState<Node[]>([]);
	const [isBlock, setIsBlock] = useStateBool();
	const [commands, setCommands] = useState<Node[]>([]);

	const isReactionDisabled = useMemo(
		() => selectedReaction === null || selectedReaction.id === -1,
		[selectedReaction],
	);

	const initialize = () => {
		const commonEvents = Project.current!.commonEvents;
		setReactions(Node.createList(commonEvents.commonReactions));
	};

	const handleSelectReaction = (node: Node | null) => {
		if (node) {
			const reaction = node.content as Model.CommonReaction;
			setSelectedReaction(reaction);
			setParameters(Node.createList(reaction.parameters));
			setIsBlock(reaction.blockingHero);
			setCommands(reaction.commands.map((node) => node.clone()));
		}
	};

	const handleUpdateParameters = () => {
		if (selectedReaction) {
			selectedReaction.parameters = Node.createListFromNodes(parameters);
		}
	};

	const handleChangeBlock = (b: boolean) => {
		if (selectedReaction) {
			setIsBlock(b);
			selectedReaction.blockingHero = b;
		}
	};

	const handleUpdateCommands = () => {
		if (selectedReaction) {
			selectedReaction.commands = commands.map((node) => node.clone());
		}
	};

	const accept = () => {
		const commonEvents = Project.current!.commonEvents;
		commonEvents.commonReactions = Node.createListFromNodes(reactions);
	};

	useImperativeHandle(ref, () => ({
		initialize,
		accept,
	}));

	useLayoutEffect(() => {
		initialize();
	}, []);

	return (
		<Flex spacedLarge fillWidth fillHeight>
			<Groupbox title={t('common.reactions')}>
				<Flex one fillHeight>
					<Tree
						constructorType={Model.CommonReaction}
						list={reactions}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleSelectReaction}
						noScrollOnForce
						scrollable
						showEditName
						applyDefault
						doNotOpenDialog
					/>
				</Flex>
			</Groupbox>
			<Flex one>
				<Flex column spacedLarge fillWidth>
					<Groupbox title={t('parameters')} disabled={isReactionDisabled}>
						<Tree
							constructorType={Model.CreateParameter}
							list={parameters}
							onListUpdated={handleUpdateParameters}
							height={TREES_MIN_HEIGHT}
							disabled={isReactionDisabled}
							noScrollOnForce
							scrollable
							canBeEmpty
							cannotUpdateListSize
						/>
					</Groupbox>
					<Checkbox isChecked={isBlock} onChange={handleChangeBlock} disabled={isReactionDisabled}>
						{t('block.hero.when.reaction')}
					</Checkbox>
					<Flex one>
						<TreeCommands
							list={commands}
							onListUpdated={handleUpdateCommands}
							disabled={isReactionDisabled}
						/>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
});

PanelCommonReactions.displayName = 'PanelCommonReactions';

export default PanelCommonReactions;
