import { configureStore } from '@reduxjs/toolkit';
import { MapEditorReducer } from './slices/MapEditorReducer';
import { ProjectsReducer } from './slices/ProjectsReducer';
import { TriggersReducer } from './slices/TriggersReducer';
import {
	setCurrentTreeMapTag,
	setCurrentTilesetTexture,
	setCurrentMapElementKind,
	setUndoRedoIndex,
	setUndoRedoLength,
} from './slices/MapEditorReducer';
import {
	setCurrentProjectName,
	setLoading,
	setOpenLoading,
	setProjects,
	addProject,
	removeProject,
	clearProjects,
	setProjectMenuIndex,
} from './slices/ProjectsReducer';
import {
	triggerNewProject,
	triggerImportProject,
	triggerOpenProject,
	triggerSave,
	triggerSaveAll,
	triggerPlay,
	triggerSplitting,
	triggerTreeMap,
	triggerMenu,
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
	setCurrentTreeMapTag,
	setCurrentTilesetTexture,
	setCurrentMapElementKind,
	setUndoRedoIndex,
	setUndoRedoLength,
	setCurrentProjectName,
	setLoading,
	setOpenLoading,
	setProjects,
	addProject,
	removeProject,
	clearProjects,
	setProjectMenuIndex,
	triggerNewProject,
	triggerImportProject,
	triggerOpenProject,
	triggerSave,
	triggerSaveAll,
	triggerPlay,
	triggerSplitting,
	triggerTreeMap,
	triggerMenu,
};
export type RootState = ReturnType<typeof store.getState>;
