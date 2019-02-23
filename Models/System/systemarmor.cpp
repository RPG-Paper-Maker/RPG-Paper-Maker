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

#include "systemarmor.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemArmor::SystemArmor() :
    SystemArmor(1, new LangsTranslation, -1, 1, new LangsTranslation, new
        PrimitiveValue(QString()), new PrimitiveValue(0), new
        QStandardItemModel)
{

}

SystemArmor::SystemArmor(int i, LangsTranslation *names, int pictureID, int
    type, LangsTranslation *description, PrimitiveValue *conditionFormula,
    PrimitiveValue *price, QStandardItemModel *modelCaracteristics) :
    SystemCommonSkillItem(i, names, pictureID, type, false, true, description,
        TargetKind::None, new PrimitiveValue(QString()), conditionFormula,
        AvailableKind::Never, new SystemPlaySong(-1, SongKind::Sound), new
        PrimitiveValue(PrimitiveValueKind::None), new PrimitiveValue(
        PrimitiveValueKind::None), price, new QStandardItemModel, new
        QStandardItemModel, modelCaracteristics)
{

}

SystemArmor::~SystemArmor() {

}

int SystemArmor::idKind() const {
    return m_idKind;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemArmor::read(const QJsonObject &json){
    SystemCommonSkillItem::read(json);
}

void SystemArmor::write(QJsonObject &json) const{
    SystemCommonSkillItem::write(json);
}
