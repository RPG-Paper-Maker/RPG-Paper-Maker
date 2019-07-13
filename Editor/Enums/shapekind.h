/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SHAPEKIND_H
#define SHAPEKIND_H

#include <QMetaType>

// -------------------------------------------------------
//
//  ENUM ShapeKind
//
//  All the possible shapes.
//
// -------------------------------------------------------

enum class ShapeKind {
    Box,
    Sphere,
    Cylinder,
    Cone,
    Capsule,
    Custom
};

inline uint qHash(ShapeKind pos)
{
   return static_cast<uint>(pos);
}

Q_DECLARE_METATYPE(ShapeKind)

#endif // SHAPEKIND_H
