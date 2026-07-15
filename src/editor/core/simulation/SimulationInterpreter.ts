/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import * as THREE from 'three';
import { EVENT_COMMAND_KIND } from '../../common';
import { Model } from '../../Editor';
import type { Map as SceneMap } from '../../scenes/Map';
import { Camera } from '../Camera';
import { Node as EditorNode } from '../Node';
import { GameStateSimulation } from './GameStateSimulation';
import { SimNode } from './SimNode';
import {
	CommandChoice,
	CommandDisplayChoice,
	CommandLabel,
	CommandShowText,
	CommandState,
	CommandWhile,
	createSimulationCommand,
	SimulationHud,
} from './SimulationCommands';
import { SimulationObject } from './SimulationObject';
import { SimulationScreen } from './SimulationScreen';

export type SimulationContext = {
	game: GameStateSimulation;
	hud: SimulationHud | null;
	screen: SimulationScreen;
	map: SceneMap | null;
	object: SimulationObject | null;
	hero: SimulationObject | null;
	mapObjects: Map<number, SimulationObject>;
	cameraTarget: SimulationObject | null;
	cameraTargetPosition: THREE.Vector3 | null;
	camera: Camera | null;
	parallelCommands: SimulationInterpreter[];
	createCommonReactionInterpreter?: (id: number) => SimulationInterpreter | null;
	getElapsedTime: () => number;
};

export type SimTreeOverride = {
	node: EditorNode;
	command: Model.MapObjectCommand;
};

export type SimTreeInsertion = {
	afterNode: EditorNode | null;
	command: Model.MapObjectCommand;
};

export class SimTree {
	public root = new SimNode(null, null);
	public labels: [CommandLabel, SimNode][] = [];
	public map = new Map<EditorNode, SimNode>();
	public insertedEditorNode: EditorNode | null = null;
	private override: SimTreeOverride | null = null;
	private insertion: SimTreeInsertion | null = null;
	private insertionArray: EditorNode[] | null = null;
	private insertionIndex = -1;

	static create(
		commands: EditorNode[],
		override: SimTreeOverride | null = null,
		insertion: SimTreeInsertion | null = null,
	): SimTree {
		const tree = new SimTree();
		tree.override = override;
		tree.insertion = insertion;
		if (insertion) {
			tree.computeInsertion(commands, insertion);
		}
		tree.readChildren(commands, tree.root);
		return tree;
	}

	private computeInsertion(commands: EditorNode[], insertion: SimTreeInsertion) {
		const afterNode = insertion.afterNode;
		if (afterNode) {
			const located = this.locateNode(commands, afterNode);
			if (located) {
				this.insertionArray = located.array;
				this.insertionIndex =
					located.index +
					Math.max(1, (located.node.content as Model.MapObjectCommand).getSelectionNextIndexes());
				return;
			}
		}
		this.insertionArray = commands;
		this.insertionIndex = commands.length;
	}

	private locateNode(
		nodes: EditorNode[],
		target: EditorNode,
	): { array: EditorNode[]; index: number; node: EditorNode } | null {
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (node === target || node.content.id === target.content.id) {
				return { array: nodes, index: i, node };
			}
			if (node.children.length > 0) {
				const located = this.locateNode(node.children, target);
				if (located) {
					return located;
				}
			}
		}
		return null;
	}

	readChildren(editorNodes: EditorNode[], parent: SimNode) {
		let showText: CommandShowText | null = null;
		const insertAt = editorNodes === this.insertionArray ? Math.min(this.insertionIndex, editorNodes.length) : -1;
		for (let i = 0; i <= editorNodes.length; i++) {
			if (i === insertAt) {
				this.addInsertedNode(parent);
				showText = null;
			}
			if (i >= editorNodes.length) {
				break;
			}
			const editorNode = editorNodes[i];
			const command =
				this.override && editorNode === this.override.node
					? this.override.command
					: (editorNode.content as Model.MapObjectCommand);
			if (command.kind === EVENT_COMMAND_KIND.COMMENT) {
				continue;
			}
			const data = createSimulationCommand(command.kind, command.command);
			if (data) {
				data.disabled = command.disabled;
			}
			const node = parent.add(data, command.kind, editorNode);
			this.map.set(editorNode, node);
			if (data instanceof CommandShowText) {
				showText = data;
			} else if (data instanceof CommandDisplayChoice) {
				data.setShowText(showText);
				showText = null;
			} else if (data instanceof CommandLabel) {
				this.labels.push([data, node]);
				showText = null;
			} else {
				showText = null;
			}
			if (editorNode.children.length > 0) {
				this.readChildren(editorNode.children, node);
			}
		}
	}

	private addInsertedNode(parent: SimNode) {
		const command = this.insertion!.command;
		const editorNode = EditorNode.create(command);
		const data = createSimulationCommand(command.kind, command.command);
		if (data) {
			data.disabled = command.disabled;
		}
		const node = parent.add(data, command.kind, editorNode);
		this.map.set(editorNode, node);
		this.insertedEditorNode = editorNode;
	}
}

class SimulationInterpreter {
	public currentCommand: SimNode | null;
	public currentState: CommandState;

	constructor(
		public ctx: SimulationContext,
		public tree: SimTree,
		command: SimNode | null = null,
		public fastMode = false,
		public boundary: SimNode | null = null,
	) {
		this.currentCommand = command ?? tree.root.firstChild;
		this.currentState = this.initializeState();
	}

	isWithinBoundary(node: SimNode | null): boolean {
		if (this.boundary === null || node === null) {
			return true;
		}
		return node === this.boundary || this.boundary.isAncestorOf(node);
	}

	initializeState(): CommandState {
		if (this.currentCommand === null || this.currentCommand.data === null) {
			return null;
		}
		return this.fastMode
			? this.currentCommand.data.initializeFast(this.ctx)
			: this.currentCommand.data.initialize(this.ctx);
	}

	jumpTo(node: SimNode | null) {
		this.currentCommand = node;
		this.currentState = this.initializeState();
	}

	isFinished(): boolean {
		return this.currentCommand === null;
	}

	update() {
		if (this.isFinished()) {
			return;
		}
		let directNode = true;
		while (directNode) {
			if (this.currentCommand!.data === null) {
				this.currentCommand = this.endOfBlock(this.currentCommand!, this.currentCommand!.next);
				this.currentState = this.initializeState();
				directNode = this.currentCommand !== null;
				continue;
			}
			if (this.currentCommand!.data!.parallel) {
				const interpreter = new SimulationInterpreter(
					this.ctx,
					this.tree,
					this.currentCommand,
					false,
					this.boundary,
				);
				if (interpreter.currentState) {
					interpreter.currentState.parallel = true;
				}
				this.ctx.parallelCommands.push(interpreter);
			}
			const computed = this.updateCommand();
			const newCommand = this.isWithinBoundary(computed) ? computed : null;
			if (newCommand !== this.currentCommand) {
				this.currentCommand = newCommand;
				if (this.currentCommand !== null && this.currentCommand.data !== null) {
					this.currentState = this.initializeState();
					directNode = true;
				} else {
					directNode = false;
				}
			} else {
				directNode = false;
			}
		}
	}

	step(): boolean {
		if (this.isFinished()) {
			return false;
		}
		if (this.currentCommand!.data === null) {
			this.currentCommand = this.endOfBlock(this.currentCommand!, this.currentCommand!.next);
			this.currentState = this.initializeState();
			return this.currentCommand !== null;
		}
		const computed = this.updateCommand();
		const newCommand = this.isWithinBoundary(computed) ? computed : null;
		if (newCommand === this.currentCommand) {
			return false;
		}
		this.currentCommand = newCommand;
		this.currentState = this.initializeState();
		return this.currentCommand !== null && this.currentCommand.data !== null;
	}

	updateCommand(): SimNode | null {
		const command = this.currentCommand!;
		const data = command.data!;
		if (data.disabled) {
			if (typeof data.goToNextCommand === 'function') {
				return this.goToNextCommand(command);
			}
			return this.endOfBlock(command, command.next);
		}
		if (this.fastMode && data instanceof CommandDisplayChoice) {
			let next: SimNode | null = command.next;
			while (next !== null && next.data !== null) {
				next = next.next;
			}
			return this.endOfBlock(command, next === null ? null : next.next);
		}
		const result = this.fastMode
			? data.updateFast(this.currentState, this.ctx)
			: data.update(this.currentState, this.ctx);
		let value: SimNode | null = null;
		if (typeof result === 'string') {
			for (const [label, node] of this.tree.labels) {
				if (result === this.ctx.game.resolveString(label.name)) {
					value = node.next;
					break;
				}
			}
		} else {
			if (result === -1) {
				if (command.firstChild === null) {
					return this.endOfBlock(new SimNode(command, null), null);
				}
				value = command.firstChild;
			} else if (result === -2) {
				let whileNode = command.parent;
				while (whileNode !== null) {
					if (whileNode.data instanceof CommandWhile) {
						return this.goToNextCommand(whileNode);
					}
					whileNode = whileNode.parent;
				}
				return null;
			} else if (result === -3) {
				return null;
			} else {
				value = command;
				for (let j = 1; j <= result && value !== null; j++) {
					value = value.next;
				}
			}
		}
		return this.endOfBlock(command, value);
	}

	endOfBlock(command: SimNode, value: SimNode | null): SimNode | null {
		if (value === null) {
			const parent = command.parent;
			if (parent === null || parent.parent === null) {
				return null;
			}
			if (parent.data instanceof CommandWhile) {
				return parent;
			}
			if (parent.data instanceof CommandChoice) {
				let next: SimNode | null = parent;
				while (next !== null && next.data !== null) {
					next = next.next;
				}
				return this.endOfBlock(parent, next === null ? null : next.next);
			}
			return this.goToNextCommand(parent);
		}
		return value;
	}

	goToNextCommand(node: SimNode): SimNode | null {
		const skip = node.data && typeof node.data.goToNextCommand === 'function' ? node.data.goToNextCommand() : 1;
		let value: SimNode | null = node;
		for (let i = 1; i <= skip && value !== null; i++) {
			value = value.next;
		}
		return this.endOfBlock(node, value);
	}
}

export { SimulationInterpreter };
