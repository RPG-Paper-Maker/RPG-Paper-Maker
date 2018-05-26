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

#include "langsdatas.h"
#include "wanok.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

LangsDatas::LangsDatas()
{
    m_model = new QStandardItemModel;
}

LangsDatas::~LangsDatas()
{
    SuperListItem::deleteModel(m_model);
}

void LangsDatas::read(QString path){
    Wanok::readJSON(Common::pathCombine(path, Wanok::pathLangs), *this);
}

QStandardItemModel* LangsDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void LangsDatas::setDefault(){
    QStandardItem* item;
    SuperListItem* super;

    item = new QStandardItem();
    super = new SuperListItem(1, "English");
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
    item->setText(super->toString());
    m_model->appendRow(item);
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_model->appendRow(item);
}

int LangsDatas::mainLang() const{
    return ((SuperListItem*) m_model->item(0)->data().value<quintptr>())->id();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void LangsDatas::read(const QJsonObject &json){
    QStandardItem* item;
    SuperListItem* super;
    QJsonArray tab = json["langs"].toArray();

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    for (int i = 0; i < tab.size(); i++){
        item = new QStandardItem;
        super = new SuperListItem;
        super->read(tab[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setText(super->toString());
        m_model->appendRow(item);
    }

    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_model->appendRow(item);
}

// -------------------------------------------------------

void LangsDatas::write(QJsonObject &json) const{
    QJsonArray tab;
    SuperListItem* super;

    for (int i = 0; i < m_model->invisibleRootItem()->rowCount()-1; i++){
        QJsonObject obj;
        super = (SuperListItem*) m_model->item(i)->data().value<quintptr>();
        super->write(obj);
        tab.append(obj);
    }

    json["langs"] = tab;
}
