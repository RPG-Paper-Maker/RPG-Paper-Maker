/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    MTL
};

inline uint qHash(CustomShapeKind pos)
{
   return static_cast<uint>(pos);
}

Q_DECLARE_METATYPE(CustomShapeKind)

#endif // CUSTOMSHAPEKIND_H
