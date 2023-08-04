import { configureStore } from '@reduxjs/toolkit';
import { MapEditorReducer } from './slices/MapEditorReducer';
import { ProjectsReducer } from './slices/ProjectsReducer';
import { TriggersReducer } from './slices/TriggersReducer';
import { setCurrentMapID, setCurrentTilesetTexture } from './slices/MapEditorReducer';
import {
	setCurrentProjectName,
	setLoading,
	setOpenLoading,
	setProjects,
	addProject,
	removeProject,
	clearProjects,
} from './slices/ProjectsReducer';
import {
	triggerNewProject,
	triggerImportProject,
	triggerOpenProject,
	triggerPlay,
	triggerSplitting,
} from './slices/TriggersReducer';

const store = configureStore({
	reducer: {
		mapEditor: MapEditorReducer,
		projects: ProjectsReducer,
		triggers: TriggersReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export {
	store,
	setCurrentMapID,
	setCurrentTilesetTexture,
	setCurrentProjectName,
	setLoading,
	setOpenLoading,
	setProjects,
	addProject,
	removeProject,
	clearProjects,
	triggerNewProject,
	triggerImportProject,
	triggerOpenProject,
	triggerPlay,
	triggerSplitting,
};
export type RootState = ReturnType<typeof store.getState>;
