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
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateBool from '../../../hooks/useStateBool';
import Checkbox from '../../Checkbox';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree, { TREES_MIN_HEIGHT, TREES_MIN_WIDTH } from '../../Tree';
import TreeCommands from '../../TreeCommands';
import type { PlayCommandInfo } from '../PanelMapObject';

type Props = {
	onPlayCommand?: (info: PlayCommandInfo, object: Model.CommonObject) => void;
	onSelectCommand?: (info: PlayCommandInfo | null, object: Model.CommonObject) => void;
	onLivePreviewCommand?: (
		info: PlayCommandInfo,
		object: Model.CommonObject,
		command: Model.MapObjectCommand | null,
	) => void;
	onReactionChanged?: () => void;
};

const PanelCommonReactions = forwardRef(
	({ onPlayCommand, onSelectCommand, onLivePreviewCommand, onReactionChanged }: Props, ref) => {
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
				onReactionChanged?.();
				const reaction = node.content as Model.CommonReaction;
				setSelectedReaction(reaction);
				setParameters(Node.createList(reaction.parameters));
				Project.current!.currentMapObjectParameters = reaction.parameters;
				setIsBlock(reaction.blockingHero);
				setCommands(reaction.commands.map((node) => node.clone()));
			}
		};

		const handleUpdateReactions = () => {
			Project.current!.commonEvents.commonReactions = Node.createListFromNodes(reactions);
		};

		const handleUpdateParameters = () => {
			if (selectedReaction) {
				selectedReaction.parameters = Node.createListFromNodes(parameters);
				Project.current!.currentMapObjectParameters = selectedReaction.parameters;
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

		const getCommandInfo = (node: Node, openOptions = false, isNewCommand = false): PlayCommandInfo => {
			const reaction = selectedReaction!.clone();
			reaction.commands = commands;
			return {
				node,
				reaction,
				stateID: Project.current!.commonEvents.heroObject.states[0]?.id ?? 1,
				openOptions,
				isNewCommand,
			};
		};

		const getSimulationObject = () => Project.current!.commonEvents.heroObject;

		useImperativeHandle(ref, () => ({
			initialize,
			accept,
		}));

		useLayoutEffect(() => {
			initialize();
			return () => {
				Project.current!.currentMapObjectParameters = [];
			};
		}, []);

		return (
			<Flex columnMobile spacedLarge fillWidth fillHeight>
				<Groupbox title={t('common.reactions')}>
					<Flex one fillHeight>
						<Tree
							constructorType={Model.CommonReaction}
							list={reactions}
							minWidth={TREES_MIN_WIDTH}
							onSelectedItem={handleSelectReaction}
							onListUpdated={handleUpdateReactions}
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
								scrollable
								canBeEmpty
								cannotUpdateListSize
							/>
						</Groupbox>
						<Checkbox isChecked={isBlock} onChange={handleChangeBlock} disabled={isReactionDisabled}>
							{t('block.hero.during.reaction')}
						</Checkbox>
						<Flex one>
							<TreeCommands
								list={commands}
								onListUpdated={handleUpdateCommands}
								disabled={isReactionDisabled}
								onPlayCommand={
									onPlayCommand
										? (node, openOptions) =>
												onPlayCommand(getCommandInfo(node, openOptions), getSimulationObject())
										: undefined
								}
								onSelectCommand={
									onSelectCommand
										? (node) =>
												onSelectCommand(
													node ? getCommandInfo(node) : null,
													getSimulationObject(),
												)
										: undefined
								}
								onLivePreviewCommand={
									onLivePreviewCommand
										? (node, command, isNew) =>
												onLivePreviewCommand(
													getCommandInfo(node, false, isNew),
													getSimulationObject(),
													command,
												)
										: undefined
								}
							/>
						</Flex>
					</Flex>
				</Flex>
			</Flex>
		);
	},
);

PanelCommonReactions.displayName = 'PanelCommonReactions';

export default PanelCommonReactions;
