/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef INCREASEDECREASEKIND_H
#define INCREASEDECREASEKIND_H

// -------------------------------------------------------
//
//  ENUM IncreaseDecreaseKind
//
//  All the possible increase / decrease kind for characteristics.
//
// -------------------------------------------------------

enum class IncreaseDecreaseKind {
    StatValue,
    ElementRes,
    StatusRes,
    ExperienceGain,
    CurrencyGain,
    SkillCost,
    Variable
};


#endif // INCREASEDECREASEKIND_H
