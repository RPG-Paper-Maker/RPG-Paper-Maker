/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef TARGETKIND_H
#define TARGETKIND_H

// -------------------------------------------------------
//
//  ENUM TargetKind
//
//  All the possible target kind for skills.
//
// -------------------------------------------------------

enum class TargetKind {
    None,
    User,
    Enemy,
    Ally,
    AllEnemies,
    AllAllies
};

#endif // TARGETKIND_H
