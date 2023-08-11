import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface ProjectState {
	name: string;
	location: string;
}

const TriggersSlice = createSlice({
	name: 'mainActions',
	initialState: {
		mainBar: {
			newProject: false,
			importProject: false,
			openProject: '',
			play: false,
		},
		splitting: false,
		treeMap: false,
	},
	reducers: {
		triggerNewProject(state, action: PayloadAction<boolean>) {
			state.mainBar.newProject = action.payload;
		},
		triggerImportProject(state, action: PayloadAction<boolean>) {
			state.mainBar.importProject = action.payload;
		},
		triggerOpenProject(state, action: PayloadAction<string>) {
			state.mainBar.openProject = action.payload;
		},
		triggerPlay(state, action: PayloadAction<boolean>) {
			state.mainBar.play = action.payload;
		},
		triggerSplitting(state) {
			state.splitting = !state.splitting;
		},
		triggerTreeMap(state) {
			state.treeMap = !state.treeMap;
		},
	},
});

export const {
	triggerNewProject,
	triggerImportProject,
	triggerOpenProject,
	triggerPlay,
	triggerSplitting,
	triggerTreeMap,
} = TriggersSlice.actions;
export const TriggersReducer = TriggersSlice.reducer;
