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

#include "variablesdatas.h"
#include "systemvariables.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

VariablesDatas::VariablesDatas()
{
    p_model = new QStandardItemModel;
}

VariablesDatas::~VariablesDatas()
{
    SuperListItem::deleteModel(p_model);
}

void VariablesDatas::read(QString path){
    Wanok::readJSON(Wanok::pathCombine(path, Wanok::pathVariables), *this);
}

QStandardItemModel* VariablesDatas::model() const {
    return p_model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void VariablesDatas::setDefault(){
    for (int i = 1; i <= 5; i++)
        p_model->invisibleRootItem()->appendRow(getDefaultItem(i));
}

// -------------------------------------------------------

QStandardItem* VariablesDatas::getDefaultItem(int i){
    QStandardItem * item = new QStandardItem();
    QStandardItemModel* list = new QStandardItemModel();
    for (int j = 1; j <= SystemVariables::variablesPerPage; j++){
        QStandardItem* varItem = new QStandardItem();
        SuperListItem* var =
                new SuperListItem(
                    j + ((i-1) * SystemVariables::variablesPerPage),"");
        varItem->setData(QVariant::fromValue(reinterpret_cast<quintptr>(var)));
        varItem->setFlags(varItem->flags() ^ (Qt::ItemIsDropEnabled));
        varItem->setText(var->toString());
        list->invisibleRootItem()->appendRow(varItem);
    }
    SystemVariables* page = new SystemVariables(i, QString("Page ")
                                                          + QString::number(i),
                                                          list);
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(page)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(page->toString());

    return item;
}

// -------------------------------------------------------

SuperListItem* VariablesDatas::getVariableById(int id) const{
    return SuperListItem::getById(p_model->invisibleRootItem(), id);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void VariablesDatas::read(const QJsonObject &json)
{
    readCommand(json["variables"].toArray(), p_model);
}

// -------------------------------------------------------

void VariablesDatas::readCommand(const QJsonArray &json,
                                         QStandardItemModel *l)
{
    for (int i = 0; i < json.size(); i++){
        QStandardItem * item = new QStandardItem();
        SystemVariables* page = new SystemVariables();
        page->read(json[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(page)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(page->toString());
        l->invisibleRootItem()->appendRow(item);
    }
}

// -------------------------------------------------------

void VariablesDatas::write(QJsonObject &json) const
{
    json["variables"] = getArrayJSON(p_model);
}

// -------------------------------------------------------

QJsonArray VariablesDatas::getArrayJSON(QStandardItemModel* l) const{
    QJsonArray tab;
    for (int i = 0; i < l->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonObj;
        ((SystemVariables*)(l->invisibleRootItem()->child(i)->data()
                                 .value<quintptr>()))->write(jsonObj);
        tab.append(jsonObj);
    }

    return tab;
}
