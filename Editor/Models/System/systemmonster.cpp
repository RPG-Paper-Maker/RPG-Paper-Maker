/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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

SystemMonster::SystemMonster() :
    SystemMonster(1, "", 1, 1, 1, 0, 0, new SystemClass, new SystemProgressionTable,
    new QStandardItemModel, new QStandardItemModel)
{

}

SystemMonster::SystemMonster(int i, QString name, int idClass, int idBattler,
    int idFaceset, int indexXFaceset, int indexYFaceset, SystemClass *classInherit,
    SystemProgressionTable *exp, QStandardItemModel *loots, QStandardItemModel
    *actions) :
    SystemHero(i, name, idClass, idBattler, idFaceset, indexXFaceset, indexYFaceset,
        classInherit),
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
    SuperListItem::deleteModel(m_modelActions);
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
    m_modelActions->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::ACTION), RPM::translate(Translations::CONDITIONS), RPM
        ::translate(Translations::PRIORITY), RPM::translate(Translations
        ::PROBABILITY)}));
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

void SystemMonster::updateProbabilities()
{
    QStandardItem *item;
    SystemMonsterAction *action;
    int i, l;

    for (i = 0, l = m_modelActions->invisibleRootItem()->rowCount(); i < l; i++)
    {
        item = m_modelActions->item(i);
        action = reinterpret_cast<SystemMonsterAction *>(item->data().value<
            quintptr>());
        if (action != nullptr) {
            item->setText(action->probabilityToString());
        }
    }
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
    QHash<int, SystemProgressionTable *>::const_iterator i;

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
    SuperListItem::copy(m_modelLoots, monster->m_modelLoots);

    // Loots
    SuperListItem::deleteModel(m_modelActions, false);
    SuperListItem::copy(m_modelActions, monster->m_modelActions);

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
    SystemProgressionTable *table;
    int i, l;

    SuperListItem::deleteModel(m_modelLoots, false);
    SuperListItem::deleteModel(m_modelActions, false);
    this->initializeHeaders();

    // Experience
    m_experience->read(json[JSON_EXPERIENCE].toObject());

    // Currencies
    tab = json[JSON_CURRENCIES].toArray();
    for (i = 0, l = tab.size(); i < l; i++)
    {
        objHash = tab.at(i).toObject();
        obj = objHash["v"].toObject();
        table = new SystemProgressionTable;
        table->read(obj);
        m_currencies[objHash["k"].toInt()] = table;
    }

    // Loots
    SuperListItem::readTree(m_modelLoots, new SystemLoot, json, JSON_LOOTS);

    // Actions
    RPM::get()->setSelectedMonster(this);
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
