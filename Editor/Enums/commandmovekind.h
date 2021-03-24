/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef COMMANDMOVEKIND_H
#define COMMANDMOVEKIND_H

// -------------------------------------------------------
//
//  ENUM CommandMoveKind
//
//  All the possible moves for the command move object.
//
// -------------------------------------------------------

enum class CommandMoveKind {
    MoveNorth,
    MoveSouth,
    MoveWest,
    MoveEast,
    MoveNorthWest,
    MoveNorthEast,
    MoveSouthWest,
    MoveSouthEast,
    MoveRandom,
    MoveHero,
    MoveOppositeHero,
    MoveFront,
    MoveBack,
    ChangeGraphics,
    Jump,
    TurnNorth,
    TurnSouth,
    TurnWest,
    TurnEast,
    Turn90Right,
    Turn90Left,
    LookAtHero,
    LookAtHeroOpposite,
    ChangeSpeed,
    ChangeFrequency,
    MoveAnimation,
    StopAnimation,
    ClimbAnimation,
    FixDirection,
    Through,
    SetWithCamera,
    PixelOffset,
    KeepPosition,
    Wait,
    PlaySound,
    Script
};

#endif // COMMANDMOVEKIND_H
