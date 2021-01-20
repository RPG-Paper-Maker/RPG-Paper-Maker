/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemspeedfrequency.h"
#include "dialogsystemspeedfrequency.h"

const QString SystemSpeedFrequency::JSON_VALUE = "v";
const QString SystemSpeedFrequency::JSON_IS_SPEED = "is";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemSpeedFrequency::SystemSpeedFrequency() :
    SystemSpeedFrequency(-1, "", new PrimitiveValue(1.0), true)
{

}

SystemSpeedFrequency::SystemSpeedFrequency(int i, QString n, PrimitiveValue *v,
    bool is) :
    SuperListItem (i, n),
    m_value(v),
    m_isSpeed(is)
{

}

SystemSpeedFrequency::~SystemSpeedFrequency() {
    delete m_value;
}

PrimitiveValue * SystemSpeedFrequency::value() const {
    return m_value;
}

bool SystemSpeedFrequency::isSpeed() const {
    return m_isSpeed;
}

void SystemSpeedFrequency::setIsSpeed(bool is) {
    m_isSpeed = is;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemSpeedFrequency::openDialog() {
    SystemSpeedFrequency speedFrequency;
    speedFrequency.setCopy(*this);
    DialogSystemSpeedFrequency dialog(speedFrequency);
    if (dialog.exec() == QDialog::Accepted) {
        setCopy(speedFrequency);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemSpeedFrequency::createCopy() const {
    SystemSpeedFrequency* super = new SystemSpeedFrequency;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemSpeedFrequency::setCopy(const SuperListItem &super) {
    const SystemSpeedFrequency *speedFrequency;

    speedFrequency = reinterpret_cast<const SystemSpeedFrequency *>(&super);
    SuperListItem::setCopy(super);

    m_value->setCopy(*speedFrequency->m_value);
    m_isSpeed = speedFrequency->m_isSpeed;
}

// -------------------------------------------------------

void SystemSpeedFrequency::read(const QJsonObject &json) {
    SuperListItem::read(json);

    if (json.contains(JSON_VALUE)) {
        m_value->read(json[JSON_VALUE].toObject());
    }
    if (json.contains(JSON_IS_SPEED)) {
        m_isSpeed = false;
    }
}

// -------------------------------------------------------

void SystemSpeedFrequency::write(QJsonObject &json) const {
    QJsonObject obj;

    SuperListItem::write(json);

    if (m_value->kind() != PrimitiveValueKind::NumberDouble || m_value
        ->numberDoubleValue() != 1.0)
    {
        m_value->write(obj);
        json[JSON_VALUE] = obj;
    }
    if (!m_isSpeed) {
        json[JSON_IS_SPEED] = false;
    }
}
