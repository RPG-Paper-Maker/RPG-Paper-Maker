/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
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
			openProject: '',
			save: false,
			saveAll: false,
			play: false,
		},
		splitting: false,
		treeMap: false,
		menu: false,
		needsReloadPage: false,
	},
	reducers: {
		triggerNewProject(state, action: PayloadAction<boolean>) {
			state.mainBar.newProject = action.payload;
		},
		triggerImportProject(state, action: PayloadAction<boolean>) {
			state.mainBar.importProject = action.payload;
		},
		triggerOpenProject(state, action: PayloadAction<string>) {
			state.mainBar.openProject = action.payload;
		},
		triggerSave(state, action: PayloadAction<boolean>) {
			state.mainBar.save = action.payload;
		},
		triggerSaveAll(state, action: PayloadAction<boolean>) {
			state.mainBar.saveAll = action.payload;
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
		setNeedsReloadPage(state) {
			state.needsReloadPage = true;
		},
	},
});

export const {
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
} = TriggersSlice.actions;
export const TriggersReducer = TriggersSlice.reducer;
