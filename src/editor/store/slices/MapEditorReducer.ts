import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Rectangle } from '../../core/Rectangle';
import { Model } from '../../Editor';
import { TreeMapTag } from '../../models';
export interface ProjectState {
	name: string;
	location: string;
}

const MapEditorSlice = createSlice({
	name: 'mapEditor',
	initialState: {
		currentTreeMapTag: null as TreeMapTag | null,
		currentTilesetTexture: new Rectangle(0, 0, 1, 1),
	},
	reducers: {
		setCurrentTreeMapTag(state, action: PayloadAction<Model.TreeMapTag | null>) {
			state.currentTreeMapTag = action.payload;
		},
		setCurrentTilesetTexture(state, action: PayloadAction<Rectangle>) {
			state.currentTilesetTexture = action.payload;
		},
	},
});

export const { setCurrentTreeMapTag, setCurrentTilesetTexture } = MapEditorSlice.actions;
export const MapEditorReducer = MapEditorSlice.reducer;
