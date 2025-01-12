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
import { CopiedItemsType } from '../../common';
import { Model } from '../../Editor';

const ProjectsSlice = createSlice({
	name: 'projects',
	initialState: {
		current: null as Model.ProjectPreview | null,
		loading: false,
		openLoading: false,
		list: [] as Model.ProjectPreview[],
		menuIndex: 1,
		copiedItems: null as CopiedItemsType | null,
	},
	reducers: {
		setCurrentProject(state, action: PayloadAction<Model.ProjectPreview | null>) {
			state.current = action.payload;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setOpenLoading(state, action: PayloadAction<boolean>) {
			state.openLoading = action.payload;
		},
		setProjects(state, action: PayloadAction<Model.ProjectPreview[]>) {
			state.list = action.payload;
		},
		clearProjects(state) {
			state.list = [];
		},
		setProjectMenuIndex(state, action: PayloadAction<number>) {
			state.menuIndex = action.payload;
		},
		setCopiedItems(state, action: PayloadAction<CopiedItemsType | null>) {
			state.copiedItems = action.payload;
		},
	},
});

export const {
	setCurrentProject,
	setLoading,
	setOpenLoading,
	setProjects,
	clearProjects,
	setProjectMenuIndex,
	setCopiedItems,
} = ProjectsSlice.actions;
export const ProjectsReducer = ProjectsSlice.reducer;
