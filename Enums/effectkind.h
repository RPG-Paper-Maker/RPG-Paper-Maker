/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
