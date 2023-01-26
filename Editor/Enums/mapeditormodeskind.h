/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef MAPEDITORMODESKIND_H
#define MAPEDITORMODESKIND_H

// -------------------------------------------------------
//
//  ENUM MapEditorModesKind
//
//  All the possible map editor modes.
//
// -------------------------------------------------------

enum class MapEditorModesKind {
    Square,
    Pixel,
    Sepator1,
    TransformTranslate,
    TransformRotate,
    TransformScale,
    DrawPencil,
    DrawRectangle,
    DrawPin,
    Sepator2,
    LayerNone,
    LayerOn
};

#endif // MAPEDITORMODESKIND_H
