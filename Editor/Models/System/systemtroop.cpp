/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemtroop.h"
#include "systemmonstertroop.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemTroop::SystemTroop() : SuperListItem()
{
    m_monstersList = new QStandardItemModel();
}

SystemTroop::SystemTroop(int i, QString n, QStandardItemModel* monstersList) :
    SuperListItem(i,n),
    m_monstersList(monstersList)
{
    this->initializeHeaders();
}

SystemTroop::~SystemTroop() {
    SuperListItem::deleteModel(m_monstersList);
}

QStandardItemModel * SystemTroop::monstersList() const {
    return m_monstersList;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemTroop::initializeHeaders() {
    m_monstersList->setHorizontalHeaderLabels(QStringList({"Monster","Level"}));
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem * SystemTroop::createCopy() const {
    SystemTroop* super = new SystemTroop;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemTroop::setCopy(const SuperListItem &super) {
    const SystemTroop *troop;
    QStandardItem *item;
    SystemMonsterTroop *sys;

    SuperListItem::setCopy(super);
    troop = reinterpret_cast<const SystemTroop *>(&super);

    // Currencies
    SuperListItem::deleteModel(m_monstersList, false);
    for (int i = 0, l = troop->m_monstersList->invisibleRootItem()->rowCount();
         i < l; i++)
    {
        sys = reinterpret_cast<SystemMonsterTroop *>(troop->m_monstersList->item
            (i)->data().value<quintptr>());
        if (sys != nullptr) {
            m_monstersList->appendRow(sys->createCopy()->getModelRow());
        }
    }
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_monstersList->appendRow(item);
    this->initializeHeaders();
}

// -------------------------------------------------------

void SystemTroop::read(const QJsonObject &json) {
    SuperListItem::read(json);

    this->initializeHeaders();

    // Monsters list
    SuperListItem::readTree(m_monstersList, new SystemMonsterTroop, json, "l");
}

// -------------------------------------------------------

void SystemTroop::write(QJsonObject &json) const{
    SuperListItem::write(json);

    // Monsters list
    SuperListItem::writeTree(m_monstersList, json, "l");
}
