/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemproperty.h"
#include "dialogsystemproperty.h"

const QString SystemProperty::JSON_INITIAL_VALUE = "iv";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemProperty::SystemProperty() :
    SystemProperty(-1, "", new PrimitiveValue(PrimitiveValueKind::None))
{

}

SystemProperty::SystemProperty(int id, QString name, PrimitiveValue
    *initialValue) :
    SuperListItem(id, name),
    m_initialValue(initialValue)
{

}

SystemProperty::~SystemProperty() {
    delete m_initialValue;
}

PrimitiveValue * SystemProperty::initialValue() const {
    return m_initialValue;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemProperty::toString() const {
    return SuperListItem::toString() + " = " + m_initialValue->toString();
}

// -------------------------------------------------------

bool SystemProperty::openDialog() {
    SystemProperty super;

    super.setCopy(*this);
    DialogSystemProperty dialog(super);
    if (dialog.exec() == QDialog::Accepted) {
        setCopy(super);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemProperty::createCopy() const {
    SystemProperty *super = new SystemProperty;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemProperty::setCopy(const SuperListItem& super) {
    const SystemProperty *property;

    SuperListItem::setCopy(super);
    property = reinterpret_cast<const SystemProperty *>(&super);
    p_id = property->p_id;
    m_initialValue->setCopy(*property->m_initialValue);
}

// -------------------------------------------------------

void SystemProperty::read(const QJsonObject &json) {
    SuperListItem::read(json);

    if (json.contains(JSON_INITIAL_VALUE)) {
        m_initialValue->read(json[JSON_INITIAL_VALUE].toObject());
    }
}

// -------------------------------------------------------

void SystemProperty::write(QJsonObject &json) const {
    QJsonObject obj;

    SuperListItem::write(json);

    if (m_initialValue->kind() != PrimitiveValueKind::None) {
        m_initialValue->write(obj);
        json[JSON_INITIAL_VALUE] = obj;
    }
}
