/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { configureStore } from '@reduxjs/toolkit';
import { MapEditorReducer } from './slices/MapEditorReducer';
import { ProjectsReducer } from './slices/ProjectsReducer';
import { TriggersReducer } from './slices/TriggersReducer';
import {
	setCurrentTreeMapTag,
	setCurrentTilesetFloorTexture,
	setCurrentTilesetSpriteTexture,
	setCurrentAutotileID,
	setCurrentAutotileTexture,
	setCurrentWallID,
	setCurrentMountainID,
	setCurrentMountainWidthSquares,
	setCurrentMountainWidthPixels,
	setCurrentMountainHeightSquares,
	setCurrentMountainHeightPixels,
	setCurrentObject3DID,
	setCurrentMapElementKind,
	setCurrentActionKind,
	setCurrentElementPositionKind,
	setCurrentLayerKind,
	setSelectedPosition,
	setSelectedMapElement,
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
	setNeedsReloadPage,
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
	setCurrentTilesetFloorTexture,
	setCurrentTilesetSpriteTexture,
	setCurrentAutotileID,
	setCurrentAutotileTexture,
	setCurrentWallID,
	setCurrentMountainID,
	setCurrentMountainWidthSquares,
	setCurrentMountainWidthPixels,
	setCurrentMountainHeightSquares,
	setCurrentMountainHeightPixels,
	setCurrentObject3DID,
	setCurrentMapElementKind,
	setCurrentActionKind,
	setCurrentElementPositionKind,
	setCurrentLayerKind,
	setSelectedPosition,
	setSelectedMapElement,
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
	setNeedsReloadPage,
};
export type RootState = ReturnType<typeof store.getState>;
