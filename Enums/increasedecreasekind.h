/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
