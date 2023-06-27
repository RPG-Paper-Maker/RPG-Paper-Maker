import { configureStore } from '@reduxjs/toolkit';
import { ProjectsReducer } from './slices/ProjectsReducer';
import { setCurrentProjectName, addProject, clearProjects } from './slices/ProjectsReducer';

const store = configureStore({
	reducer: {
		projects: ProjectsReducer,
	},
});

export { store, setCurrentProjectName, addProject, clearProjects };
export type RootState = ReturnType<typeof store.getState>;
