/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "systemmonster.h"
#include "rpm.h"
#include "systemcurrency.h"
#include "systemloot.h"

const QString SystemMonster::JSON_EXPERIENCE = "xp";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemMonster::SystemMonster() : SystemMonster(1, new LangsTranslation, 1, 1,
    1, new SystemClass, new SystemRewardTable, new QStandardItemModel, new
    QStandardItemModel, new QStandardItemModel)
{

}

SystemMonster::SystemMonster(int i, LangsTranslation *names, int idClass, int
    idBattler, int idFaceset, SystemClass *classInherit, SystemRewardTable *exp,
    QStandardItemModel *currencies, QStandardItemModel *loots, QStandardItemModel
    *actions) :
    SystemHero(i, names, idClass, idBattler, idFaceset, classInherit),
    m_experience(exp),
    m_modelCurrencies(currencies),
    m_modelLoots(loots),
    m_modelActions(actions)
{

}

SystemMonster::~SystemMonster() {
    delete m_experience;
    SuperListItem::deleteModel(m_modelLoots);
    delete m_modelCurrencies;
    delete m_modelActions;
}

SystemRewardTable * SystemMonster::experience() const {
    return m_experience;
}

QStandardItemModel* SystemMonster::modelCurrencies() const {
    return m_modelCurrencies;
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

SuperListItem* SystemMonster::createCopy() const {
    SystemMonster* super = new SystemMonster;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemMonster::setCopy(const SystemMonster& monster){
    SystemHero::setCopy(monster);
    QStandardItem* item;
    QStandardItem* itemSys;
    QStandardItem* itemNb;
    QList<QStandardItem*> row;
    SuperListItem* sys;
    int nb;
    int l;

    // Experience
    m_experience->setCopy(*monster.m_experience);

    // Currencies
    m_modelCurrencies->setHorizontalHeaderLabels(QStringList({"Currencies",
                                                              "Nb"}));
    l = monster.modelCurrencies()->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        itemSys = new QStandardItem;
        itemNb = new QStandardItem;
        row = QList<QStandardItem*>();
        sys = reinterpret_cast<SuperListItem *>(monster.modelCurrencies()->item(
            i)->data().value<quintptr>());
        nb = monster.modelCurrencies()->item(i,1)->data().value<int>();
        itemSys->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        itemSys->setText(sys->toString());
        itemNb->setData(QVariant::fromValue(nb));
        itemNb->setText(QString::number(nb));

        row.append(itemSys);
        row.append(itemNb);
        m_modelCurrencies->appendRow(row);
    }
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_modelCurrencies->appendRow(item);

    // Loots
    m_modelLoots->setHorizontalHeaderLabels(QStringList({"Loots","Number",
                                                         "Probability(%)"}));
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
    QStandardItem* item;
    QStandardItem* itemSys;
    QStandardItem* itemNb;
    SuperListItem* sys;
    QJsonArray jsonRow;
    QList<QStandardItem *> row;
    int id;
    int nb;

    // Experience
    m_experience->read(json[JSON_EXPERIENCE].toObject());

    // Currencies
    m_modelCurrencies->setHorizontalHeaderLabels(QStringList({"Currencies",
                                                              "Nb"}));
    tab = json["currencies"].toArray();
    for (int j = 0; j < tab.size(); j++){
        row = QList<QStandardItem *>();
        jsonRow = tab[j].toArray();
        id = jsonRow[0].toInt();
        nb = jsonRow[1].toInt();
        sys = SuperListItem::getById(
                    RPM::get()->project()->gameDatas()->systemDatas()
                    ->modelCurrencies()->invisibleRootItem(),
                    id);
        itemSys = new QStandardItem;
        itemSys->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        itemSys->setText(sys->toString());
        itemNb = new QStandardItem;
        itemNb->setData(QVariant::fromValue(nb));
        itemNb->setText(QString::number(nb));

        row.append(itemSys);
        row.append(itemNb);
        m_modelCurrencies->appendRow(row);
    }
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_modelCurrencies->appendRow(item);

    // Loots
    m_modelLoots->setHorizontalHeaderLabels(QStringList({"Loots", "Number",
                                                         "Probability(%)"}));
    tab = json["loots"].toArray();
    for (int j = 0; j < tab.size(); j++){
        SystemLoot* loot = new SystemLoot;
        loot->read(tab[j].toObject());
        row = loot->getModelRow();
        m_modelLoots->appendRow(row);
    }
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_modelLoots->appendRow(item);
}

void SystemMonster::write(QJsonObject &json) const{
    SystemHero::write(json);
    QJsonArray tab;
    QJsonArray tabRow;
    QJsonObject obj;
    SystemLoot* loot;
    int l;

    // Experience
    m_experience->write(obj);
    json[JSON_EXPERIENCE] = obj;

    // Currencies
    tab = QJsonArray();
    l = m_modelCurrencies->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        tabRow = QJsonArray();
        tabRow.append(((SuperListItem*)(m_modelCurrencies->item(i)->data()
                                        .value<quintptr>()))->id());
        tabRow.append(m_modelCurrencies->item(i,1)->data().value<int>());
        tab.append(tabRow);
    }
    json["currencies"] = tab;

    // Loots
    tab = QJsonArray();
    l = m_modelLoots->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        obj = QJsonObject();
        loot = (SystemLoot*)(m_modelLoots->item(i)->data().value<quintptr>());
        loot->write(obj);
        tab.append(obj);
    }
    json["loots"] = tab;
}
