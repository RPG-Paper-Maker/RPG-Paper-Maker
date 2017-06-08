/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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
#include "wanok.h"
#include "systemcurrency.h"
#include "systemloot.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemMonster::SystemMonster() : SystemHero()
{
    m_modelCurrencies = new QStandardItemModel;
    m_modelLoots = new QStandardItemModel;
    m_modelActions = new QStandardItemModel;
}

SystemMonster::SystemMonster(int i, LangsTranslation* names, int idClass,
                             int exp, QStandardItemModel* currencies,
                             QStandardItemModel* loots,
                             QStandardItemModel* actions) :
    SystemHero(i, names, idClass),
    m_exp(exp),
    m_modelCurrencies(currencies),
    m_modelLoots(loots),
    m_modelActions(actions)
{

}

SystemMonster::~SystemMonster(){
    SuperListItem::deleteModel(m_modelLoots);
    delete m_modelCurrencies;
    delete m_modelActions;
}

int SystemMonster::exp() const { return m_exp; }

void SystemMonster::setExp(int i) { m_exp = i; }

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
    m_exp = monster.exp();

    // Currencies
    m_modelCurrencies->setHorizontalHeaderLabels(QStringList({"Currencies",
                                                              "Nb"}));
    l = monster.modelCurrencies()->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        itemSys = new QStandardItem;
        itemNb = new QStandardItem;
        row = QList<QStandardItem*>();
        sys = (SuperListItem*) monster.modelCurrencies()->item(i)->data()
                .value<quintptr>();
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
    m_exp = json["xp"].toInt();

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
                    Wanok::get()->project()->gameDatas()->systemDatas()
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
    json["xp"] = m_exp;

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
