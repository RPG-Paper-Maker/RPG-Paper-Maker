/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

export enum LOCAL_FORAGE {
	PROJECTS = 'projects',
	ENGINE_SETTINGS = 'engineSettings',
}

export enum OBJECT_3D_EXTENSION {
	NONE,
	OBJ,
	GLTF,
}

export enum PREVIEWER_TYPE {
	OBJECTS,
	SHADERS,
}

export enum MODEL_TYPE {
	BASE,
}

export enum ELEMENT_MAP_KIND {
	NONE,
	FLOOR,
	AUTOTILE,
	WATER,
	SPRITE_FACE,
	SPRITE_FIX,
	SPRITE_DOUBLE,
	SPRITE_QUADRA,
	SPRITE_WALL,
	OBJECT,
	OBJECT3D,
	MOUNTAIN,
}

export enum MENU_INDEX_MAP_EDITOR {
	LANDS,
	SPRITES,
	MOUNTAINS,
	OBJECTS3D,
	OBJECTS,
}

export enum MENU_INDEX_LANDS_MAP_EDITOR {
	FLOOR,
	AUTOTILE,
}

export enum MENU_INDEX_SPRITES_MAP_EDITOR {
	SPRITE_FACE,
	SPRITE_FIX,
	SPRITE_DOUBLE,
	SPRITE_QUADRA,
	SPRITE_WALL,
}

export enum DIRECTION {
	SOUTH,
	WEST,
	NORTH,
	EAST,
	SOUTH_WEST,
	SOUTH_EAST,
	NORTH_WEST,
	NORTH_EAST,
	UP,
	DOWN,
	NONE,
}

export enum RAYCASTING_LAYER {
	PLANE = 1,
	FLOORS = 2,
	SPRITES = 3,
	WALLS = 4,
}

export enum MOBILE_ACTION {
	PLUS = 1,
	MINUS = 2,
	MOVE = 3,
}

export enum SPECIAL_KEY {
	CTRL = 'CTRL',
	SHIFT = 'SHIFT',
	ALT = 'ALT',
}

export enum KEY {
	N = 'N',
	S = 'S',
	I = 'I',
	E = 'E',
	Q = 'Q',
	Z = 'Z',
	P = 'P',
	W = 'W',
	A = 'A',
	D = 'D',
	UP = 'UP',
	DOWN = 'DOWN',
}

export enum BINDING {
	NUMBER,
	STRING,
	BOOLEAN,
	OBJECT,
	LIST,
	LIST_WITH_INDEXES,
	POSITION,
	MAP_POSITION,
	RECTANGLE,
}

export enum MOUNTAIN_COLLISION_KIND {
	DEFAULT,
	ALWAYS,
	NEVER,
}

export enum SHAPE_KIND {
	BOX,
	SPHERE,
	CYLINDER,
	CONE,
	CAPSULE,
	CUSTOM,
}

export enum OBJECT_COLLISION_KIND {
	NONE,
	PERFECT,
	SIMPLIFIED,
	CUSTOM,
}

export enum PICTURE_KIND {
	NONE,
	BARS,
	ICONS,
	AUTOTILES,
	CHARACTERS,
	MOUNTAINS,
	TILESETS,
	WALLS,
	BATTLERS,
	FACESETS,
	WINDOW_SKINS,
	TITLE_SCREENS,
	OBJECTS_3D,
	PICTURES,
	ANIMATIONS,
	SKYBOXES,
	PARTICLES,
	GAME_OVERS,
}

export enum AUTOTILE_TILE_NAMES {
	A1 = 'A1',
	A2 = 'A2',
	A3 = 'A3',
	A4 = 'A4',
	A5 = 'A5',
	B1 = 'B1',
	B2 = 'B2',
	B3 = 'B3',
	B4 = 'B4',
	B5 = 'B5',
	C1 = 'C1',
	C2 = 'C2',
	C3 = 'C3',
	C4 = 'C4',
	C5 = 'C5',
	D1 = 'D1',
	D2 = 'D2',
	D3 = 'D3',
	D4 = 'D4',
	D5 = 'D5',
}

export enum SPRITE_WALL_TYPE {
	LEFT,
	MIDDLE,
	RIGHT,
	LEFT_RIGHT,
}
