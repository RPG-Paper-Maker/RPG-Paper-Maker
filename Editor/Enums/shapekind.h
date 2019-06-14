/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
