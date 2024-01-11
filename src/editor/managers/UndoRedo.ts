/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MapElement, Scene } from '../Editor';
import { ELEMENT_MAP_KIND, Paths, Utils } from '../common';
import { LocalFile, Position, Project, UndoRedoState } from '../core';

class UndoRedo {
	public static readonly MAX_SAVES = 50;
	public static isProcessing = false;

	private static getPathStates(): string {
		return Paths.join(Scene.Map.current?.getPath(), Paths.TEMP_UNDO_REDO);
	}

	private static getStateFilename(index: number): string {
		return `${index}.json`;
	}

	private static getPathStatesAt(index: number): string {
		return Paths.join(this.getPathStates(), this.getStateFilename(index));
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
				return Number(file.content);
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

	private static apply(position: Position, element: MapElement.Base | null, kind: ELEMENT_MAP_KIND) {
		if (Scene.Map.current) {
			Scene.Map.current.mapPortion.removeLastPreview();
			Scene.Map.current.mapPortion.updateMapElement(position, element, kind, false, false, true, true);
		}
	}

	private static async applyStates(index: number, before: boolean) {
		const states = await this.getStatesAt(index);
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

	private static async updateMaxFiles(index: number) {
		const path = this.getPathStates();
		for (let i = 1; i <= index; i++) {
			await LocalFile.renameFile(path, this.getStateFilename(i), this.getStateFilename(i - 1));
		}
	}

	private static async action(before: boolean, indexOffset: number) {
		Scene.Map.current!.removeTransform();
		const length = await this.getStatesLength();
		let index = await this.getCurrentCurrentIndex();
		if (before) {
			await this.applyStates(index, true);
		}
		index = Math.min(Math.max(-1, index + indexOffset), length - 1);
		await this.saveCurrentCurrentIndex(index);
		if (!before) {
			await this.applyStates(index, false);
		}
		this.isProcessing = false;
	}

	static async undo() {
		if (!this.isProcessing) {
			this.isProcessing = true;
			await this.action(true, -1);
			return true;
		} else {
			return false;
		}
	}

	static async redo() {
		if (!this.isProcessing) {
			this.isProcessing = true;
			await this.action(false, 1);
			return true;
		} else {
			return false;
		}
	}

	static async createStates(states: UndoRedoState[]): Promise<{ index: number; length: number }> {
		// Update current index
		let index = (await this.getCurrentCurrentIndex()) + 1;
		if (index === this.MAX_SAVES) {
			index--;
			await this.updateMaxFiles(index);
		} else {
			await this.saveCurrentCurrentIndex(index);
		}

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
