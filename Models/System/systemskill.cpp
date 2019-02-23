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

#include "systemskill.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemSkill::SystemSkill() :
    SystemSkill(1, new LangsTranslation, -1, new LangsTranslation, TargetKind
    ::Enemy, new PrimitiveValue(QString("t.hp > 0")), new PrimitiveValue(
    PrimitiveValueKind::None), AvailableKind::Battle, new SystemPlaySong(-1,
    SongKind::Sound), new PrimitiveValue(PrimitiveValueKind::None), new
    PrimitiveValue(PrimitiveValueKind::None), new QStandardItemModel, new
    QStandardItemModel)
{

}

SystemSkill::SystemSkill(int i, LangsTranslation *names, int pictureID,
    LangsTranslation *description, TargetKind
    targetKind, PrimitiveValue *targetConditionFormula, PrimitiveValue
    *conditionFormula, AvailableKind availableKind, SystemPlaySong *sound,
    PrimitiveValue *animationUserID, PrimitiveValue *animationTargetID,
    QStandardItemModel *modelCosts, QStandardItemModel *modelEffects) :
    SystemCommonSkillItem(i, names, pictureID, 1, false, true, description,
        targetKind, targetConditionFormula, conditionFormula, availableKind,
        sound, animationUserID, animationTargetID, new PrimitiveValue(
        PrimitiveValueKind::Number, 0), modelCosts, modelEffects, new
        QStandardItemModel)
{

}

SystemSkill::~SystemSkill() {

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemSkill::read(const QJsonObject &json){
    SystemCommonSkillItem::read(json);
}

// -------------------------------------------------------

void SystemSkill::write(QJsonObject &json) const{
    SystemCommonSkillItem::write(json);
}
