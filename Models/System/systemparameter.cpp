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

#include "systemparameter.h"
#include "dialogsystemparameter.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemParameter::SystemParameter() :
    SystemParameter(1, "", nullptr, new PrimitiveValue)
{

}

SystemParameter::SystemParameter(int i, QString n,
                                 SystemCreateParameter* parameter,
                                 PrimitiveValue* value) :
    SuperListItem(i, n),
    m_parameter(parameter),
    m_value(value)
{

}

SystemParameter::~SystemParameter(){
    delete m_value;
}

SystemCreateParameter* SystemParameter::parameter() const {
    return m_parameter;
}

PrimitiveValue* SystemParameter::value() const { return m_value; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SystemParameter::openDialog(){
    SystemParameter param;
    param.setCopy(*this);
    DialogSystemParameter dialog(param);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(param);
        return true;
    }

    return false;
}

// -------------------------------------------------------

SuperListItem* SystemParameter::createCopy() const{
    SystemParameter* super = new SystemParameter;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemParameter::setCopy(const SystemParameter& param){
    SuperListItem::setCopy(param);
    p_id = param.p_id;

    m_parameter = param.m_parameter;
    m_value->setCopy(*param.m_value);
}

// -------------------------------------------------------

QList<QStandardItem *> SystemParameter::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    QStandardItem* itemValue = new QStandardItem;
    QStandardItem* itemDefault = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setText(toStringName());
    itemValue->setText(m_value->toString());
    itemDefault->setText(m_parameter->defaultValue()->toString());
    row.append(item);
    row.append(itemValue);
    row.append(itemDefault);

    return row;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemParameter::read(const QJsonObject &json){
    SuperListItem::read(json);

    m_value->read(json["v"].toObject());
}

// -------------------------------------------------------

void SystemParameter::write(QJsonObject &json) const{
    SuperListItem::write(json);
    QJsonObject obj;

    obj = QJsonObject();
    m_value->write(obj);
    json["v"] = obj;
}
