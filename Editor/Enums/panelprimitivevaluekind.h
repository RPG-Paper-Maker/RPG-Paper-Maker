/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELPRIMITIVEVALUEKIND_H
#define PANELPRIMITIVEVALUEKIND_H

// -------------------------------------------------------
//
//  ENUM PanelPrimitiveValueKind
//
//  All the possible types of primitives values panels.
//
// -------------------------------------------------------

enum class PanelPrimitiveValueKind {
    Primitives,
    ParameterEvent,
    ConstantVariable,
    DataBaseCommandId,
    Number,
    Message,
    Property,
    VariableParamProp,
    Font
};

#endif // PANELPRIMITIVEVALUEKIND_H
