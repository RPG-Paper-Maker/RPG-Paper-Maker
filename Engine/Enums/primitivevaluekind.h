/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef PRIMITIVEVALUEKIND_H
#define PRIMITIVEVALUEKIND_H

// -------------------------------------------------------
//
//  ENUM PrimitiveValueKind
//
//  All the possible types of primitives values.
//
// -------------------------------------------------------

enum class PrimitiveValueKind {
    None,
    Anything,
    Default,
    Number,
    Variable,
    Parameter,
    Property,
    DataBase,
    Message,
    Script,
    Switch,
    KeyBoard,
    NumberDouble
};

#endif // PRIMITIVEVALUEKIND_H
