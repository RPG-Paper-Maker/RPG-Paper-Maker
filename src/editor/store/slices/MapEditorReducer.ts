import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Model } from '../../Editor';
import { Rectangle } from '../../core';
import { ELEMENT_MAP_KIND } from '../../common';

export interface ProjectState {
	name: string;
	location: string;
}

const MapEditorSlice = createSlice({
	name: 'mapEditor',
	initialState: {
		currentTreeMapTag: null as Model.TreeMapTag | null,
		currentTilesetTexture: new Rectangle(0, 0, 1, 1),
		currentAutotileID: 1,
		currentAutotileTexture: new Rectangle(0, 0, 1, 1),
		currentMapElementKind: ELEMENT_MAP_KIND.FLOOR,
		undoRedo: {
			index: -1,
			length: 0,
		},
	},
	reducers: {
		setCurrentTreeMapTag(state, action: PayloadAction<Model.TreeMapTag | null>) {
			state.currentTreeMapTag = action.payload;
		},
		setCurrentTilesetTexture(state, action: PayloadAction<Rectangle>) {
			state.currentTilesetTexture = action.payload;
		},
		setCurrentAutotileID(state, action: PayloadAction<number>) {
			state.currentAutotileID = action.payload;
		},
		setCurrentAutotileTexture(state, action: PayloadAction<Rectangle>) {
			state.currentAutotileTexture = action.payload;
		},
		setCurrentMapElementKind(state, action: PayloadAction<ELEMENT_MAP_KIND>) {
			state.currentMapElementKind = action.payload;
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
	setCurrentTilesetTexture,
	setCurrentAutotileID,
	setCurrentAutotileTexture,
	setCurrentMapElementKind,
	setUndoRedoIndex,
	setUndoRedoLength,
} = MapEditorSlice.actions;
export const MapEditorReducer = MapEditorSlice.reducer;
