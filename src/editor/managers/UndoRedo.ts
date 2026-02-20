/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MapElement, Model, Scene } from '../Editor';
import { ELEMENT_MAP_KIND, JSONType, Paths } from '../common';
import { createFile, getFiles, readFile, removeFile, renameFile } from '../common/Platform';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { Serializable } from '../core/Serializable';
import { UndoRedoState } from '../core/UndoRedoState';

class UndoRedo {
	public static readonly MAX_SAVES = 150;
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
			return (await getFiles(Paths.join(Scene.Map.current?.getPath(), Paths.TEMP_UNDO_REDO))).length - 1;
		}
		return 0;
	}

	static async getCurrentCurrentIndex() {
		if (Project.current) {
			const content = await readFile(UndoRedo.getPathIndex());
			if (content !== null) {
				return Number(content);
			}
		}
		return -1;
	}

	private static async saveCurrentCurrentIndex(index: number) {
		await createFile(UndoRedo.getPathIndex(), `${index}`);
	}

	private static async getStatesAt(index: number) {
		const states: UndoRedoState[] = [];
		const content = await readFile(this.getPathStatesAt(index));
		if (content !== null) {
			Serializable.readList(states, JSON.parse(content), UndoRedoState);
		}
		return states;
	}

	private static async apply(
		position: Position,
		element: MapElement.Base | Model.CommonObject | null,
		kind: ELEMENT_MAP_KIND,
	) {
		if (Scene.Map.current) {
			const mapPortion = Scene.Map.current.getMapPortionByPosition(position);
			if (mapPortion) {
				mapPortion.removeLastPreview();
				if (kind === ELEMENT_MAP_KIND.OBJECT) {
					mapPortion.updateObject(position, element as Model.CommonObject, true);
					await Scene.Map.current.model.updateObject(position, element as Model.CommonObject);
				} else {
					mapPortion.updateMapElement(position, element as MapElement.Base, kind, false, false, true, true);
				}
			} else {
				const model = new Model.MapPortion(position.getGlobalPortion());
				await model.load();
				const models = model.getModelsByKind(kind);
				if (models) {
					if (element) {
						models.set(position.toKey(), element);
					} else {
						models.delete(position.toKey());
					}
					await model.save();
					if (kind === ELEMENT_MAP_KIND.OBJECT) {
						await Scene.Map.current.model.updateObject(position, element as Model.CommonObject | null);
					}
				}
			}
		}
	}

	private static async applyStates(index: number, before: boolean) {
		const states = await this.getStatesAt(index);
		if (before) {
			for (let i = states.length - 1; i >= 0; i--) {
				const state = states[i];
				await this.apply(state.position, state.elementBefore, state.kindBefore);
			}
		} else {
			for (const state of states) {
				await this.apply(state.position, state.elementAfter, state.kindAfter);
			}
		}
	}

	private static async updateMaxFiles(index: number) {
		const path = this.getPathStates();
		for (let i = 1; i <= index; i++) {
			await renameFile(path, this.getStateFilename(i), this.getStateFilename(i - 1));
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
			await removeFile(this.getPathStatesAt(i));
		}

		// Create a new file for the new state
		const arrayJson: JSONType[] = [];
		for (const state of states) {
			const json = {};
			state.write(json);
			arrayJson.push(json);
		}

		await createFile(this.getPathStatesAt(index), JSON.stringify(arrayJson));
		return { index, length: index + 1 };
	}
}

export { UndoRedo };
