/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemvariables.h"
#include "rpm.h"
#include "common.h"

int SystemVariables::variablesPerPage = 25;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemVariables::SystemVariables() :
    SystemVariables(1, "")
{

}

SystemVariables::SystemVariables(int i, QString n) :
    SystemVariables(i, n, new QStandardItemModel)
{

}

SystemVariables::SystemVariables(int i, QString n, QStandardItemModel *m) :
    SuperListItem(i, n),
    p_model(m)
{

}

SystemVariables::~SystemVariables()
{
    SuperListItem::deleteModel(p_model);
}

QStandardItemModel* SystemVariables::model() const { return p_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemVariables::idToString() const
{
    return QString("[") + Common::getFormatNumber((p_id-1)*25 + 1)
            + QString(",") + Common::getFormatNumber((p_id)*25)
            + QString("]");
}

// -------------------------------------------------------

SuperListItem* SystemVariables::getById(int id) const{
    for (int i = 0; i < variablesPerPage; i++){
        SuperListItem* s = (SuperListItem*)(p_model->invisibleRootItem()
                                            ->child(i)->data()
                                            .value<quintptr>());
        if (id == s->id()) return s;
    }

    return nullptr;
}

// -------------------------------------------------------

void SystemVariables::setDefault(){
    for (int j = 1; j <= SystemVariables::variablesPerPage; j++){
        QStandardItem* varItem = new QStandardItem();
        SuperListItem* var =
                new SuperListItem(
                    j + ((id()-1) * SystemVariables::variablesPerPage),"");
        varItem->setData(QVariant::fromValue(reinterpret_cast<quintptr>(var)));
        varItem->setFlags(varItem->flags() ^ (Qt::ItemIsDropEnabled));
        varItem->setText(var->toString());
        p_model->invisibleRootItem()->appendRow(varItem);
    }
    setName(QString("Page ") + QString::number(id()));
}

// -------------------------------------------------------

SuperListItem* SystemVariables::createCopy() const{
    SystemVariables* super = new SystemVariables;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemVariables::read(const QJsonObject &json)
{
    SuperListItem::read(json);
    readCommand(json["list"].toArray());
}

// -------------------------------------------------------

void SystemVariables::readCommand(const QJsonArray &json){
    for (int j = 0; j < SystemVariables::variablesPerPage; j++){
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

void SystemVariables::write(QJsonObject &json) const
{
    SuperListItem::write(json);
    json["list"] = getArrayJSON();
}

// -------------------------------------------------------

QJsonArray SystemVariables::getArrayJSON() const{
    QJsonArray tab;
    for (int i = 0; i < variablesPerPage; i++){
        QJsonObject jsonObj;
        ((SuperListItem*)(p_model->invisibleRootItem()->child(i)->data()
                          .value<quintptr>()))->write(jsonObj);
        tab.append(jsonObj);
    }

    return tab;
}
