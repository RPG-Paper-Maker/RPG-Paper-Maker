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

#include "monstersdatas.h"
#include "rpm.h"
#include "common.h"
#include "systemmonster.h"
#include "lootkind.h"
#include "systemloot.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MonstersDatas::MonstersDatas()
{
    m_model = new QStandardItemModel;
}

MonstersDatas::~MonstersDatas()
{
    SuperListItem::deleteModel(m_model);
}

void MonstersDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::pathMonsters), *this);
}

QStandardItemModel* MonstersDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void MonstersDatas::setDefault(QStandardItem* modelCurrencies,
                               QStandardItem* modelItems,
                               QStandardItem* modelWeapons,
                               QStandardItem* modelArmors)
{
    SystemMonster* monster;
    QStandardItem* item;
    QList<QStandardItem *> row;
    QStandardItemModel* loots;
    QStandardItemModel* actions;
    SuperListItem* sys = nullptr;
    SystemLoot* loot;
    LangsTranslation* names[] = {new LangsTranslation("Wooly")};
    int classesIds[] = {5};
    int battlersIds[] = {5};
    int facesetsIds[] = {5};
    int experiencesInitial[] = {5};
    int experiencesFinal[] = {5000};
    int experiencesEquation[] = {0};
    QVector<int> currenciesIds[] = {QVector<int>({1})};
    QVector<int> currenciesNb[] = {QVector<int>({1})};
    QVector<LootKind> lootsKind[] = {QVector<LootKind>({LootKind::Item})};
    QVector<int> lootsIds[] = {QVector<int>({1})};
    QVector<PrimitiveValue*> lootsNb[] =
        {QVector<PrimitiveValue*>({
             new PrimitiveValue(1)})
        };
    QVector<PrimitiveValue*> lootsProba[] =
        {QVector<PrimitiveValue*>({
             new PrimitiveValue(50)})
        };
    QVector<PrimitiveValue*> lootsInit[] =
        {QVector<PrimitiveValue*>({
             new PrimitiveValue(1)})
        };
    QVector<PrimitiveValue*> lootsFinal[] =
        {QVector<PrimitiveValue*>({
             new PrimitiveValue(100)})
        };
    SystemProgressionTable *currenciesProgression[] = {
        new SystemProgressionTable(new PrimitiveValue(5), new PrimitiveValue(
            1500), 0)
    };
    int length = (sizeof(names)/sizeof(*names));

    for (int i = 0; i < length; i++) {
        // Loots
        loots = new QStandardItemModel;
        for (int j = 0; j < lootsIds[i].size(); j++){
            switch (lootsKind[i][j]){
            case LootKind::Item:
                sys = SuperListItem::getById(modelItems, currenciesIds[i][j]);
                break;
            case LootKind::Weapon:
                sys = SuperListItem::getById(modelWeapons, currenciesIds[i][j]);
                break;
            case LootKind::Armor:
                sys = SuperListItem::getById(modelArmors, currenciesIds[i][j]);
                break;
            }
            loot = new SystemLoot(sys->id(), sys->name(), lootsKind[i][j],
                lootsNb[i][j], lootsProba[i][j], lootsInit[i][j], lootsFinal[i]
                [j]);
            row = loot->getModelRow();
            loots->appendRow(row);
        }
        item = new QStandardItem();
        item->setText(SuperListItem::beginningText);
        loots->appendRow(item);

        // Actions
        actions = new QStandardItemModel;
        // TODO

        monster = new SystemMonster(i+1, names[i], classesIds[i], battlersIds[i],
            facesetsIds[i], SystemClass::createInheritanceClass(),
            new SystemProgressionTable(new PrimitiveValue(experiencesInitial[i])
            , new PrimitiveValue(experiencesFinal[i]), experiencesEquation[i]),
            loots, actions);
        monster->insertCurrency(i + 1, currenciesProgression[i]);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(monster)));
        item->setText(monster->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void MonstersDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json["monsters"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemMonster* sysMonster = new SystemMonster;
        sysMonster->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysMonster)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysMonster->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void MonstersDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonCommon;
        SystemMonster* sysMonster = ((SystemMonster*)m_model->item(i)->data()
                                     .value<quintptr>());
        sysMonster->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["monsters"] = jsonArray;
}
