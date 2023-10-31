import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Rectangle } from '../../core/Rectangle';
import { Model } from '../../Editor';
import { TreeMapTag } from '../../models';
import { ElementMapKind } from '../../common/Enum';
export interface ProjectState {
	name: string;
	location: string;
}

const MapEditorSlice = createSlice({
	name: 'mapEditor',
	initialState: {
		currentTreeMapTag: null as TreeMapTag | null,
		currentTilesetTexture: new Rectangle(0, 0, 1, 1),
		currentSpecialElementID: -1,
		currentMapElementKind: ElementMapKind.Floors,
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
		setCurrentSpecialElementID(state, action: PayloadAction<number>) {
			state.currentSpecialElementID = action.payload;
		},
		setCurrentMapElementKind(state, action: PayloadAction<ElementMapKind>) {
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
	setCurrentSpecialElementID,
	setCurrentMapElementKind,
	setUndoRedoIndex,
	setUndoRedoLength,
} = MapEditorSlice.actions;
export const MapEditorReducer = MapEditorSlice.reducer;