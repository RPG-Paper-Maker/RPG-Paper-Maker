/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "variablesdatas.h"
#include "systemvariables.h"
#include "rpm.h"
#include "common.h"

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
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_VARIABLES), *this);
}

QStandardItemModel* VariablesDatas::model() const {
    return p_model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void VariablesDatas::setDefault() {
    for (int i = 1; i <= 5; i++){
        QStandardItem * item = new QStandardItem();
        SystemVariables* page = new SystemVariables(i, "");
        page->setDefaultVariables(i == 1);
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(page)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(page->toString());
        p_model->invisibleRootItem()->appendRow(item);
    }
}

// -------------------------------------------------------

SuperListItem* VariablesDatas::getVariableById(int id) const{
    return getById(p_model, id);
}

// -------------------------------------------------------

SuperListItem* VariablesDatas::getById(QStandardItemModel *l, int id) const{
    for (int i = 0; i < l->invisibleRootItem()->rowCount(); i++){
        SuperListItem* s = ((SystemVariables*)(l->invisibleRootItem()
                                                    ->child(i)->data()
                                                    .value<quintptr>()))
                ->getById(id);
        if (s != nullptr) return s;
    }
    return nullptr;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void VariablesDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(p_model, false);

    // Read
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

void VariablesDatas::write(QJsonObject &json) const{
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
