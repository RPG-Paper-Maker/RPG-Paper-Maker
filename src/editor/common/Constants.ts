/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { STATE_OVERRIDE_GROUP } from './Enum';

class Constants {
	public static readonly NUMBER = 'number';
	public static readonly STRING = 'string';
	public static readonly NUM_BOOL_TRUE = 1;
	public static readonly NUM_BOOL_FALSE = 0;
	public static readonly BASE_SQUARE_SIZE = 32;
	public static readonly PORTION_SIZE = 16;
	public static readonly MOBILE_WIDTH = 800;
	public static readonly CURSOR_MOVE_MOBILE_PERCENT = 10;
	public static readonly SPECIAL_ELEMENTS_IMAGE_SIZE = 100;
	public static readonly MAX_PICTURE_SIZE = 4096;
	public static readonly PRECISION_POSITION = 0.000000001;
	public static readonly DEFAULT_FONT_NAME = 'Arial';
	public static readonly COLOR_DARK_BACKGROUND = '#221f2e';
	public static readonly COLOR_HOVER_GREY = '#323232';
	public static readonly COLOR_PRIMARY = '#25bbb9';
	public static readonly COLOR_GREEN = '#78ad51';
	public static readonly COLOR_RED = '#de3a3c';
	public static readonly THEMES = ['darkTheme', 'whiteTheme'];
	public static IS_MOBILE = false;
	public static IS_DESKTOP = false;
	public static USER_LOCALE = '';
	public static readonly STATE_GROUP_KEYS: Record<STATE_OVERRIDE_GROUP, string[]> = {
		[STATE_OVERRIDE_GROUP.GRAPHICS]: ['gk', 'gid', 'x', 'y', 'rt'],
		[STATE_OVERRIDE_GROUP.MOVING]: ['omk', 'ecr', 's', 'f'],
		[STATE_OVERRIDE_GROUP.OPTIONS]: ['move', 'stop', 'climb', 'dir', 'through', 'cam', 'pix', 'pos'],
		[STATE_OVERRIDE_GROUP.TRANSFORM]: ['layer', 'cx', 'cz', 'ax', 'ay', 'az', 'sx', 'sy', 'sz', 'o'],
		[STATE_OVERRIDE_GROUP.LIGHTS]: ['l'],
		[STATE_OVERRIDE_GROUP.DETECTION]: ['ecd'],
	};
	public static readonly ALL_STATE_OVERRIDE_GROUPS = Object.values(STATE_OVERRIDE_GROUP);
}

export { Constants };
