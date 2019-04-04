/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemskill.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemSkill::SystemSkill() :
    SystemCommonSkillItem()
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
