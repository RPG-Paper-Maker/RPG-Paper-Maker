/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef EVENTCOMMANDKIND_H
#define EVENTCOMMANDKIND_H

// -------------------------------------------------------
//
//  ENUM EventCommandKind
//
//  All the types of possible commands. The same order should
//  be respected in the interpreter.
//
// -------------------------------------------------------

enum class EventCommandKind {
    None,
    ShowText,
    ChangeVariables,
    EndGame,
    While,
    EndWhile,
    WhileBreak,
    InputNumber,
    If,
    Else,
    EndIf,
    OpenMainMenu,
    OpenSavesMenu,
    ModifyInventory,
    ModifyTeam,
    StartBattle,
    IfWin,
    IfLose,
    ChangeState,
    SendEvent,
    TeleportObject,
    MoveObject,
    Wait,
    MoveCamera,
    PlayMusic,
    StopMusic,
    PlayBackgroundSound,
    StopBackgroundSound,
    PlayASound,
    PlayMusicEffect,
    Last
};

#endif // EVENTCOMMANDKIND_H
