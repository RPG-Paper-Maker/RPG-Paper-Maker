import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
export interface ProjectState {
	name: string;
	location: string;
}

const ProjectsSlice = createSlice({
	name: 'projects',
	initialState: {
		current: '',
		loading: false,
		openLoading: false,
		list: [] as ProjectState[],
		menuIndex: 1,
	},
	reducers: {
		setCurrentProjectName(state, action: PayloadAction<string>) {
			state.current = action.payload;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setOpenLoading(state, action: PayloadAction<boolean>) {
			state.openLoading = action.payload;
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
		setProjectMenuIndex(state, action: PayloadAction<number>) {
			state.menuIndex = action.payload;
		},
	},
});

export const {
	setCurrentProjectName,
	setLoading,
	setOpenLoading,
	setProjects,
	addProject,
	removeProject,
	clearProjects,
	setProjectMenuIndex,
} = ProjectsSlice.actions;
export const ProjectsReducer = ProjectsSlice.reducer;
