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

#include "armorsdatas.h"
#include "systemarmor.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ArmorsDatas::ArmorsDatas()
{
    m_model = new QStandardItemModel;
}

ArmorsDatas::~ArmorsDatas()
{
    SuperListItem::deleteModel(m_model);
}

void ArmorsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::pathArmors), *this);
}

QStandardItemModel* ArmorsDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ArmorsDatas::setDefault(){
    int i = 1;
    SystemArmor* items[] = {new SystemArmor(i++, new LangsTranslation("Dress"),
                            4)};

    int length = (sizeof(items)/sizeof(*items));
    QStandardItem* item;

    for (i = 0; i < length; i++){
        item = new QStandardItem;
        item->setData(
                    QVariant::fromValue(reinterpret_cast<quintptr>(items[i])));
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

void ArmorsDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json["armors"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemArmor* sysArmor = new SystemArmor;
        sysArmor->read(jsonList[i].toObject());
        item->setData(
                    QVariant::fromValue(reinterpret_cast<quintptr>(sysArmor)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysArmor->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void ArmorsDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonCommon;
        SystemArmor* sysArmor =
                ((SystemArmor*)m_model->item(i)->data().value<quintptr>());
        sysArmor->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["armors"] = jsonArray;
}
