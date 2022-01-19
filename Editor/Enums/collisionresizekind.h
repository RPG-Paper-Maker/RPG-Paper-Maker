/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
