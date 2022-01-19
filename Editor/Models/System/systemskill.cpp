/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemskill.h"

const QString SystemSkill::DEFAULT_BATTLE_MESSAGE = "[skill]";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemSkill::SystemSkill() :
    SystemCommonSkillItem()
{
    m_battleMessage->setAllNames(DEFAULT_BATTLE_MESSAGE);
}

SystemSkill::SystemSkill(int i, QString name, int pictureID, int pictureIndexX,
    int pictureIndexY, SystemTranslatable *description, TargetKind targetKind,
    PrimitiveValue *targetConditionFormula, PrimitiveValue *conditionFormula,
    AvailableKind availableKind, SystemPlaySong *sound, PrimitiveValue
    *animationUserID, PrimitiveValue *animationTargetID, SystemTranslatable
    *battleMessage, QStandardItemModel *modelCosts, QStandardItemModel *modelEffects) :
    SystemCommonSkillItem(i, name, pictureID, pictureIndexX, pictureIndexY,
        SystemCommonSkillItem::DEFAULT_TYPE, SystemCommonSkillItem::DEFAULT_CONSUMABLE,
        SystemCommonSkillItem::DEFAULT_ONE_HAND, description, targetKind,
        targetConditionFormula, conditionFormula, availableKind, sound, animationUserID,
        animationTargetID, new PrimitiveValue(true), battleMessage, new
        QStandardItemModel, modelCosts, modelEffects, new QStandardItemModel)
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

void SystemSkill::read(const QJsonObject &json)
{
    SystemCommonSkillItem::read(json);
}

// -------------------------------------------------------

void SystemSkill::write(QJsonObject &json) const
{
    SystemCommonSkillItem::write(json);
}
