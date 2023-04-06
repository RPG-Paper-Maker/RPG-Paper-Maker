/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemtroop.h"
#include "systemmonstertroop.h"
#include "systemtroopreaction.h"
#include "rpm.h"

const QString SystemTroop::JSON_MONSTERS_LIST = "l";
const QString SystemTroop::JSON_REACTIONS = "reactions";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemTroop::SystemTroop() :
    SystemTroop(1, "")
{

}

SystemTroop::SystemTroop(int i, QString n, QStandardItemModel *monstersList,
    QStandardItemModel *reactions) :
    SuperListItem(i,n),
    m_monstersList(monstersList),
    m_reactions(reactions)
{
    this->initializeHeaders();
}

SystemTroop::~SystemTroop()
{
    SuperListItem::deleteModel(m_monstersList);
    SuperListItem::deleteModel(m_reactions);
}

QStandardItemModel * SystemTroop::monstersList() const
{
    return m_monstersList;
}

QStandardItemModel * SystemTroop::reactions() const
{
    return m_reactions;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemTroop::initializeHeaders()
{
    m_monstersList->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::MONSTER), RPM::translate(Translations::LEVEL)}));
}

// -------------------------------------------------------

QList<QStandardItem *> SystemTroop::getAllCommandsList() const {
    QList<QStandardItem *> list;
    SystemTroopReaction *reaction;
    for (int i = 0, l = m_reactions->invisibleRootItem()->rowCount(); i < l; i++)
    {
        reaction = reinterpret_cast<SystemTroopReaction *>(m_reactions->item(i)
            ->data().value<quintptr>());
        if (reaction != nullptr)
        {
            list << reaction->modelCommands()->invisibleRootItem();
        }
    }
    return list;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem * SystemTroop::createCopy() const
{
    SystemTroop *super = new SystemTroop;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemTroop::setCopy(const SuperListItem &super)
{
    const SystemTroop *troop;
    SuperListItem::setCopy(super);
    troop = reinterpret_cast<const SystemTroop *>(&super);
    SuperListItem::deleteModel(m_monstersList, false);
    SuperListItem::copy(m_monstersList, troop->m_monstersList);
    SuperListItem::deleteModel(m_reactions, false);
    SuperListItem::copy(m_reactions, troop->m_reactions);
    this->initializeHeaders();
}

// -------------------------------------------------------

void SystemTroop::read(const QJsonObject &json)
{
    SuperListItem::read(json);
    this->initializeHeaders();
    SuperListItem::readTree(m_monstersList, new SystemMonsterTroop, json,
        JSON_MONSTERS_LIST);
    SuperListItem::readTree(m_reactions, new SystemTroopReaction, json,
        JSON_REACTIONS);
}

// -------------------------------------------------------

void SystemTroop::write(QJsonObject &json) const
{
    SuperListItem::write(json);
    SuperListItem::writeTree(m_monstersList, json, JSON_MONSTERS_LIST);
    SuperListItem::writeTree(m_reactions, json, JSON_REACTIONS);
}
