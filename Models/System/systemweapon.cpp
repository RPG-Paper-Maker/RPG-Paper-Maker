/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#include "systemweapon.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemWeapon::SystemWeapon() :
    SystemCommonSkillItem()
{

}

SystemWeapon::SystemWeapon(int i, LangsTranslation* names, int pictureID, int
    type, bool oneHand, LangsTranslation *description, TargetKind targetKind,
    PrimitiveValue *targetConditionFormula, PrimitiveValue *conditionFormula,
    PrimitiveValue *animationUserID, PrimitiveValue *animationTargetID,
    PrimitiveValue *price, QStandardItemModel *modelCosts, QStandardItemModel
    *modelEffects, QStandardItemModel *modelCaracteristics) :
    SystemCommonSkillItem(i, names, pictureID, type, false, oneHand,
        description, targetKind, targetConditionFormula, conditionFormula,
        AvailableKind::Never, new SystemPlaySong(-1, SongKind::Sound),
        animationUserID, animationTargetID, price, modelCosts, modelEffects,
        modelCaracteristics)
{

}

SystemWeapon::~SystemWeapon() {

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemWeapon::read(const QJsonObject &json) {
    SystemCommonSkillItem::read(json);
}

// -------------------------------------------------------

void SystemWeapon::write(QJsonObject &json) const {
    SystemCommonSkillItem::write(json);
}
