/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    Last
};

inline uint qHash(PictureKind pos)
{
   return static_cast<uint>(pos);
}

Q_DECLARE_METATYPE(PictureKind)

#endif // PICTUREKIND_H
