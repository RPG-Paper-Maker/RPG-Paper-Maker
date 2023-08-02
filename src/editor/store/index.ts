import { configureStore } from '@reduxjs/toolkit';
import { ProjectsReducer } from './slices/ProjectsReducer';
import { TriggersReducer } from './slices/TriggersReducer';
import {
	setCurrentProjectName,
	setCurrentMapID,
	setLoading,
	setProjects,
	addProject,
	removeProject,
	clearProjects,
} from './slices/ProjectsReducer';
import { triggerNewProject, triggerImportProject, triggerOpenProject, triggerPlay } from './slices/TriggersReducer';

const store = configureStore({
	reducer: {
		projects: ProjectsReducer,
		triggers: TriggersReducer,
	},
});

export {
	store,
	setCurrentProjectName,
	setCurrentMapID,
	setLoading,
	setProjects,
	addProject,
	removeProject,
	clearProjects,
	triggerNewProject,
	triggerImportProject,
	triggerOpenProject,
	triggerPlay,
};
export type RootState = ReturnType<typeof store.getState>;
