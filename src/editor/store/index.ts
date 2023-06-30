import { configureStore } from '@reduxjs/toolkit';
import { ProjectsReducer } from './slices/ProjectsReducer';
import { setCurrentProjectName, setLoading, addProject, clearProjects } from './slices/ProjectsReducer';

const store = configureStore({
	reducer: {
		projects: ProjectsReducer,
	},
});

export { store, setCurrentProjectName, setLoading, addProject, clearProjects };
export type RootState = ReturnType<typeof store.getState>;
