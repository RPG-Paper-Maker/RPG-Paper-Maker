/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

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
	setMapEditorLoaded,
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
	triggerData,
	triggerFonts,
	triggerImportProject,
	triggerMenu,
	triggerNewProject,
	triggerOpenDialogProject,
	triggerOpenProject,
	triggerPictures,
	triggerPlay,
	triggerSave,
	triggerSaveAll,
	triggerShapes,
	triggerSongs,
	triggerSplitting,
	TriggersReducer,
	triggerSystems,
	triggerTreeMap,
	triggerVariables,
	triggerVideos,
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
	setMapEditorLoaded,
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
	triggerData,
	triggerFonts,
	triggerImportProject,
	triggerMenu,
	triggerNewProject,
	triggerOpenDialogProject,
	triggerOpenProject,
	triggerPictures,
	triggerPlay,
	triggerSave,
	triggerSaveAll,
	triggerShapes,
	triggerSongs,
	triggerSplitting,
	triggerSystems,
	triggerTreeMap,
	triggerVariables,
	triggerVideos,
};
export type RootState = ReturnType<typeof store.getState>;
