/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef AVAILABLEKIND_H
#define AVAILABLEKIND_H

// -------------------------------------------------------
//
//  ENUM AvailableKind
//
//  All the possible way for a skill to be available.
//
// -------------------------------------------------------

enum class AvailableKind {
    Battle,
    MainMenu,
    Always,
    Never
};

#endif // AVAILABLEKIND_H
