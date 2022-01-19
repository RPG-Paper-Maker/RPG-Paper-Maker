/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemparameter.h"
#include "dialogsystemparameter.h"
#include "rpm.h"

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

void SystemParameter::setCopy(const SuperListItem &super) {
    const SystemParameter *param;

    SuperListItem::setCopy(super);

    param = reinterpret_cast<const SystemParameter *>(&super);
    p_id = param->p_id;
    m_parameter = param->m_parameter;
    m_value->setCopy(*param->m_value);
    m_value->setModelProperties(RPM::get()->project()->currentObjectProperties());
    m_value->setModelParameter(RPM::get()->project()->currentParameters());
}

// -------------------------------------------------------

QList<QStandardItem *> SystemParameter::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    QStandardItem* itemValue = new QStandardItem;
    QStandardItem* itemDefault = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setText(toStringName());
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    itemValue->setText(m_value->toString());
    itemValue->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemValue->setFlags(itemValue->flags() ^ (Qt::ItemIsDropEnabled));
    itemDefault->setText(m_parameter->defaultValue()->toString());
    itemDefault->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemDefault->setFlags(itemDefault->flags() ^ (Qt::ItemIsDropEnabled));
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

void SystemParameter::read(const QJsonObject &json) {
    SuperListItem::read(json);

    m_value->read(json["v"].toObject());
    m_value->setModelProperties(RPM::get()->project()->currentObjectProperties());
    m_value->setModelParameter(RPM::get()->project()->currentParameters());
}

// -------------------------------------------------------

void SystemParameter::write(QJsonObject &json) const{
    SuperListItem::write(json);
    QJsonObject obj;

    obj = QJsonObject();
    m_value->write(obj);
    json["v"] = obj;
}
