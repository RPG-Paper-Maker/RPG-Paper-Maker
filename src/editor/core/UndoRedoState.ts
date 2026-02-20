/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ELEMENT_MAP_KIND, JSONType } from '../common';
import { MapElement, Model } from '../Editor';
import { CommonObject } from '../models';
import { Position } from './Position';
import { Serializable } from './Serializable';

class UndoRedoState extends Serializable {
	public static readonly JSON_POSITION = 'p';
	public static readonly JSON_ELEMENT_BEFORE = 'eb';
	public static readonly JSON_KIND_BEFORE = 'kb';
	public static readonly JSON_ELEMENT_AFTER = 'ea';
	public static readonly JSON_KIND_AFTER = 'ka';

	public position!: Position;
	public elementBefore!: MapElement.Base | Model.CommonObject | null;
	public kindBefore!: ELEMENT_MAP_KIND;
	public elementAfter!: MapElement.Base | Model.CommonObject | null;
	public kindAfter!: ELEMENT_MAP_KIND;

	static create(
		position: Position,
		elementBefore: MapElement.Base | Model.CommonObject | null,
		kindBefore: ELEMENT_MAP_KIND,
		elementAfter: MapElement.Base | Model.CommonObject | null,
		kindAfter: ELEMENT_MAP_KIND,
	) {
		const state = new UndoRedoState();
		state.position = position;
		state.elementBefore = elementBefore;
		state.kindBefore = kindBefore;
		state.elementAfter = elementAfter;
		state.kindAfter = kindAfter;
		return state;
	}

	read(json: JSONType): void {
		this.position = new Position();
		this.position.read(json[UndoRedoState.JSON_POSITION] as number[]);
		this.kindBefore = json[UndoRedoState.JSON_KIND_BEFORE] as number;
		this.kindAfter = json[UndoRedoState.JSON_KIND_AFTER] as number;
		let jsonElement = json[UndoRedoState.JSON_ELEMENT_BEFORE] as JSONType;
		this.elementBefore = MapElement.Base.readMapElement(this.kindBefore, jsonElement);
		if (this.kindBefore === ELEMENT_MAP_KIND.OBJECT && jsonElement) {
			this.elementBefore = new CommonObject();
			this.elementBefore.read(jsonElement);
		}
		jsonElement = json[UndoRedoState.JSON_ELEMENT_AFTER] as JSONType;
		this.elementAfter = MapElement.Base.readMapElement(this.kindAfter, jsonElement);
		if (this.kindAfter === ELEMENT_MAP_KIND.OBJECT && jsonElement) {
			this.elementAfter = new CommonObject();
			this.elementAfter.read(jsonElement);
		}
	}

	write(json: JSONType): void {
		const array: number[] = [];
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
