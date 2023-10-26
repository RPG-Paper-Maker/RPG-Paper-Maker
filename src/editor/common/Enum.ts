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
