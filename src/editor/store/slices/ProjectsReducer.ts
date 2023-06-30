import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
interface ProjectState {
	name: string;
	location: string;
}

const projectsSlice = createSlice({
	name: 'projects',
	initialState: {
		current: '',
		loading: false,
		list: [] as ProjectState[],
	},
	reducers: {
		setCurrentProjectName(state, action: PayloadAction<string>) {
			state.current = action.payload;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		addProject(state, action: PayloadAction<ProjectState>) {
			state.list.push(action.payload);
		},
		clearProjects(state) {
			state.list = [];
		},
	},
});

export const { setCurrentProjectName, setLoading, addProject, clearProjects } = projectsSlice.actions;
export const ProjectsReducer = projectsSlice.reducer;
