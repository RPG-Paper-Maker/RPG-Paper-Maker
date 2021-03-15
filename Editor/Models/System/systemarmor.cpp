/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

SystemArmor::SystemArmor(int i, QString name, int pictureID, int
    type, SystemTranslatable *description, PrimitiveValue *conditionFormula,
    QStandardItemModel *price, QStandardItemModel *modelCharacteristics) :
    SystemCommonSkillItem(i, name, pictureID, type, false, true, description,
    TargetKind::None, new PrimitiveValue(PrimitiveValueKind::None),
    conditionFormula, AvailableKind::Never, new SystemPlaySong(-1, SongKind
    ::Sound), new PrimitiveValue(PrimitiveValueKind::None), new
    PrimitiveValue(PrimitiveValueKind::None), price, new QStandardItemModel,
    new QStandardItemModel, modelCharacteristics)
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
