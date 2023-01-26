/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemitem.h"

const QString SystemItem::DEFAULT_BATTLE_MESSAGE = "[item]";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemItem::SystemItem() :
    SystemCommonSkillItem()
{
    m_battleMessage->setAllNames(DEFAULT_BATTLE_MESSAGE);
}

SystemItem::SystemItem(int i, QString name, int pictureID, int pictureIndexX, int
    pictureIndexY, int type, bool consumable, SystemTranslatable *description,
    TargetKind targetKind, PrimitiveValue *targetConditionFormula, AvailableKind
    availableKind, SystemPlaySong *sound, PrimitiveValue *animationUserID,
    PrimitiveValue *animationTargetID, PrimitiveValue *canBeSold, SystemTranslatable
    *battleMessage, QStandardItemModel *price, QStandardItemModel *modelEffects) :
    SystemCommonSkillItem(i, name, pictureID, pictureIndexX, pictureIndexY, type,
        consumable, SystemCommonSkillItem::DEFAULT_ONE_HAND, description, targetKind,
        targetConditionFormula, new PrimitiveValue(PrimitiveValueKind::None),
        availableKind, sound, animationUserID, animationTargetID, canBeSold,
        battleMessage, price, new QStandardItemModel, modelEffects, new
        QStandardItemModel)
{

}

SystemItem::~SystemItem()
{

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemItem::read(const QJsonObject &json)
{
    SystemCommonSkillItem::read(json);
}

// -------------------------------------------------------

void SystemItem::write(QJsonObject &json) const
{
    SystemCommonSkillItem::write(json);
}
