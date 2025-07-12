/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { ProjectPreview } from '../../models';
export interface ProjectState {
	name: string;
	location: string;
}

const TriggersSlice = createSlice({
	name: 'mainActions',
	initialState: {
		mainBar: {
			newProject: false,
			importProject: false,
			openDialogProject: false,
			openProject: null as ProjectPreview | null,
			save: false,
			saveAll: false,
			data: false,
			systems: false,
			variables: false,
			collisions: false,
			plugins: false,
			pictures: false,
			videos: false,
			songs: false,
			shapes: false,
			fonts: false,
			autotiles: false,
			walls: false,
			objects3D: false,
			mountains: false,
			play: false,
		},
		splitting: false,
		treeMap: false,
		menu: false,
		needsReloadPageUpdate: false,
		needsReloadPageClearCache: false,
		needsReloadMap: false,
		isOpeningNewDialog: false,
	},
	reducers: {
		triggerNewProject(state, action: PayloadAction<boolean>) {
			state.mainBar.newProject = action.payload;
		},
		triggerImportProject(state, action: PayloadAction<boolean>) {
			state.mainBar.importProject = action.payload;
		},
		triggerOpenDialogProject(state, action: PayloadAction<boolean>) {
			state.mainBar.openDialogProject = action.payload;
		},
		triggerOpenProject(state, action: PayloadAction<ProjectPreview | null>) {
			state.mainBar.openProject = action.payload;
		},
		triggerSave(state, action: PayloadAction<boolean>) {
			state.mainBar.save = action.payload;
		},
		triggerSaveAll(state, action: PayloadAction<boolean>) {
			state.mainBar.saveAll = action.payload;
		},
		triggerData(state, action: PayloadAction<boolean>) {
			state.mainBar.data = action.payload;
		},
		triggerSystems(state, action: PayloadAction<boolean>) {
			state.mainBar.systems = action.payload;
		},
		triggerVariables(state, action: PayloadAction<boolean>) {
			state.mainBar.variables = action.payload;
		},
		triggerCollisions(state, action: PayloadAction<boolean>) {
			state.mainBar.collisions = action.payload;
		},
		triggerPlugins(state, action: PayloadAction<boolean>) {
			state.mainBar.plugins = action.payload;
		},
		triggerPictures(state, action: PayloadAction<boolean>) {
			state.mainBar.pictures = action.payload;
		},
		triggerVideos(state, action: PayloadAction<boolean>) {
			state.mainBar.videos = action.payload;
		},
		triggerSongs(state, action: PayloadAction<boolean>) {
			state.mainBar.songs = action.payload;
		},
		triggerShapes(state, action: PayloadAction<boolean>) {
			state.mainBar.shapes = action.payload;
		},
		triggerFonts(state, action: PayloadAction<boolean>) {
			state.mainBar.fonts = action.payload;
		},
		triggerAutotiles(state, action: PayloadAction<boolean>) {
			state.mainBar.autotiles = action.payload;
		},
		triggerWalls(state, action: PayloadAction<boolean>) {
			state.mainBar.walls = action.payload;
		},
		triggerObjects3D(state, action: PayloadAction<boolean>) {
			state.mainBar.objects3D = action.payload;
		},
		triggerMountains(state, action: PayloadAction<boolean>) {
			state.mainBar.mountains = action.payload;
		},
		triggerPlay(state, action: PayloadAction<boolean>) {
			state.mainBar.play = action.payload;
		},
		triggerSplitting(state) {
			state.splitting = !state.splitting;
		},
		triggerTreeMap(state) {
			state.treeMap = !state.treeMap;
		},
		triggerMenu(state) {
			state.menu = !state.menu;
		},
		setNeedsReloadPageUpdate(state) {
			state.needsReloadPageUpdate = true;
		},
		setNeedsReloadPageClearCache(state) {
			state.needsReloadPageClearCache = true;
		},
		setNeedsReloadMap(state) {
			state.needsReloadMap = !state.needsReloadMap;
		},
		setIsOpeningNewDialog(state) {
			state.isOpeningNewDialog = !state.isOpeningNewDialog;
		},
	},
});

export const {
	triggerNewProject,
	triggerImportProject,
	triggerOpenDialogProject,
	triggerOpenProject,
	triggerSave,
	triggerSaveAll,
	triggerData,
	triggerSystems,
	triggerVariables,
	triggerCollisions,
	triggerPlugins,
	triggerPictures,
	triggerSongs,
	triggerFonts,
	triggerShapes,
	triggerVideos,
	triggerAutotiles,
	triggerPlay,
	triggerSplitting,
	triggerTreeMap,
	triggerMenu,
	triggerWalls,
	triggerObjects3D,
	triggerMountains,
	setNeedsReloadPageUpdate,
	setNeedsReloadPageClearCache,
	setNeedsReloadMap,
	setIsOpeningNewDialog,
} = TriggersSlice.actions;
export const TriggersReducer = TriggersSlice.reducer;
