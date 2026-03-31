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
import { createFile, getFiles, readFile, removeFile } from '../common/Platform';
import { Position } from '../core/Position';
import { Project } from '../core/Project';
import { Serializable } from '../core/Serializable';
import { UndoRedoState } from '../core/UndoRedoState';

class UndoRedo {
	public static readonly MAX_SAVES = 5;
	public static isProcessing = false;

	private static getPathStates(): string {
		return Paths.join(Scene.Map.current?.getPath(), Paths.TEMP_UNDO_REDO);
	}

	private static getPathIndex() {
		return Paths.join(Scene.Map.current?.getPath(), Paths.TEMP_UNDO_REDO, Paths.INDEX);
	}

	private static async getSortedStateFiles(): Promise<string[]> {
		if (!Project.current) return [];
		const files = await getFiles(this.getPathStates());
		return files.filter((f) => f !== Paths.INDEX).sort();
	}

	static async getStatesLength() {
		return (await this.getSortedStateFiles()).length;
	}

	static async getCurrentCurrentIndex() {
		const currentFile = (await readFile(this.getPathIndex()))?.trim() ?? '';
		if (currentFile !== '') {
			const files = await this.getSortedStateFiles();
			return files.indexOf(currentFile);
		}
		return -1;
	}

	private static async saveCurrentStateFile(filename: string) {
		await createFile(this.getPathIndex(), filename);
	}

	private static async getStatesAt(filename: string) {
		const states: UndoRedoState[] = [];
		const content = await readFile(Paths.join(this.getPathStates(), filename));
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

	private static async applyStates(filename: string, before: boolean) {
		const states = await this.getStatesAt(filename);
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

	private static async action(before: boolean, indexOffset: number) {
		Scene.Map.current!.removeTransform();
		const files = await this.getSortedStateFiles();
		const currentFile = (await readFile(this.getPathIndex()))?.trim() ?? '';
		let pos = files.indexOf(currentFile);

		if (before && pos >= 0) {
			await this.applyStates(files[pos], true);
		}
		pos = Math.min(Math.max(-1, pos + indexOffset), files.length - 1);
		await this.saveCurrentStateFile(pos >= 0 ? files[pos] : '');
		if (!before && pos >= 0) {
			await this.applyStates(files[pos], false);
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
		const files = await this.getSortedStateFiles();
		const currentFile = (await readFile(this.getPathIndex()))?.trim() ?? '';
		const currentPos = files.indexOf(currentFile);

		// Remove all redo states (everything after the current position)
		for (let i = currentPos + 1; i < files.length; i++) {
			await removeFile(Paths.join(this.getPathStates(), files[i]));
		}

		// If at max capacity, remove the oldest state to make room
		if (currentPos + 1 >= this.MAX_SAVES) {
			await removeFile(Paths.join(this.getPathStates(), files[0]));
		}

		// Create new state file named by current timestamp
		const filename = `${Date.now()}.json`;
		const arrayJson: JSONType[] = [];
		for (const state of states) {
			const json = {};
			state.write(json);
			arrayJson.push(json);
		}
		await createFile(Paths.join(this.getPathStates(), filename), JSON.stringify(arrayJson));
		await this.saveCurrentStateFile(filename);

		const newFiles = await this.getSortedStateFiles();
		const newIndex = newFiles.indexOf(filename);
		return { index: newIndex, length: newFiles.length };
	}
}

export { UndoRedo };
