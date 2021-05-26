/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemherotroopbattletest.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemHeroTroopBattleTest::SystemHeroTroopBattleTest() :
    m_heroID(1),
    m_level(1),
    m_modelEquipments(new QStandardItemModel)
{
    // By default, create equipment slots
    QStandardItemModel *model = RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonEquipment();
    SuperListItem *equipment;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        equipment = SuperListItem::getItemModelAt(model, i);
        if (equipment != nullptr)
        {
            m_modelEquipments->appendRow(new QStandardItem("<> " + equipment->name() + RPM::COLON + RPM::SPACE + RPM::translate(Translations::NONE)));
        }
    }
}

SystemHeroTroopBattleTest::~SystemHeroTroopBattleTest()
{
    SuperListItem::deleteModel(m_modelEquipments);
}

int SystemHeroTroopBattleTest::heroID() const
{
    return m_heroID;
}

void SystemHeroTroopBattleTest::setHeroID(int heroID)
{
    m_heroID = heroID;
}

int SystemHeroTroopBattleTest::level() const
{
    return m_level;
}

void SystemHeroTroopBattleTest::setLevel(int level)
{
    m_level = level;
}

QStandardItemModel * SystemHeroTroopBattleTest::modelEquipments() const
{
    return m_modelEquipments;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemHeroTroopBattleTest::name() const
{
    return SuperListItem::getById(RPM::get()->project()->gameDatas()->heroesDatas()
        ->model()->invisibleRootItem(), m_heroID)->name();
}
