/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef CONDITIONHEROESKIND_H
#define CONDITIONHEROESKIND_H

// -------------------------------------------------------
//
//  ENUM ConditionHeroesKind
//
//  All the possible kind of selection for heroes conditions.
//
// -------------------------------------------------------

enum class ConditionHeroesKind {
    AllTheHeroes,
    NoneOfTheHeroes,
    AtLeastOneHero,
    TheHeroeWithInstanceID
};

#endif // CONDITIONHEROESKIND_H
