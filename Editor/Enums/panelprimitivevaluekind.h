/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    Message
};

#endif // PANELPRIMITIVEVALUEKIND_H
