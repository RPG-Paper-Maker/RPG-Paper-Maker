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
		},
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
	},
});

export const { triggerNewProject, triggerImportProject, triggerOpenProject } = TriggersSlice.actions;
export const TriggersReducer = TriggersSlice.reducer;
