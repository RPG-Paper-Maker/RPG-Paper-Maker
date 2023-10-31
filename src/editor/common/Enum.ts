/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

export enum LocalForage {
	Projects = 'projects',
	EngineSettings = 'engineSettings',
}

export enum Object3DExtension {
	None,
	OBJ,
	GLTF,
}

export enum PreviewerType {
	Objects,
	Shaders,
}

export enum ModelType {
	Base,
	EffectPeriod,
}

export enum ElementMapKind {
	None,
	Floors,
	Autotiles,
	Water,
	SpritesFace,
	SpritesFix,
	SpritesDouble,
	SpritesQuadra,
	SpritesWall,
	Object,
	Object3D,
	Mountains,
}

export enum MenuIndexMapEditor {
	Lands,
	Sprites,
	Mountains,
	Objects3D,
	Objects,
}

export enum Direction {
	South,
	West,
	North,
	East,
	SouthWest,
	SouthEast,
	NorthWest,
	NorthEast,
	Up,
	Down,
	None,
}

export enum RaycastingLayer {
	Plane = 1,
	Floors = 2,
	Sprites = 3,
}

export enum MobileAction {
	Plus = 1,
	Minus = 2,
	Move = 3,
}

export enum SpecialKey {
	CTRL = 'CTRL',
	SHIFT = 'SHIFT',
	ALT = 'ALT',
}

export enum Key {
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

export enum MountainCollisionKind {
	Default,
	Always,
	Never,
}

export enum ShapeKind {
	Box,
	Sphere,
	Cylinder,
	Cone,
	Capsule,
	Custom,
}

export enum ObjectCollisionKind {
	None,
	Perfect,
	Simplified,
	Custom,
}

export enum PictureKind {
	None,
	Bars,
	Icons,
	Autotiles,
	Characters,
	Mountains,
	Tilesets,
	Walls,
	Battlers,
	Facesets,
	WindowSkins,
	TitleScreen,
	Objects3D,
	Pictures,
	Animations,
	Skyboxes,
	Particles,
	GameOver,
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
