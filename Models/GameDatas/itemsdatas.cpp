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

#include "itemsdatas.h"
#include "systemitem.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ItemsDatas::ItemsDatas()
{
    m_model = new QStandardItemModel;
}

ItemsDatas::~ItemsDatas()
{
    SuperListItem::deleteModel(m_model);
}

void ItemsDatas::read(QString path){
    Wanok::readJSON(Wanok::pathCombine(path, Wanok::pathItems), *this);
}

QStandardItemModel* ItemsDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ItemsDatas::setDefault(){
    int i = 1;
    SystemItem* items[] = {new SystemItem(i++, "HP potion", 0, true),
                           new SystemItem(i++, "Super HP potion", 0, true),
                           new SystemItem(i++, "Mega HP potion", 0, true),
                           new SystemItem(i++, "MP potion", 0, true),
                           new SystemItem(i++, "Super MP potion", 0, true),
                           new SystemItem(i++, "Mega MP potion", 0, true),
                           new SystemItem(i++, "TP potion", 0, true),
                           new SystemItem(i++, "Super TP potion", 0, true),
                           new SystemItem(i++, "Mega TP potion", 0, true),
                           new SystemItem(i++, "key", 2, false),};

    int length = (sizeof(items)/sizeof(*items));
    QStandardItem* item;

    for (i = 0; i < length; i++){
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(items[i])));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(items[i]->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void ItemsDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json["items"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemItem* sysItem = new SystemItem;
        sysItem->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sysItem)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysItem->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void ItemsDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonCommon;
        SystemItem* sysItem = ((SystemItem*)m_model->item(i)->data()
                               .value<quintptr>());
        sysItem->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["items"] = jsonArray;
}
