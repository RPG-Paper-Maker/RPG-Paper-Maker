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

#include "systemevent.h"
#include "systemcreateparameter.h"
#include "widgetsupertree.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemEvent::SystemEvent() :
    SystemEvent(1, "", new QStandardItemModel)
{

}

SystemEvent::SystemEvent(int i, QString n, QStandardItemModel* parameters) :
    SuperListItem(i,n),
    m_modelParameters(parameters)
{
    m_modelParameters->setHorizontalHeaderLabels(QStringList({"Name",
                                                              "Default value"
                                                             }));
}

SystemEvent::~SystemEvent(){
    SuperListItem::deleteModel(m_modelParameters);
}

QStandardItemModel* SystemEvent::modelParameters() const {
    return m_modelParameters;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemEvent::createCopy() const{
    SystemEvent* super = new SystemEvent;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemEvent::setCopy(const SystemEvent& item){
    SuperListItem::setCopy(item);

    // parameters
    WidgetSuperTree::copy(m_modelParameters, item.m_modelParameters);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemEvent::read(const QJsonObject &json){
    SuperListItem::read(json);
    QList<QStandardItem *> row;
    SystemCreateParameter* param;
    QStandardItem* item;

    // Parameters
    QJsonArray jsonParameters = json["p"].toArray();
    for (int i = 0; i < jsonParameters.size(); i++){
        param = new SystemCreateParameter;
        param->read(jsonParameters.at(i).toObject());
        row = param->getModelRow();
        m_modelParameters->appendRow(row);
    }
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_modelParameters->appendRow(item);
}

// -------------------------------------------------------

void SystemEvent::write(QJsonObject &json) const{
    SuperListItem::write(json);
    SystemCreateParameter* param;
    QJsonArray jsonParameters;
    QJsonObject obj;
    int l;

    // Parameters
    l = m_modelParameters->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        obj = QJsonObject();
        param = (SystemCreateParameter*) m_modelParameters->item(i)->data()
                .value<quintptr>();
        param->write(obj);
        jsonParameters.append(obj);
    }
    json["p"] = jsonParameters;
}

