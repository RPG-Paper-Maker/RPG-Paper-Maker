import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Rectangle } from '../../core/Rectangle';
export interface ProjectState {
	name: string;
	location: string;
}

const MapEditorSlice = createSlice({
	name: 'mapEditor',
	initialState: {
		currentID: -1,
		currentTilesetTexture: new Rectangle(0, 0, 1, 1),
	},
	reducers: {
		setCurrentMapID(state, action: PayloadAction<number>) {
			state.currentID = action.payload;
		},
		setCurrentTilesetTexture(state, action: PayloadAction<Rectangle>) {
			state.currentTilesetTexture = action.payload;
		},
	},
});

export const { setCurrentMapID, setCurrentTilesetTexture } = MapEditorSlice.actions;
export const MapEditorReducer = MapEditorSlice.reducer;
