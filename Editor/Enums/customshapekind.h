/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef CUSTOMSHAPEKIND_H
#define CUSTOMSHAPEKIND_H

#include <QMetaType>

// -------------------------------------------------------
//
//  ENUM CustomShapeKind
//
//  All the possible custom shapes infos.
//
// -------------------------------------------------------

enum class CustomShapeKind {
    None,
    OBJ,
    MTL,
    Collisions,
    Last
};

inline uint qHash(CustomShapeKind pos)
{
   return static_cast<uint>(pos);
}

Q_DECLARE_METATYPE(CustomShapeKind)

#endif // CUSTOMSHAPEKIND_H
