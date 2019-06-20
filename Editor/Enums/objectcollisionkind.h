/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef OBJECTCOLLISIONKIND_H
#define OBJECTCOLLISIONKIND_H

// -------------------------------------------------------
//
//  ENUM ObjectCollisionKind
//
//  All the possible 3D object collision kind.
//
// -------------------------------------------------------

enum class ObjectCollisionKind {
    None,
    Perfect,
    Simplified,
    Custom
};

#endif // OBJECTCOLLISIONKIND_H