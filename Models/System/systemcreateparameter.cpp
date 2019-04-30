/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    itemDefault->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemDefault->setText(m_defaultValue->toString());
    itemDefault->setFlags(itemDefault->flags() ^ (Qt::ItemIsDropEnabled));
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
