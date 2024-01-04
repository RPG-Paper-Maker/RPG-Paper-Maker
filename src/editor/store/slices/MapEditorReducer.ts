/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { MapElement, Model } from '../../Editor';
import { Position, Rectangle } from '../../core';
import { ACTION_KIND, ELEMENT_MAP_KIND, ELEMENT_POSITION_KIND } from '../../common';

export interface ProjectState {
	name: string;
	location: string;
}

const MapEditorSlice = createSlice({
	name: 'mapEditor',
	initialState: {
		currentTreeMapTag: null as Model.TreeMapTag | null,
		currentTilesetFloorTexture: new Rectangle(0, 0, 1, 1),
		currentTilesetSpriteTexture: new Rectangle(0, 1, 2, 2),
		currentAutotileID: 1,
		currentAutotileTexture: new Rectangle(0, 0, 1, 1),
		currentWallID: 1,
		currentMountainID: 1,
		currentMountainWidthSquares: 0,
		currentMountainWidthPixels: 0,
		currentMountainHeightSquares: 1,
		currentMountainHeightPixels: 0,
		currentObject3DID: 1,
		currentMapElementKind: ELEMENT_MAP_KIND.FLOOR,
		currentActionKind: ACTION_KIND.PENCIL,
		currentElementPositionKind: ELEMENT_POSITION_KIND.SQUARE,
		selectedPosition: null as Position | null,
		selectedMapElement: null as MapElement.Base | null,
		undoRedo: {
			index: -1,
			length: 0,
		},
	},
	reducers: {
		setCurrentTreeMapTag(state, action: PayloadAction<Model.TreeMapTag | null>) {
			state.currentTreeMapTag = action.payload;
		},
		setCurrentTilesetFloorTexture(state, action: PayloadAction<Rectangle>) {
			state.currentTilesetFloorTexture = action.payload;
		},
		setCurrentTilesetSpriteTexture(state, action: PayloadAction<Rectangle>) {
			state.currentTilesetSpriteTexture = action.payload;
		},
		setCurrentAutotileID(state, action: PayloadAction<number>) {
			state.currentAutotileID = action.payload;
		},
		setCurrentAutotileTexture(state, action: PayloadAction<Rectangle>) {
			state.currentAutotileTexture = action.payload;
		},
		setCurrentWallID(state, action: PayloadAction<number>) {
			state.currentWallID = action.payload;
		},
		setCurrentMountainID(state, action: PayloadAction<number>) {
			state.currentMountainID = action.payload;
		},
		setCurrentMountainWidthSquares(state, action: PayloadAction<number>) {
			state.currentMountainWidthSquares = action.payload;
		},
		setCurrentMountainWidthPixels(state, action: PayloadAction<number>) {
			state.currentMountainWidthPixels = action.payload;
		},
		setCurrentMountainHeightSquares(state, action: PayloadAction<number>) {
			state.currentMountainHeightSquares = action.payload;
		},
		setCurrentMountainHeightPixels(state, action: PayloadAction<number>) {
			state.currentMountainHeightPixels = action.payload;
		},
		setCurrentObject3DID(state, action: PayloadAction<number>) {
			state.currentObject3DID = action.payload;
		},
		setCurrentMapElementKind(state, action: PayloadAction<ELEMENT_MAP_KIND>) {
			state.currentMapElementKind = action.payload;
		},
		setCurrentActionKind(state, action: PayloadAction<ACTION_KIND>) {
			state.currentActionKind = action.payload;
		},
		setCurrentElementPositionKind(state, action: PayloadAction<ELEMENT_POSITION_KIND>) {
			state.currentElementPositionKind = action.payload;
		},
		setSelectedPosition(state, action: PayloadAction<Position | null>) {
			state.selectedPosition = action.payload;
		},
		setSelectedMapElement(state, action: PayloadAction<MapElement.Base | null>) {
			state.selectedMapElement = action.payload;
		},
		setUndoRedoIndex(state, action: PayloadAction<number>) {
			state.undoRedo.index = action.payload;
		},
		setUndoRedoLength(state, action: PayloadAction<number>) {
			state.undoRedo.length = action.payload;
		},
	},
});

export const {
	setCurrentTreeMapTag,
	setCurrentTilesetFloorTexture,
	setCurrentTilesetSpriteTexture,
	setCurrentAutotileID,
	setCurrentAutotileTexture,
	setCurrentWallID,
	setCurrentMountainID,
	setCurrentMountainWidthSquares,
	setCurrentMountainWidthPixels,
	setCurrentMountainHeightSquares,
	setCurrentMountainHeightPixels,
	setCurrentObject3DID,
	setCurrentMapElementKind,
	setCurrentActionKind,
	setCurrentElementPositionKind,
	setSelectedPosition,
	setSelectedMapElement,
	setUndoRedoIndex,
	setUndoRedoLength,
} = MapEditorSlice.actions;
export const MapEditorReducer = MapEditorSlice.reducer;
