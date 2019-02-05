/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#include "systemcreateparameter.h"
#include "dialogsystemcreateparameter.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCreateParameter::SystemCreateParameter() :
    SystemCreateParameter(-1,"",new PrimitiveValue)
{

}

SystemCreateParameter::SystemCreateParameter(int i, QString n,
                                             PrimitiveValue* defaultValue) :
    SuperListItem(i,n),
    m_defaultValue(defaultValue)
{

}

SystemCreateParameter::~SystemCreateParameter(){
    delete m_defaultValue;
}

PrimitiveValue* SystemCreateParameter::defaultValue() const {
    return m_defaultValue;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SystemCreateParameter::openDialog(){
    SystemCreateParameter param;
    param.setCopy(*this);
    DialogSystemCreateParameter dialog(param);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(param);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemCreateParameter::createCopy() const{
    SystemCreateParameter* super = new SystemCreateParameter;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCreateParameter::setCopy(const SystemCreateParameter& param){
    SuperListItem::setCopy(param);
    p_id = param.p_id;

    // Default value
    m_defaultValue->setCopy(*param.defaultValue());
}

// -------------------------------------------------------

QList<QStandardItem *> SystemCreateParameter::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    QStandardItem* itemDefault = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setText(toStringName());
    itemDefault->setText(m_defaultValue->toString());
    row.append(item);
    row.append(itemDefault);

    return row;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemCreateParameter::read(const QJsonObject &json){
    SuperListItem::read(json);

    m_defaultValue->read(json["d"].toObject());
}

// -------------------------------------------------------

void SystemCreateParameter::write(QJsonObject &json) const{
    SuperListItem::write(json);
    QJsonObject obj;

    obj = QJsonObject();
    m_defaultValue->write(obj);
    json["d"] = obj;
}
