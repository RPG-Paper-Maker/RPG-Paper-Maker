/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
    PlayMusicEffect
};

#endif // EVENTCOMMANDKIND_H
