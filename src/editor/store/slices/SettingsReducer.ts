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

const SettingsSlice = createSlice({
	name: 'settings',
	initialState: {
		theme: 'darkTheme',
	},
	reducers: {
		setTheme(state, action: PayloadAction<string>) {
			state.theme = action.payload;
		},
	},
});

export const { setTheme } = SettingsSlice.actions;
export const SettingsReducer = SettingsSlice.reducer;
