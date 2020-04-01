/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PICTUREKIND_H
#define PICTUREKIND_H

#include <QMetaType>

// -------------------------------------------------------
//
//  ENUM PictureKind
//
//  All the possible picutres.
//
// -------------------------------------------------------

enum class PictureKind {
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
    Object3D,
    Pictures,
    Animations,
    SkyBoxes,
    Last
};

inline uint qHash(PictureKind pos)
{
   return static_cast<uint>(pos);
}

Q_DECLARE_METATYPE(PictureKind)

#endif // PICTUREKIND_H
