/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemmonster.h"
#include "rpm.h"
#include "systemcurrency.h"
#include "systemloot.h"

const QString SystemMonster::JSON_EXPERIENCE = "xp";
const QString SystemMonster::JSON_CURRENCIES = "cur";
const QString SystemMonster::JSON_LOOTS = "loots";

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
    m_modelLoots->setHorizontalHeaderLabels(QStringList({"Name", "N", "P", "I",
        "F"}));
}

SystemMonster::~SystemMonster() {
    delete m_experience;
    deleteCurrencies();
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

void SystemMonster::setCopy(const SystemMonster& monster){
    SystemHero::setCopy(monster);
    QStandardItem* item;
    QList<QStandardItem*> row;
    int l;

    // Experience
    m_experience->setCopy(*monster.m_experience);

    // Currencies
    deleteCurrencies();
    QHash<int, SystemProgressionTable *>::const_iterator i;
    for (i = monster.m_currencies.begin(); i != monster.m_currencies.end(); i++)
    {
        m_currencies.insert(i.key(), reinterpret_cast<SystemProgressionTable *>(
            i.value()->createCopy()));
    }

    // Loots
    l = monster.modelLoots()->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        SystemLoot* loot = new SystemLoot;
        SystemLoot* lootCopy = (SystemLoot*) monster.modelLoots()->item(i)
                ->data().value<qintptr>();
        loot->setCopy(*lootCopy);
        row = loot->getModelRow();
        m_modelLoots->appendRow(row);
    }
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_modelLoots->appendRow(item);
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
    QStandardItem* item;
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
    tab = json[JSON_LOOTS].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        SystemLoot* loot = new SystemLoot;
        loot->read(tab[i].toObject());
        row = loot->getModelRow();
        m_modelLoots->appendRow(row);
    }
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_modelLoots->appendRow(item);
}

// -------------------------------------------------------

void SystemMonster::write(QJsonObject &json) const{
    SystemHero::write(json);
    QJsonArray tab, tabRow;
    QJsonObject obj, objHash;
    SystemProgressionTable *table;
    SystemLoot* loot;
    int j, l;

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
    tab = QJsonArray();
    l = m_modelLoots->invisibleRootItem()->rowCount();
    for (j = 0, l = m_modelLoots->invisibleRootItem()->rowCount(); j < l - 1;
         j++)
    {
        obj = QJsonObject();
        loot = reinterpret_cast<SystemLoot *>(m_modelLoots->item(j)->data()
            .value<quintptr>());
        loot->write(obj);
        tab.append(obj);
    }
    json[JSON_LOOTS] = tab;
}
