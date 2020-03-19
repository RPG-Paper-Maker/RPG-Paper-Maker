/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemmonster.h"
#include "rpm.h"
#include "systemcurrency.h"
#include "systemloot.h"
#include "systemmonsteraction.h"

const QString SystemMonster::JSON_EXPERIENCE = "xp";
const QString SystemMonster::JSON_CURRENCIES = "cur";
const QString SystemMonster::JSON_LOOTS = "loots";
const QString SystemMonster::JSON_ACTIONS = "a";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemMonster::SystemMonster() : SystemMonster(1, new LangsTranslation, 1, 1,
    1, new SystemClass, new SystemProgressionTable, new QStandardItemModel, new
    QStandardItemModel)
{

}

SystemMonster::SystemMonster(int i, LangsTranslation *names, int idClass, int
    idBattler, int idFaceset, SystemClass *classInherit, SystemProgressionTable
    *exp, QStandardItemModel *loots, QStandardItemModel *actions) :
    SystemHero(i, names, idClass, idBattler, idFaceset, classInherit),
    m_experience(exp),
    m_modelLoots(loots),
    m_modelActions(actions)
{
    this->initializeHeaders();
}

SystemMonster::~SystemMonster() {
    delete m_experience;
    this->deleteCurrencies();
    SuperListItem::deleteModel(m_modelLoots);
    delete m_modelActions;
}

SystemProgressionTable * SystemMonster::experience() const {
    return m_experience;
}

QHash<int, SystemProgressionTable *> * SystemMonster::currencies() {
    return &m_currencies;
}

QStandardItemModel* SystemMonster::modelLoots() const {
    return m_modelLoots;
}

QStandardItemModel* SystemMonster::modelActions() const {
    return m_modelActions;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemMonster::initializeHeaders() {
    m_modelLoots->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::NAME), RPM::translate(Translations::NUMBER_SHORT), RPM
        ::translate(Translations::PROBABILITY_SHORT), RPM::translate(
        Translations::INITIAL_SHORT), RPM::translate(Translations::FINAL_SHORT)}));
}

// -------------------------------------------------------

void SystemMonster::deleteCurrencies() {
    QHash<int, SystemProgressionTable *>::iterator i;
    for (i = m_currencies.begin(); i != m_currencies.end(); i++) {
        delete i.value();
    }
    m_currencies.clear();
}

// -------------------------------------------------------

void SystemMonster::insertCurrency(int id, SystemProgressionTable *table) {
    if (!m_currencies.contains(id)) {
        m_currencies.insert(id, table);
    }
}

// -------------------------------------------------------

void SystemMonster::insertDefaultCurrency(int id) {
    insertCurrency(id, new SystemProgressionTable);
}

// -------------------------------------------------------

void SystemMonster::removeCurrency(int id) {
    SystemProgressionTable *table = m_currencies.value(id);
    if (table != nullptr) {
        delete table;
        m_currencies.remove(id);
    }
}

// -------------------------------------------------------

SystemProgressionTable * SystemMonster::currencyProgressionAt(int id) {
    return m_currencies.value(id);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemMonster::createCopy() const {
    SystemMonster* super = new SystemMonster;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemMonster::setCopy(const SuperListItem &super) {
    const SystemMonster *monster;
    QStandardItem *item;
    QList<QStandardItem *> row;
    QHash<int, SystemProgressionTable *>::const_iterator i;
    int j, l;

    SystemHero::setCopy(super);
    monster = reinterpret_cast<const SystemMonster *>(&super);

    // Experience
    m_experience->setCopy(*monster->m_experience);

    // Currencies
    this->deleteCurrencies();
    for (i = monster->m_currencies.begin(); i != monster->m_currencies.end();
         i++)
    {
        m_currencies.insert(i.key(), reinterpret_cast<SystemProgressionTable *>(
            i.value()->createCopy()));
    }

    // Loots
    SuperListItem::deleteModel(m_modelLoots, false);
    for (j = 0, l = monster->modelLoots()->invisibleRootItem()->rowCount(); j <
         l - 1; j++)
    {
        m_modelLoots->appendRow(reinterpret_cast<SystemLoot *>(monster
            ->modelLoots()->item(j)->data().value<qintptr>())->createCopy()
            ->getModelRow());
    }
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_modelLoots->appendRow(item);
    this->initializeHeaders();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemMonster::read(const QJsonObject &json){
    SystemHero::read(json);
    QJsonArray tab;
    QJsonObject obj, objHash;
    QJsonArray jsonRow;
    QList<QStandardItem *> row;
    SystemProgressionTable *table;
    int i, l;

    // Experience
    m_experience->read(json[JSON_EXPERIENCE].toObject());

    // Currencies
    tab = json[JSON_CURRENCIES].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        objHash = tab.at(i).toObject();
        obj = objHash["v"].toObject();
        table = new SystemProgressionTable;
        table->read(obj);
        m_currencies[objHash["k"].toInt()] = table;
    }

    // Loots
    SuperListItem::readTree(m_modelLoots, new SystemLoot, json, JSON_LOOTS);

    // Actions
    SuperListItem::readTree(m_modelActions, new SystemMonsterAction, json,
        JSON_ACTIONS);
}

// -------------------------------------------------------

void SystemMonster::write(QJsonObject &json) const{
    SystemHero::write(json);
    QJsonArray tab, tabRow;
    QJsonObject obj, objHash;
    SystemProgressionTable *table;

    // Experience
    m_experience->write(obj);
    json[JSON_EXPERIENCE] = obj;

    // Currencies
    QHash<int, SystemProgressionTable *>::const_iterator i;
    for (i = m_currencies.begin(); i != m_currencies.end(); i++) {
        table = i.value();
        if (!table->isDefault()) {
            objHash = QJsonObject();
            obj = QJsonObject();
            table->write(obj);
            objHash["k"] = i.key();
            objHash["v"] = obj;
            tab.append(objHash);
        }
    }
    json[JSON_CURRENCIES] = tab;

    // Loots
    SuperListItem::writeTree(m_modelLoots, json, JSON_LOOTS);

    // Actions
    SuperListItem::writeTree(m_modelActions, json, JSON_ACTIONS);
}
