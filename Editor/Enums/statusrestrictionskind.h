/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef STATUSRESTRICTIONSKIND_H
#define STATUSRESTRICTIONSKIND_H

// -------------------------------------------------------
//
//  ENUM StatusRestrictionsKind
//
//  All the possible status restrictions kind.
//
// -------------------------------------------------------

enum class StatusRestrictionsKind {
    None,
    CantDoAnything,
    CantUseSkills,
    CantUseItems,
    CantEscape,
    AttackRandomTarget,
    AttackRandomAlly,
    AttackRandomEnemy
};

#endif // STATUSRESTRICTIONSKIND_H
