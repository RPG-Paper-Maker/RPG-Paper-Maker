/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { EVENT_COMMAND_KIND } from '../../common';
import { Node as EditorNode } from '../Node';
import { SimNode } from './SimNode';
import { CommandChoice, CommandElse, CommandWhile } from './SimulationCommands';
import { SimTree, SimulationContext, SimulationInterpreter } from './SimulationInterpreter';

class SimulationFastForward {
	static readonly WHILE_CAP = 1000;
	static readonly STEP_CAP = 100000;

	static run(ctx: SimulationContext, tree: SimTree, targetEditorNode: EditorNode): SimNode | null {
		const target = tree.map.get(targetEditorNode) ?? null;
		if (target === null) {
			return null;
		}
		const path = new Set<SimNode>();
		for (let node: SimNode | null = target; node !== null && node.parent !== null; node = node.parent) {
			path.add(node);
		}
		let levelParent = tree.root;
		let guard = 0;
		while (guard++ < SimulationFastForward.STEP_CAP) {
			let onPath: SimNode | null = null;
			for (let child = levelParent.firstChild; child !== null; child = child.next) {
				if (path.has(child)) {
					onPath = child;
					break;
				}
			}
			if (onPath === null) {
				break;
			}
			SimulationFastForward.walkLevel(ctx, tree, levelParent.firstChild!, onPath);
			if (onPath === target) {
				break;
			}
			levelParent = onPath;
		}
		return target;
	}

	static walkLevel(ctx: SimulationContext, tree: SimTree, start: SimNode, stop: SimNode) {
		let node: SimNode | null = start;
		let guard = 0;
		while (node !== null && node !== stop && guard++ < SimulationFastForward.STEP_CAP) {
			if (node.data === null) {
				node = node.next;
				continue;
			}
			if (SimulationFastForward.groupContains(node, stop)) {
				node = node.next;
				continue;
			}
			if (node.data instanceof CommandChoice || node.data instanceof CommandElse) {
				node = node.next;
				continue;
			}
			const next = SimulationFastForward.executeWhole(ctx, tree, node);
			if (next !== null && next !== stop && next.parent !== start.parent) {
				break;
			}
			node = next;
		}
	}

	static getGroupEndKind(kind: EVENT_COMMAND_KIND): EVENT_COMMAND_KIND | null {
		switch (kind) {
			case EVENT_COMMAND_KIND.IF:
			case EVENT_COMMAND_KIND.START_BATTLE:
				return EVENT_COMMAND_KIND.END_IF;
			case EVENT_COMMAND_KIND.DISPLAY_CHOICE:
				return EVENT_COMMAND_KIND.END_CHOICE;
			case EVENT_COMMAND_KIND.WHILE:
				return EVENT_COMMAND_KIND.END_WHILE;
			default:
				return null;
		}
	}

	static groupContains(header: SimNode, node: SimNode): boolean {
		const endKind = SimulationFastForward.getGroupEndKind(header.kind);
		if (endKind === null) {
			return false;
		}
		for (let current = header.next; current !== null; current = current.next) {
			if (current === node) {
				return true;
			}
			if (current.kind === endKind) {
				break;
			}
		}
		return false;
	}

	static executeWhole(ctx: SimulationContext, tree: SimTree, node: SimNode): SimNode | null {
		const interpreter = new SimulationInterpreter(ctx, tree, node, true);
		const whileCounts = new Map<SimNode, number>();
		let guard = 0;
		while (guard++ < SimulationFastForward.STEP_CAP) {
			const current = interpreter.currentCommand;
			if (current === null) {
				return null;
			}
			if (current !== node && !node.isAncestorOf(current)) {
				return current;
			}
			if (current.data === null) {
				return current.next;
			}
			if (current.data instanceof CommandWhile) {
				const count = (whileCounts.get(current) ?? 0) + 1;
				whileCounts.set(current, count);
				if (count > SimulationFastForward.WHILE_CAP) {
					interpreter.jumpTo(interpreter.goToNextCommand(current));
					continue;
				}
			}
			if (!interpreter.step() && !interpreter.isFinished()) {
				const blocked = interpreter.currentCommand!;
				interpreter.jumpTo(interpreter.endOfBlock(blocked, blocked.next));
			}
		}
		return null;
	}
}

export { SimulationFastForward };
