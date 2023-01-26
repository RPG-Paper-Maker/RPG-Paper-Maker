/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef EFFECTKIND_H
#define EFFECTKIND_H

// -------------------------------------------------------
//
//  ENUM EffectKind
//
//  All the possible effects.
//
// -------------------------------------------------------

enum class EffectKind {
    Damages,
    Status,
    AddRemoveSkill,
    PerformSkill,
    CommonReaction,
    SpecialActions,
    Script
};

#endif // EFFECTKIND_H
