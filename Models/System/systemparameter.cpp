/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
