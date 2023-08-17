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
import { Position } from './Position';
import { Serializable } from './Serializable';

class UndoRedoState extends Serializable {
	public static readonly JSON_POSITION = 'p';
	public static readonly JSON_ELEMENT_BEFORE = 'eb';
	public static readonly JSON_KIND_BEFORE = 'kb';
	public static readonly JSON_ELEMENT_AFTER = 'ea';
	public static readonly JSON_KIND_AFTER = 'ka';

	public position!: Position;
	public elementBefore!: MapElement.Base | null;
	public kindBefore!: ElementMapKind;
	public elementAfter!: MapElement.Base | null;
	public kindAfter!: ElementMapKind;

	static create(
		position: Position,
		elementBefore: MapElement.Base | null,
		kindBefore: ElementMapKind,
		elementAfter: MapElement.Base | null,
		kindAfter: ElementMapKind
	) {
		const state = new UndoRedoState();
		state.position = position;
		state.elementBefore = elementBefore;
		state.kindBefore = kindBefore;
		state.elementAfter = elementAfter;
		state.kindAfter = kindAfter;
		return state;
	}

	read(json: any): void {
		this.position = new Position();
		this.position.read(json[UndoRedoState.JSON_POSITION]);
		this.kindBefore = json[UndoRedoState.JSON_KIND_BEFORE];
		this.kindAfter = json[UndoRedoState.JSON_KIND_AFTER];
		this.elementBefore = MapElement.Base.readMapElement(this.kindBefore, json[UndoRedoState.JSON_ELEMENT_BEFORE]);
		this.elementAfter = MapElement.Base.readMapElement(this.kindAfter, json[UndoRedoState.JSON_ELEMENT_AFTER]);
	}

	write(json: any): void {
		const array: any[] = [];
		this.position.write(array);
		json[UndoRedoState.JSON_POSITION] = array;
		json[UndoRedoState.JSON_KIND_BEFORE] = this.kindBefore;
		json[UndoRedoState.JSON_KIND_AFTER] = this.kindAfter;
		let obj;
		if (this.elementBefore == null) {
			obj = null;
		} else {
			obj = {};
			this.elementBefore.write(obj);
		}
		json[UndoRedoState.JSON_ELEMENT_BEFORE] = obj;
		if (this.elementAfter == null) {
			obj = null;
		} else {
			obj = {};
			this.elementAfter.write(obj);
		}
		json[UndoRedoState.JSON_ELEMENT_AFTER] = obj;
	}
}

export { UndoRedoState };
