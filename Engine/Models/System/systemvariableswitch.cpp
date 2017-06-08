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

#include "systemvariableswitch.h"
#include "wanok.h"

int SystemVariableSwitch::variablesPerPage = 25;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemVariableSwitch::SystemVariableSwitch() : SuperListItem()
{
    p_model = new QStandardItemModel();
}

SystemVariableSwitch::SystemVariableSwitch(int i, QString n,
                                           QStandardItemModel *m) :
    SuperListItem(i,n), p_model(m) {}

SystemVariableSwitch::~SystemVariableSwitch()
{
    deleteModel(p_model->invisibleRootItem());
    delete p_model;
    p_model = nullptr;
}

QStandardItemModel* SystemVariableSwitch::model() const { return p_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemVariableSwitch::idToString() const
{
    return QString("[") + Wanok::getFormatNumber((p_id-1)*25 + 1)
            + QString(",") + Wanok::getFormatNumber((p_id)*25)
            + QString("]");
}

// -------------------------------------------------------

SuperListItem* SystemVariableSwitch::getById(int id) const{
    for (int i = 0; i < variablesPerPage; i++){
        SuperListItem* s = (SuperListItem*)(p_model->invisibleRootItem()
                                            ->child(i)->data()
                                            .value<quintptr>());
        if (id == s->id()) return s;
    }

    return nullptr;
}

// -------------------------------------------------------

void SystemVariableSwitch::deleteModel(QStandardItem* item){
    for (int i = 0; i < item->rowCount(); i++){
        deleteModel(item->child(i));
        delete (SuperListItem*) item->child(i)->data().value<quintptr>();
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemVariableSwitch::read(const QJsonObject &json)
{
    SuperListItem::read(json);
    readCommand(json["list"].toArray());
}

// -------------------------------------------------------

void SystemVariableSwitch::readCommand(const QJsonArray &json){
    for (int j = 0; j < SystemVariableSwitch::variablesPerPage; j++){
        QStandardItem* varItem = new QStandardItem();
        SuperListItem* var = new SuperListItem();
        var->read(json[j].toObject());
        varItem->setData(QVariant::fromValue(reinterpret_cast<quintptr>(var)));
        varItem->setFlags(varItem->flags() ^ (Qt::ItemIsDropEnabled));
        varItem->setText(var->toString());
        p_model->invisibleRootItem()->appendRow(varItem);
    }
}

// -------------------------------------------------------

void SystemVariableSwitch::write(QJsonObject &json) const
{
    SuperListItem::write(json);
    json["list"] = getArrayJSON();
}

// -------------------------------------------------------

QJsonArray SystemVariableSwitch::getArrayJSON() const{
    QJsonArray tab;
    for (int i = 0; i < variablesPerPage; i++){
        QJsonObject jsonObj;
        ((SuperListItem*)(p_model->invisibleRootItem()->child(i)->data()
                          .value<quintptr>()))->write(jsonObj);
        tab.append(jsonObj);
    }

    return tab;
}
