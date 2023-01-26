/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef VARIABLEMAPOBJECTCHARACTERISTICKIND_H
#define VARIABLEMAPOBJECTCHARACTERISTICKIND_H

// -------------------------------------------------------
//
//  ENUM VariableMapObjectCharacteristicKind
//
//  All the possible variable change in command for map objecr characteristic.
//
// -------------------------------------------------------

enum class VariableMapObjectCharacteristicKind {
    XSquarePosition,
    YSquarePosition,
    ZSquarePosition,
    XPixelPosition,
    YPixelPosition,
    ZPixelPosition,
    Orientation,
    Terrain
};

#endif // VARIABLEMAPOBJECTCHARACTERISTICKIND_H
