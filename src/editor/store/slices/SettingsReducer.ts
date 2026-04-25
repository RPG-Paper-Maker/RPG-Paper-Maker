/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

const SettingsSlice = createSlice({
	name: 'settings',
	initialState: {
		theme: 'darkTheme',
		engineFontSize: 12,
	},
	reducers: {
		setTheme(state, action: PayloadAction<string>) {
			state.theme = action.payload;
		},
		setEngineFontSize(state, action: PayloadAction<number>) {
			state.engineFontSize = action.payload;
		},
	},
});

export const { setTheme, setEngineFontSize } = SettingsSlice.actions;
export const SettingsReducer = SettingsSlice.reducer;
