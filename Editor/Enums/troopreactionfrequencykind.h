/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef TROOPREACTIONFREQUENCYKIND_H
#define TROOPREACTIONFREQUENCYKIND_H

// -------------------------------------------------------
//
//  ENUM TroopReactionFrequencyKind
//
//  All the possible troop reaction frequency kind.
//
// -------------------------------------------------------

enum class TroopReactionFrequencyKind {
    OneTime,
    EachTurnBegin,
    EachTurnEnd,
    Always
};

#endif // TROOPREACTIONFREQUENCYKIND_H
