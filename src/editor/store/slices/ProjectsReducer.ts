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
	},
	reducers: {
		setCurrentProjectName(state, action: PayloadAction<string>) {
			state.current = action.payload;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setOpenLoading(state, action: PayloadAction<boolean>) {
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

export const { setCurrentProjectName, setLoading, setProjects, addProject, removeProject, clearProjects } =
	ProjectsSlice.actions;
export const ProjectsReducer = ProjectsSlice.reducer;
