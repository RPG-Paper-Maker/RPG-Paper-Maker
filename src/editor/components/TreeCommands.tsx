/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useLayoutEffect, useState } from 'react';
import { ArrayUtils, EVENT_COMMAND_KIND } from '../common';
import { Node } from '../core';
import { Model } from '../Editor';
import Tree from './Tree';

type Props = {
	list: Node[];
};

function TreeCommands({ list }: Props) {
	const [canDisplay, setCanDisplay] = useState(false);

	const handleAcceptCommand = (node: Node, isNew: boolean) => {
		const command = node.content as Model.MapObjectCommand;
		const currentList = node.parent?.children ?? list;
		let index = currentList.indexOf(node) + 1;
		switch (command.kind) {
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE: {
				const nb = command.getChoicesNumber();
				if (isNew) {
					for (let i = 1; i <= nb; i++) {
						const choice = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.CHOICE, [i]);
						choice.id = Node.getNewID(list);
						ArrayUtils.insertAt(currentList, index++, Node.create(choice));
					}
					const endChoice = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.END_CHOICE);
					endChoice.id = Node.getNewID(list);
					ArrayUtils.insertAt(currentList, index++, Node.create(endChoice));
				} else {
					let previousNb = 0;
					let i = 0;
					let choice = currentList[index + i];
					while ((choice.content as Model.MapObjectCommand).kind !== EVENT_COMMAND_KIND.END_CHOICE) {
						i++;
						previousNb++;
						choice = currentList[index + i];
					}
					if (previousNb > nb) {
						for (i = nb; i < previousNb; i++) {
							ArrayUtils.removeAt(currentList, index + i);
						}
					} else if (previousNb < nb) {
						for (let i = previousNb; i < nb; i++) {
							const choice = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.CHOICE, [i + 1]);
							choice.id = Node.getNewID(list);
							ArrayUtils.insertAt(currentList, index + i, Node.create(choice));
						}
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
					ArrayUtils.insertAt(currentList, index++, Node.create(ifWin));
					const ifLose = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.IF_LOSE);
					ifLose.id = Node.getNewID(list);
					ArrayUtils.insertAt(currentList, index++, Node.create(ifLose));
					const endIf = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.END_IF);
					endIf.id = Node.getNewID(list);
					ArrayUtils.insertAt(currentList, index++, Node.create(endIf));
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
					ArrayUtils.insertAt(currentList, index++, Node.create(ifElse));
				} else if (!isNew && previousIsElse && !isElse) {
					ArrayUtils.removeAt(currentList, index);
				}
				if (isNew) {
					const endIf = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.END_IF);
					endIf.id = Node.getNewID(list);
					ArrayUtils.insertAt(currentList, index++, Node.create(endIf));
				}
				break;
			}
			case EVENT_COMMAND_KIND.WHILE: {
				if (isNew) {
					const endWhile = Model.MapObjectCommand.createCommand(EVENT_COMMAND_KIND.END_WHILE);
					endWhile.id = Node.getNewID(list);
					ArrayUtils.insertAt(currentList, index++, Node.create(endWhile));
				}
				break;
			}
			default:
				node.content.id = Node.getNewID(list);
				break;
		}
	};

	useLayoutEffect(() => {
		Node.attributeIDsToList(list);
		setCanDisplay(true);
		// eslint-disable-next-line
	}, []);

	return canDisplay ? (
		<Tree
			list={list}
			constructorType={Model.MapObjectCommand}
			onAccept={handleAcceptCommand}
			multipleLevels
			canBeEmpty
			scrollable
			multipleSelection
		/>
	) : null;
}

export default TreeCommands;
