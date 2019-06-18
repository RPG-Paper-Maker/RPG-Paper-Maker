/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    Object3D
};

#endif // MAPEDITORSUBSELECTIONKIND_H
