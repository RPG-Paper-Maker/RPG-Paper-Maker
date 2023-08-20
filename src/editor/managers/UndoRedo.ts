/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MapElement, Scene } from '../Editor';
import { ElementMapKind } from '../common/Enum';
import { Paths } from '../common/Paths';
import { Utils } from '../common/Utils';
import { LocalFile } from '../core/LocalFile';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { UndoRedoState } from '../core/UndoRedoState';

class UndoRedo {
	public static isProcessing = false;

	private static getPathStatesAt(index: number): string {
		return Paths.join(Scene.Map.current?.getPath(), Paths.TEMP_UNDO_REDO, `${index}.json`);
	}

	private static getPathIndex() {
		return Paths.join(Scene.Map.current?.getPath(), Paths.TEMP_UNDO_REDO, Paths.INDEX);
	}

	static async getStatesLength() {
		if (Project.current) {
			return (
				(await LocalFile.getFiles(Paths.join(Scene.Map.current?.getPath(), Paths.TEMP_UNDO_REDO))).length - 1
			);
		}
		return 0;
	}

	static async getCurrentCurrentIndex() {
		if (Project.current) {
			const file = await LocalFile.getFile(UndoRedo.getPathIndex());
			if (file) {
				return parseInt(file.content);
			}
		}
		return -1;
	}

	private static async saveCurrentCurrentIndex(index: number) {
		await LocalFile.createFile(UndoRedo.getPathIndex(), `${index}`);
	}

	private static async getStatesAt(index: number) {
		const states: UndoRedoState[] = [];
		const file = await LocalFile.getFile(this.getPathStatesAt(index));
		if (file) {
			Utils.readList(states, JSON.parse(file.content), UndoRedoState);
		}
		return states;
	}

	private static async apply(position: Position, element: MapElement.Base | null, kind: ElementMapKind) {
		if (Scene.Map.current) {
			Scene.Map.current.mapPortion.updateMapElement(position, element, kind, false, false, true);
		}
	}

	private static async applyStates(index: number, before: boolean) {
		const states = await this.getStatesAt(index);
		console.log(states);
		if (before) {
			for (let i = states.length - 1; i >= 0; i--) {
				const state = states[i];
				this.apply(state.position, state.elementBefore, state.kindBefore);
			}
		} else {
			for (const state of states) {
				this.apply(state.position, state.elementAfter, state.kindAfter);
			}
		}
	}

	private static async action(before: boolean, indexOffset: number) {
		const length = await this.getStatesLength();
		let index = await this.getCurrentCurrentIndex();
		if (before) {
			this.applyStates(index, true);
		}
		index = Math.min(Math.max(-1, index + indexOffset), length - 1);
		await this.saveCurrentCurrentIndex(index);
		if (!before) {
			this.applyStates(index, false);
		}
		this.isProcessing = false;
	}

	static undo() {
		if (!this.isProcessing) {
			this.isProcessing = true;
			this.action(true, -1);
		}
	}

	static redo() {
		if (!this.isProcessing) {
			this.isProcessing = true;
			this.action(false, 1);
		}
	}

	static async createStates(states: UndoRedoState[]): Promise<{ index: number; length: number }> {
		// Update current index
		let index = (await this.getCurrentCurrentIndex()) + 1;
		await this.saveCurrentCurrentIndex(index);

		// Remove all existing states >= new index
		const length = await this.getStatesLength();
		for (let i = index; i < length; i++) {
			await LocalFile.removeFile(this.getPathStatesAt(i));
		}

		// Create a new file for the new state
		const arrayJson: Record<string, any>[] = [];
		for (const state of states) {
			const json = {};
			state.write(json);
			arrayJson.push(json);
		}

		await LocalFile.createFile(this.getPathStatesAt(index), JSON.stringify(arrayJson));
		return { index, length: index + 1 };
	}
}

export { UndoRedo };
