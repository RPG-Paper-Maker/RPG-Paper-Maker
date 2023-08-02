import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface ProjectState {
	name: string;
	location: string;
}

const projectsSlice = createSlice({
	name: 'projects',
	initialState: {
		current: '',
		currentMapID: -1,
		loading: false,
		list: [] as ProjectState[],
	},
	reducers: {
		setCurrentProjectName(state, action: PayloadAction<string>) {
			state.current = action.payload;
		},
		setCurrentMapID(state, action: PayloadAction<number>) {
			state.currentMapID = action.payload;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setProjects(state, action: PayloadAction<ProjectState[]>) {
			state.list = action.payload;
		},
		addProject(state, action: PayloadAction<ProjectState>) {
			state.list.push(action.payload);
		},
		removeProject(state, action: PayloadAction<string>) {
			state.list = state.list.filter((project) => project.name !== action.payload);
		},
		clearProjects(state) {
			state.list = [];
		},
	},
});

export const {
	setCurrentProjectName,
	setCurrentMapID,
	setLoading,
	setProjects,
	addProject,
	removeProject,
	clearProjects,
} = projectsSlice.actions;
export const ProjectsReducer = projectsSlice.reducer;
