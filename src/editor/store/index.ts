import { configureStore } from '@reduxjs/toolkit';
import { ProjectsReducer } from './slices/ProjectsReducer';
import { TriggersReducer } from './slices/TriggersReducer';
import {
	setCurrentProjectName,
	setLoading,
	setProjects,
	addProject,
	removeProject,
	clearProjects,
} from './slices/ProjectsReducer';
import { triggerNewProject, triggerImportProject, triggerOpenProject } from './slices/TriggersReducer';

const store = configureStore({
	reducer: {
		projects: ProjectsReducer,
		triggers: TriggersReducer,
	},
});

export {
	store,
	setCurrentProjectName,
	setLoading,
	setProjects,
	addProject,
	removeProject,
	clearProjects,
	triggerNewProject,
	triggerImportProject,
	triggerOpenProject,
};
export type RootState = ReturnType<typeof store.getState>;
