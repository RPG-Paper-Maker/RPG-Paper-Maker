/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef COLLISIONRESIZEKIND_H
#define COLLISIONRESIZEKIND_H

// -------------------------------------------------------
//
//  ENUM CollisionResizeKind
//
//  All the possible collision resize kind.
//
// -------------------------------------------------------

enum class CollisionResizeKind {
    None,
    Left,
    Right,
    Top,
    Bottom,
    TopLeft,
    TopRight,
    BotLeft,
    BotRight
};

#endif // COLLISIONRESIZEKIND_H
