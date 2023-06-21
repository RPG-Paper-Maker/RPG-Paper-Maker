import { configureStore } from '@reduxjs/toolkit';
import { ProjectsReducer } from './slices/ProjectsReducer';
import { addProject, clearProjects } from './slices/ProjectsReducer';

const store = configureStore({
	reducer: {
		projects: ProjectsReducer,
	},
});

export { store, addProject, clearProjects };
