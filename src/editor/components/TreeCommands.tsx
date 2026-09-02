/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { isValidElement, ReactNode, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlay, FaSlidersH } from 'react-icons/fa';
import { ArrayUtils, EVENT_COMMAND_KIND } from '../common';
import { Node } from '../core/Node';
import { Model } from '../Editor';
import Tree from './Tree';

type Props = {
	list: Node[];
	onListUpdated?: () => void;
	disabled?: boolean;
	onPlayCommand?: (node: Node, openOptions: boolean) => void;
	onSelectCommand?: (node: Node | null) => void;
	onLivePreviewCommand?: (node: Node, command: Model.MapObjectCommand | null, isNew: boolean) => void;
};

const KINDS_WITHOUT_PLAY = [
	EVENT_COMMAND_KIND.COMMENT,
	EVENT_COMMAND_KIND.ELSE,
	EVENT_COMMAND_KIND.END_IF,
	EVENT_COMMAND_KIND.END_WHILE,
	EVENT_COMMAND_KIND.END_CHOICE,
	EVENT_COMMAND_KIND.IF_WIN,
	EVENT_COMMAND_KIND.IF_LOSE,
];

const getTextContent = (node: ReactNode): string[] => {
	if (typeof node === 'string' || typeof node === 'number') {
		return [String(node)];
	}
	if (Array.isArray(node)) {
		return node.flatMap(getTextContent);
	}
	return isValidElement<{ children?: ReactNode }>(node) ? getTextContent(node.props.children) : [];
};

function TreeCommands({ list, onListUpdated, disabled, onPlayCommand, onSelectCommand, onLivePreviewCommand }: Props) {
	const { t } = useTranslation();

	const canPlayCommand = (node: Node) =>
		node.content.id > 0 && !KINDS_WITHOUT_PLAY.includes((node.content as Model.MapObjectCommand).kind);
	const getSelectionNode = (node: Node) => {
		if ((node.content as Model.MapObjectCommand).kind !== EVENT_COMMAND_KIND.END_IF) {
			return node;
		}
		const siblings = node.parent?.children ?? list;
		for (let i = siblings.indexOf(node) - 1; i >= 0; i--) {
			const kind = (siblings[i].content as Model.MapObjectCommand).kind;
			if (kind === EVENT_COMMAND_KIND.IF) {
				return siblings[i];
			}
			if (kind === EVENT_COMMAND_KIND.START_BATTLE) {
				return node;
			}
		}
		return node;
	};
	const getTooltip = (node: Node) => {
		const command = node.content as Model.MapObjectCommand;
		const text = getTextContent(command.toString());
		return [EVENT_COMMAND_KIND.IF, EVENT_COMMAND_KIND.COMMENT].includes(command.kind)
			? text.join('\n')
			: text.slice(1).join('\n').trim().replace(/^:\s*/, '');
	};
	const [updatedList, setUpdatedList] = useState<Node[] | null>(null);

	const handleAcceptCommand = (node: Node, isNew: boolean) => {
		const command = node.content as Model.MapObjectCommand;
		const currentList = node.parent?.children ?? list;
		let index = currentList.indexOf(node) + 1;
		node.content.id = Node.getNewID(list);
		switch (command.kind) {
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE: {
				const nb = command.getChoicesNumber();
				if (isNew) {
					for (let i = 1; i <= nb; i++) {
						const choice = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.CHOICE, [i]);
						choice.id = Node.getNewID(list);
						ArrayUtils.insertAt(currentList, index++, Node.create(choice, [], node.parent));
					}
					const endChoice = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.END_CHOICE);
					endChoice.id = Node.getNewID(list);
					ArrayUtils.insertAt(currentList, index++, Node.create(endChoice, [], node.parent));
				} else {
					let previousNb = 0;
					while (
						(currentList[index + previousNb]?.content as Model.MapObjectCommand | undefined)?.kind ===
						EVENT_COMMAND_KIND.CHOICE
					) {
						previousNb++;
					}
					if (
						(currentList[index + previousNb]?.content as Model.MapObjectCommand | undefined)?.kind !==
						EVENT_COMMAND_KIND.END_CHOICE
					) {
						const endChoice = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.END_CHOICE);
						endChoice.id = Node.getNewID(list);
						ArrayUtils.insertAt(currentList, index + previousNb, Node.create(endChoice, [], node.parent));
					}
					if (previousNb > nb) {
						for (let i = nb; i < previousNb; i++) {
							ArrayUtils.removeAt(currentList, index + nb);
						}
					} else if (previousNb < nb) {
						for (let i = previousNb; i < nb; i++) {
							const choice = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.CHOICE, [i + 1]);
							choice.id = Node.getNewID(list);
							ArrayUtils.insertAt(currentList, index + i, Node.create(choice, [], node.parent));
						}
					}
					for (let i = 0; i < nb; i++) {
						(currentList[index + i].content as Model.MapObjectCommand).command = [i + 1];
					}
				}
				break;
			}
			case EVENT_COMMAND_KIND.START_BATTLE: {
				const isNoGameOver = command.isBattleNoGameOver();
				const previousIsNoGameOver =
					(currentList[index]?.content as Model.MapObjectCommand)?.kind === EVENT_COMMAND_KIND.IF_WIN;
				if ((isNew && isNoGameOver) || (!isNew && !previousIsNoGameOver && isNoGameOver)) {
					const ifWin = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.IF_WIN);
					ifWin.id = Node.getNewID(list);
					ArrayUtils.insertAt(currentList, index++, Node.create(ifWin, [], node.parent));
					const ifLose = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.IF_LOSE);
					ifLose.id = Node.getNewID(list);
					ArrayUtils.insertAt(currentList, index++, Node.create(ifLose, [], node.parent));
					const endIf = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.END_IF);
					endIf.id = Node.getNewID(list);
					ArrayUtils.insertAt(currentList, index++, Node.create(endIf, [], node.parent));
				} else if (!isNew && previousIsNoGameOver && !isNoGameOver) {
					ArrayUtils.removeAt(currentList, index);
					ArrayUtils.removeAt(currentList, index);
					ArrayUtils.removeAt(currentList, index);
				}
				break;
			}
			case EVENT_COMMAND_KIND.IF: {
				const isElse = command.isConditionElse();
				const previousIsElse =
					(currentList[index]?.content as Model.MapObjectCommand)?.kind === EVENT_COMMAND_KIND.ELSE;
				if ((isNew && isElse) || (!isNew && !previousIsElse && isElse)) {
					const ifElse = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.ELSE);
					ifElse.id = Node.getNewID(list);
					ArrayUtils.insertAt(currentList, index++, Node.create(ifElse, [], node.parent));
				} else if (!isNew && previousIsElse && !isElse) {
					ArrayUtils.removeAt(currentList, index);
				}
				if (isNew) {
					const endIf = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.END_IF);
					endIf.id = Node.getNewID(list);
					ArrayUtils.insertAt(currentList, index++, Node.create(endIf, [], node.parent));
				}
				break;
			}
			case EVENT_COMMAND_KIND.WHILE: {
				if (isNew) {
					const endWhile = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.END_WHILE);
					endWhile.id = Node.getNewID(list);
					ArrayUtils.insertAt(currentList, index++, Node.create(endWhile, [], node.parent));
				}
				break;
			}
			default:
				break;
		}
	};

	useLayoutEffect(() => {
		Node.attributeIDsToList(list);
		setUpdatedList(list);
	}, [list]);

	return updatedList ? (
		<Tree
			list={updatedList}
			constructorType={Model.MapObjectCommand}
			onAccept={handleAcceptCommand}
			onListUpdated={onListUpdated}
			onSelectedItem={
				onSelectCommand
					? (node: Node | null, isClick: boolean) => {
							if (isClick) {
								onSelectCommand(node && canPlayCommand(node) ? node : null);
							}
						}
					: undefined
			}
			onDialogLivePreview={onLivePreviewCommand}
			deselectable={!!onSelectCommand}
			disabled={disabled}
			multipleLevels
			canBeEmpty
			scrollable
			multipleSelection
			cannotUpdateListSize
			canDisable
			cannotClear
			getTooltip={getTooltip}
			getSelectionNode={getSelectionNode}
			rowActions={
				onPlayCommand
					? [
							{
								icon: <FaSlidersH />,
								title: t('test.command.options'),
								onClick: (node: Node) => onPlayCommand(node, true),
								isVisible: canPlayCommand,
							},
							{
								icon: <FaPlay />,
								title: t('test.command'),
								onClick: (node: Node) => onPlayCommand(node, false),
								isVisible: canPlayCommand,
							},
						]
					: undefined
			}
		/>
	) : null;
}

export default TreeCommands;
