/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef MAPEDITORSUBSELECTIONKIND_H
#define MAPEDITORSUBSELECTIONKIND_H

// -------------------------------------------------------
//
//  ENUM MapEditorSubSelectionKind
//
//  All the types of selection for the map editor.
//
// -------------------------------------------------------

enum class MapEditorSubSelectionKind {
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
    Mountains
};

#endif // MAPEDITORSUBSELECTIONKIND_H
