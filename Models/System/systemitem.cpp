/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
