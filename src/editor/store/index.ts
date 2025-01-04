/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { configureStore } from '@reduxjs/toolkit';
import {
	MapEditorReducer,
	setCurrentActionKind,
	setCurrentAutotileID,
	setCurrentAutotileTexture,
	setCurrentElementPositionKind,
	setCurrentLayerKind,
	setCurrentMapElementKind,
	setCurrentMountainHeightPixels,
	setCurrentMountainHeightSquares,
	setCurrentMountainID,
	setCurrentMountainWidthPixels,
	setCurrentMountainWidthSquares,
	setCurrentObject3DID,
	setCurrentTilesetFloorTexture,
	setCurrentTilesetSpriteTexture,
	setCurrentTreeMapTag,
	setCurrentWallID,
	setNeedsUpdateMapEditor,
	setSelectedMapElement,
	setSelectedPosition,
	setUndoRedoIndex,
	setUndoRedoLength,
} from './slices/MapEditorReducer';
import {
	clearProjects,
	ProjectsReducer,
	setCopiedItems,
	setCurrentProject,
	setLoading,
	setOpenLoading,
	setProjectMenuIndex,
	setProjects,
} from './slices/ProjectsReducer';
import {
	setNeedsReloadMap,
	setNeedsReloadPageClearCache,
	setNeedsReloadPageUpdate,
	triggerImportProject,
	triggerMenu,
	triggerNewProject,
	triggerOpenDialogProject,
	triggerOpenProject,
	triggerPlay,
	triggerSave,
	triggerSaveAll,
	triggerSplitting,
	TriggersReducer,
	triggerSystems,
	triggerTreeMap,
	triggerVariables,
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
	clearProjects,
	setCopiedItems,
	setCurrentActionKind,
	setCurrentAutotileID,
	setCurrentAutotileTexture,
	setCurrentElementPositionKind,
	setCurrentLayerKind,
	setCurrentMapElementKind,
	setCurrentMountainHeightPixels,
	setCurrentMountainHeightSquares,
	setCurrentMountainID,
	setCurrentMountainWidthPixels,
	setCurrentMountainWidthSquares,
	setCurrentObject3DID,
	setCurrentProject,
	setCurrentTilesetFloorTexture,
	setCurrentTilesetSpriteTexture,
	setCurrentTreeMapTag,
	setCurrentWallID,
	setLoading,
	setNeedsReloadMap,
	setNeedsReloadPageClearCache,
	setNeedsReloadPageUpdate,
	setNeedsUpdateMapEditor,
	setOpenLoading,
	setProjectMenuIndex,
	setProjects,
	setSelectedMapElement,
	setSelectedPosition,
	setUndoRedoIndex,
	setUndoRedoLength,
	store,
	triggerImportProject,
	triggerMenu,
	triggerNewProject,
	triggerOpenDialogProject,
	triggerOpenProject,
	triggerPlay,
	triggerSave,
	triggerSaveAll,
	triggerSplitting,
	triggerSystems,
	triggerTreeMap,
	triggerVariables,
};
export type RootState = ReturnType<typeof store.getState>;
