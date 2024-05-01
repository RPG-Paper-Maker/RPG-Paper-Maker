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
	setNeedsUpdateMapEditor,
} from './slices/MapEditorReducer';
import {
	setCurrentProject,
	setLoading,
	setOpenLoading,
	setProjects,
	clearProjects,
	setProjectMenuIndex,
	setCopiedItems,
} from './slices/ProjectsReducer';
import {
	triggerNewProject,
	triggerImportProject,
	triggerOpenDialogProject,
	triggerOpenProject,
	triggerSave,
	triggerSaveAll,
	triggerPlay,
	triggerSplitting,
	triggerTreeMap,
	triggerMenu,
	setNeedsReloadPageUpdate,
	setNeedsReloadPageClearCache,
	setNeedsReloadMap,
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
	setNeedsUpdateMapEditor,
	setCurrentProject,
	setLoading,
	setOpenLoading,
	setProjects,
	clearProjects,
	setProjectMenuIndex,
	setCopiedItems,
	triggerNewProject,
	triggerImportProject,
	triggerOpenDialogProject,
	triggerOpenProject,
	triggerSave,
	triggerSaveAll,
	triggerPlay,
	triggerSplitting,
	triggerTreeMap,
	triggerMenu,
	setNeedsReloadPageUpdate,
	setNeedsReloadPageClearCache,
	setNeedsReloadMap,
};
export type RootState = ReturnType<typeof store.getState>;
