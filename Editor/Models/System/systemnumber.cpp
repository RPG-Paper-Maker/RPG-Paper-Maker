/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemnumber.h"

const QString SystemNumber::JSON_VALUE = "value";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemNumber::SystemNumber(PrimitiveValue *value) :
    SuperListItem(),
    m_value(value)
{

}

SystemNumber::~SystemNumber()
{
    delete m_value;
}

PrimitiveValue * SystemNumber::value() const
{
    return m_value;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemNumber::openDialog()
{
    SystemNumber number;
    number.setCopy(*this);
    DialogSystemNumber dialog(number);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(number);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemNumber::createCopy() const
{
    SystemNumber *super = new SystemNumber;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemNumber::setCopy(const SuperListItem &super)
{
    SuperListItem::setCopy(super);
    const SystemNumber *number = reinterpret_cast<const SystemNumber *>(&super);
    m_value->setCopy(*number->m_value);
}

// -------------------------------------------------------

QString SystemNumber::toString() const
{
    return SuperListItem::beginningText + m_value->toString();
}

// -------------------------------------------------------

void SystemNumber::read(const QJsonObject &json)
{
    if (json.contains(JSON_VALUE))
    {
        m_value->read(json[JSON_VALUE].toObject());
    }
}

// -------------------------------------------------------

void SystemNumber::write(QJsonObject &json) const
{
    if (!m_value->isDefaultNumberValue())
    {
        QJsonObject obj;
        m_value->write(obj);
        json[JSON_VALUE] = obj;
    }
}
