/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    ChangeProperty,
    DisplayChoice,
    Choice,
    EndChoice,
    Script,
    DisplayAPicture,
    SetMoveTurnAPicture,
    RemoveAPicture,
    SetDialogBoxOptions,
    TitleScreen,
    ChangeScreenTone,
    RemoveObjectFromMap,
    StopReaction,
    AllowForbidSaves,
    AllowForbidMainMenu,
    CallACommonReaction,
    Label,
    JumpLabel,
    Comment,
    ChangeAStatistic,
    ChangeASkill,
    ChangeName,
    ChangeEquipment,
    ModifyCurrency,
    DisplayAnAnimation,
    ShakeScreen,
    FlashScreen,
    Plugin,
    StartShopMenu,
    RestockShop,
    EnterANameMenu,
    CreateObjectInMap,
    ChangeStatus,
    ResetCamera,
    ChangeBattleMusic,
    ChangeVictoryMusic,
    EndBattle,
    ForceAnAction,
    ChangeMapProperties,
    Last
};

#endif // EVENTCOMMANDKIND_H
