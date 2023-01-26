/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef OPERATIONKIND_H
#define OPERATIONKIND_H

// -------------------------------------------------------
//
//  ENUM OperationKind
//
//  All the possible basic operations.
//
// -------------------------------------------------------

enum class OperationKind {
    EqualTo,
    NotEqualTo,
    GreaterThanOrEqualTo,
    LesserThanOrEqualTo,
    GreaterThan,
    LesserThan
};

#endif // OPERATIONKIND_H
