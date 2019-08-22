/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef TITLECOMMANDKIND_H
#define TITLECOMMANDKIND_H

// -------------------------------------------------------
//
//  ENUM TitleCommandKind
//
//  All the possible commands for title screen.
//
// -------------------------------------------------------

enum class TitleCommandKind {
    NewGame,
    LoadGame,
    Options,
    Exit,
    Script
};

#endif // TITLECOMMANDKIND_H
