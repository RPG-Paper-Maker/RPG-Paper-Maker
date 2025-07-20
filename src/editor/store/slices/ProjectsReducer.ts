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
import { Model } from '../../Editor';
import { CopiedItemsType } from '../../core/Node';

const ProjectsSlice = createSlice({
	name: 'projects',
	initialState: {
		current: null as Model.ProjectPreview | null,
		loading: false,
		loadingBarPercent: null as number | null,
		loadingBarLabel: null as string | null,
		openLoading: false,
		list: [] as Model.ProjectPreview[],
		menuIndex: 1,
		copiedItems: null as CopiedItemsType | null,
		warning: '',
		dialogsOpen: false,
	},
	reducers: {
		setCurrentProject(state, action: PayloadAction<Model.ProjectPreview | null>) {
			state.current = action.payload;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setLoadingBar(state, action: PayloadAction<{ percent: number; label: string } | null>) {
			state.loadingBarPercent = action.payload?.percent ?? null;
			state.loadingBarLabel = action.payload?.label ?? null;
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
		showWarning(state, action: PayloadAction<string>) {
			state.warning = action.payload;
		},
		setDialogsOpen(state, action: PayloadAction<boolean>) {
			state.dialogsOpen = action.payload;
		},
	},
});

export const {
	setCurrentProject,
	setLoading,
	setLoadingBar,
	setOpenLoading,
	setProjects,
	clearProjects,
	setProjectMenuIndex,
	setCopiedItems,
	showWarning,
	setDialogsOpen,
} = ProjectsSlice.actions;
export const ProjectsReducer = ProjectsSlice.reducer;
