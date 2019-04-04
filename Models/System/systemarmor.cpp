/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemarmor.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemArmor::SystemArmor() :
    SystemCommonSkillItem()
{

}

SystemArmor::SystemArmor(int i, LangsTranslation *names, int pictureID, int
    type, LangsTranslation *description, PrimitiveValue *conditionFormula,
    PrimitiveValue *price, QStandardItemModel *modelCaracteristics) :
    SystemCommonSkillItem(i, names, pictureID, type, false, true, description,
        TargetKind::None, new PrimitiveValue(PrimitiveValueKind::None),
        conditionFormula, AvailableKind::Never, new SystemPlaySong(-1, SongKind
        ::Sound), new PrimitiveValue(PrimitiveValueKind::None), new
        PrimitiveValue(PrimitiveValueKind::None), price, new QStandardItemModel,
        new QStandardItemModel, modelCaracteristics)
{

}

SystemArmor::~SystemArmor() {

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemArmor::read(const QJsonObject &json){
    SystemCommonSkillItem::read(json);
}

// -------------------------------------------------------

void SystemArmor::write(QJsonObject &json) const{
    SystemCommonSkillItem::write(json);
}
