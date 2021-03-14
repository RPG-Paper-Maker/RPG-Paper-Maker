/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

SystemSkill::SystemSkill(int i, QString name, int pictureID,
    SystemLang *description, TargetKind
    targetKind, PrimitiveValue *targetConditionFormula, PrimitiveValue
    *conditionFormula, AvailableKind availableKind, SystemPlaySong *sound,
    PrimitiveValue *animationUserID, PrimitiveValue *animationTargetID,
    QStandardItemModel *modelCosts, QStandardItemModel *modelEffects) :
    SystemCommonSkillItem(i, name, pictureID, 1, false, true, description,
        targetKind, targetConditionFormula, conditionFormula, availableKind,
        sound, animationUserID, animationTargetID, new QStandardItemModel,
        modelCosts, modelEffects, new QStandardItemModel)
{

}

SystemSkill::~SystemSkill()
{

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
