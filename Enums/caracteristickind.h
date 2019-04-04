/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef CARACTERISTICKIND_H
#define CARACTERISTICKIND_H

// -------------------------------------------------------
//
//  ENUM CaracteristicKind
//
//  All the possible caracteristics kind.
//
// -------------------------------------------------------

enum class CaracteristicKind {
    IncreaseDecrease,
    Script,
    AllowForbidEquip,
    AllowForbidChange,
    BeginEquipment
};

#endif // CARACTERISTICKIND_H
