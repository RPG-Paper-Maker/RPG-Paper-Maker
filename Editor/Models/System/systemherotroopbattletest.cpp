/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemherotroopbattletest.h"
#include "systemherotroopbattletestequipment.h"
#include "rpm.h"

const QString SystemHeroTroopBattleTest::JSON_HERO_ID = "heroID";
const QString SystemHeroTroopBattleTest::JSON_LEVEL = "level";
const QString SystemHeroTroopBattleTest::JSON_EQUIPMENTS = "equipments";
const int SystemHeroTroopBattleTest::DEFAULT_HERO_ID = 1;
const int SystemHeroTroopBattleTest::DEFAULT_LEVEL = 1;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemHeroTroopBattleTest::SystemHeroTroopBattleTest() :
    SuperListItem(),
    m_heroID(DEFAULT_HERO_ID),
    m_level(DEFAULT_LEVEL),
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
            m_modelEquipments->appendRow((new SystemHeroTroopBattleTestEquipment(
                equipment->id(), equipment->name()))->getModelRow());
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

// -------------------------------------------------------

SuperListItem * SystemHeroTroopBattleTest::createCopy() const
{
    SystemHeroTroopBattleTest *super = new SystemHeroTroopBattleTest;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemHeroTroopBattleTest::setCopy(const SuperListItem &super)
{
    const SystemHeroTroopBattleTest *hero;
    SuperListItem::setCopy(super);
    hero = reinterpret_cast<const SystemHeroTroopBattleTest *>(&super);
    m_heroID = hero->m_heroID;
    m_level = hero->m_level;
    SuperListItem::deleteModel(m_modelEquipments, false);
    SuperListItem::copyModel(m_modelEquipments, hero->m_modelEquipments);
}

// -------------------------------------------------------

void SystemHeroTroopBattleTest::read(const QJsonObject &json)
{
    SuperListItem::read(json);
    SuperListItem::deleteModel(m_modelEquipments, false);
    if (json.contains(JSON_HERO_ID))
    {
        m_heroID = json[JSON_HERO_ID].toInt();
    }
    if (json.contains(JSON_LEVEL))
    {
        m_level = json[JSON_LEVEL].toInt();
    }
    SuperListItem::readList(m_modelEquipments, new SystemHeroTroopBattleTestEquipment,
        json, JSON_EQUIPMENTS);
}

// -------------------------------------------------------

void SystemHeroTroopBattleTest::write(QJsonObject &json) const
{
    SuperListItem::write(json);
    if (m_heroID != DEFAULT_HERO_ID)
    {
        json[JSON_HERO_ID] = m_heroID;
    }
    if (m_level != DEFAULT_LEVEL)
    {
        json[JSON_LEVEL] = m_level;
    }
    SuperListItem::writeList(m_modelEquipments, json, JSON_EQUIPMENTS);
}
