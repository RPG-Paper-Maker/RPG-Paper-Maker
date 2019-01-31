/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#include "heroesdatas.h"
#include "systemhero.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

HeroesDatas::HeroesDatas()
{
    m_model = new QStandardItemModel;
}

HeroesDatas::~HeroesDatas()
{
    SuperListItem::deleteModel(m_model);
}

void HeroesDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::pathHeroes), *this);
}

QStandardItemModel* HeroesDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void HeroesDatas::setDefault() {
    SystemHero* heroes[] = {
        new SystemHero(1, new LangsTranslation("Lucas"), 1, 1, 1, SystemClass
            ::createInheritanceClass()),
        new SystemHero(2, new LangsTranslation("Kate"), 2, 2, 2, SystemClass
            ::createInheritanceClass()),
        new SystemHero(3, new LangsTranslation("Bibi"), 3, 3, 3, SystemClass
            ::createInheritanceClass()),
        new SystemHero(4, new LangsTranslation("Shana"), 4, 4, 4, SystemClass
            ::createInheritanceClass())
    };
    int length = (sizeof(heroes)/sizeof(*heroes));
    QStandardItem* item;

    for (int i = 0; i < length; i++){
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(heroes[i])));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(heroes[i]->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void HeroesDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json["heroes"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemHero* sysHero = new SystemHero;
        sysHero->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysHero)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysHero->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void HeroesDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonCommon;
        SystemHero* sysHero = reinterpret_cast<SystemHero*>(m_model->item(i)
            ->data().value<quintptr>());
        sysHero->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["heroes"] = jsonArray;
}
