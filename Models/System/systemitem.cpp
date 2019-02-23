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

#include "systemitem.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemItem::SystemItem() :
    SystemCommonSkillItem()
{

}

SystemItem::SystemItem(int i, LangsTranslation *names, int pictureID, int type,
    bool consumable, LangsTranslation *description, TargetKind targetKind,
    PrimitiveValue *targetConditionFormula, AvailableKind availableKind,
    SystemPlaySong *sound,  PrimitiveValue *animationUserID, PrimitiveValue
    *animationTargetID, PrimitiveValue *price, QStandardItemModel *modelEffects) :
    SystemCommonSkillItem (i, names, pictureID, type, consumable, true,
        description, targetKind, targetConditionFormula, new PrimitiveValue(
        PrimitiveValueKind::None), availableKind, sound, animationUserID,
        animationTargetID, price, new QStandardItemModel, modelEffects, new
        QStandardItemModel)
{

}

SystemItem::~SystemItem() {

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemItem::read(const QJsonObject &json){
    SystemCommonSkillItem::read(json);
}

// -------------------------------------------------------

void SystemItem::write(QJsonObject &json) const{
    SystemCommonSkillItem::write(json);
}
