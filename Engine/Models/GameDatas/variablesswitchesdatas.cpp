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

#include "variablesswitchesdatas.h"
#include "systemvariableswitch.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

VariablesSwitchesDatas::VariablesSwitchesDatas()
{
    p_modelVariables = new QStandardItemModel;
    p_modelSwitches = new QStandardItemModel;
}

VariablesSwitchesDatas::~VariablesSwitchesDatas()
{
    deleteModel(p_modelVariables->invisibleRootItem());
    deleteModel(p_modelSwitches->invisibleRootItem());
    delete p_modelVariables;
    p_modelVariables = nullptr;
    delete p_modelSwitches;
    p_modelSwitches = nullptr;
}

void VariablesSwitchesDatas::read(QString path){
    Wanok::readJSON(Wanok::pathCombine(path, Wanok::pathVariablesSwitches),
                    *this);
}

QStandardItemModel* VariablesSwitchesDatas::modelVariables() const {
    return p_modelVariables;
}
QStandardItemModel* VariablesSwitchesDatas::modelSwitches() const {
    return p_modelSwitches;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void VariablesSwitchesDatas::setDefault(){
    for (int i = 1; i <= 5; i++){
        p_modelVariables->invisibleRootItem()->appendRow(getDefaultItem(i));
        p_modelSwitches->invisibleRootItem()->appendRow(getDefaultItem(i));
    }
}

// -------------------------------------------------------

QStandardItem* VariablesSwitchesDatas::getDefaultItem(int i){
    QStandardItem * item = new QStandardItem();
    QStandardItemModel* list = new QStandardItemModel();
    for (int j = 1; j <= SystemVariableSwitch::variablesPerPage; j++){
        QStandardItem* varItem = new QStandardItem();
        SuperListItem* var =
                new SuperListItem(
                    j + ((i-1) * SystemVariableSwitch::variablesPerPage),"");
        varItem->setData(QVariant::fromValue(reinterpret_cast<quintptr>(var)));
        varItem->setFlags(varItem->flags() ^ (Qt::ItemIsDropEnabled));
        varItem->setText(var->toString());
        list->invisibleRootItem()->appendRow(varItem);
    }
    SystemVariableSwitch* page = new SystemVariableSwitch(i, QString("Page ")
                                                          + QString::number(i),
                                                          list);
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(page)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(page->toString());

    return item;
}

// -------------------------------------------------------

SuperListItem* VariablesSwitchesDatas::getVariableById(int id) const{
    return getById(p_modelVariables, id);
}

// -------------------------------------------------------

SuperListItem* VariablesSwitchesDatas::getSwitchById(int id) const{
    return getById(p_modelSwitches, id);
}

// -------------------------------------------------------

SuperListItem* VariablesSwitchesDatas::getById(QStandardItemModel *l,
                                               int id) const
{
    for (int i = 0; i < l->invisibleRootItem()->rowCount(); i++){
        SuperListItem* s = ((SystemVariableSwitch*)(l->invisibleRootItem()
                                                    ->child(i)->data()
                                                    .value<quintptr>()))
                ->getById(id);
        if (s != nullptr) return s;
    }
    return nullptr;
}

// -------------------------------------------------------
// Recursively delete the pointers inside the data nodes (not deleted
// automatically by Qt)

void VariablesSwitchesDatas::deleteModel(QStandardItem* item){
    for (int i = 0; i < item->rowCount(); i++){
        deleteModel(item->child(i));
        delete (SystemVariableSwitch*) item->child(i)->data().value<quintptr>();
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void VariablesSwitchesDatas::read(const QJsonObject &json)
{
    readCommand(json["Variables"].toArray(), p_modelVariables);
    readCommand(json["Switches"].toArray(), p_modelSwitches);
}

// -------------------------------------------------------

void VariablesSwitchesDatas::readCommand(const QJsonArray &json,
                                         QStandardItemModel *l)
{
    for (int i = 0; i < json.size(); i++){
        QStandardItem * item = new QStandardItem();
        SystemVariableSwitch* page = new SystemVariableSwitch();
        page->read(json[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(page)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(page->toString());
        l->invisibleRootItem()->appendRow(item);
    }
}

// -------------------------------------------------------

void VariablesSwitchesDatas::write(QJsonObject &json) const
{
    json["Variables"] = getArrayJSON(p_modelVariables);
    json["Switches"] = getArrayJSON(p_modelSwitches);
}

// -------------------------------------------------------

QJsonArray VariablesSwitchesDatas::getArrayJSON(QStandardItemModel* l) const{
    QJsonArray tab;
    for (int i = 0; i < l->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonObj;
        ((SystemVariableSwitch*)(l->invisibleRootItem()->child(i)->data()
                                 .value<quintptr>()))->write(jsonObj);
        tab.append(jsonObj);
    }

    return tab;
}
