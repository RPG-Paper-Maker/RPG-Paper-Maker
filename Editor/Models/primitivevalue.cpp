/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "primitivevalue.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PrimitiveValue::PrimitiveValue() :
    m_kind(PrimitiveValueKind::Anything),
    m_numberValue(1),
    m_numberDoubleValue(0),
    m_messageValue(""),
    m_switchValue(true),
    m_modelParameter(nullptr),
    m_modelProperties(nullptr),
    m_modelDataBase(nullptr)
{

}

PrimitiveValue::PrimitiveValue(int n) :
    PrimitiveValue()
{
    m_kind = PrimitiveValueKind::Number;
    m_numberValue = n;
}

PrimitiveValue::PrimitiveValue(double n) :
    PrimitiveValue()
{
    m_kind = PrimitiveValueKind::NumberDouble;
    m_numberDoubleValue = n;
}

PrimitiveValue::PrimitiveValue(QString m) :
    PrimitiveValue()
{
    m_kind = PrimitiveValueKind::Message;
    m_messageValue = m;
}

PrimitiveValue::PrimitiveValue(bool s) :
    PrimitiveValue()
{
    m_kind = PrimitiveValueKind::Switch;
    m_switchValue = s;
}

PrimitiveValue::PrimitiveValue(PrimitiveValueKind kind) :
    PrimitiveValue()
{
    m_kind = kind;
}

PrimitiveValue::PrimitiveValue(PrimitiveValueKind kind, int n) :
    PrimitiveValue(kind)
{
    m_numberValue = n;
}

PrimitiveValueKind PrimitiveValue::kind() const {
    return m_kind;
}

void PrimitiveValue::setKind(PrimitiveValueKind k) {
    m_kind = k;
}

int PrimitiveValue::numberValue() const {
    return m_numberValue;
}

void PrimitiveValue::setNumberValue(int n) {
    m_numberValue = n;
}

double PrimitiveValue::numberDoubleValue() const {
    return m_numberDoubleValue;
}

void PrimitiveValue::setNumberDoubleValue(double n) {
    m_numberDoubleValue = n;
}

QString PrimitiveValue::messageValue() const {
    return m_messageValue;
}

void PrimitiveValue::setMessageValue(QString m) {
    m_messageValue = m;
}

bool PrimitiveValue::switchValue() const {
    return m_switchValue;
}

void PrimitiveValue::setSwitchValue(bool s) {
    m_switchValue = s;
}

QStandardItemModel * PrimitiveValue::modelParameter() const {
    return m_modelParameter;
}

void PrimitiveValue::setModelParameter(QStandardItemModel *model) {
    m_modelParameter = model;
}

QStandardItemModel * PrimitiveValue::modelProperties() const {
    return m_modelProperties;
}

void PrimitiveValue::setModelProperties(QStandardItemModel *model) {
    m_modelProperties = model;
}

QStandardItemModel * PrimitiveValue::modelDataBase() const {
    return m_modelDataBase;
}

void PrimitiveValue::setModelDataBase(QStandardItemModel *model) {
    m_modelDataBase = model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

PrimitiveValue * PrimitiveValue::createKeyBoard(int id) {
    PrimitiveValue *v;

    v = new PrimitiveValue;
    v->setKind(PrimitiveValueKind::KeyBoard);
    v->setNumberValue(id);

    return v;
}

// -------------------------------------------------------

PrimitiveValue * PrimitiveValue::createDefaultDataBaseValue() {
    return new PrimitiveValue(PrimitiveValueKind::DataBase, 1);
}

// -------------------------------------------------------

PrimitiveValue * PrimitiveValue::createDefaultNumberValue() {
    return new PrimitiveValue(0);
}

// -------------------------------------------------------

PrimitiveValue * PrimitiveValue::createDefaultMessageValue() {
    return new PrimitiveValue(QString());
}

// -------------------------------------------------------

QString PrimitiveValue::toString() const {
    switch (m_kind) {
    case PrimitiveValueKind::Default:
        return "Default";
    case PrimitiveValueKind::Anything:
        return "Anything";
    case PrimitiveValueKind::None:
        return "None";
    case PrimitiveValueKind::Number:
        return QString::number(m_numberValue);
    case PrimitiveValueKind::NumberDouble:
        return QString::number(m_numberDoubleValue);
    case PrimitiveValueKind::Variable:
        return "Variable: " + RPM::get()->project()->gameDatas()
            ->variablesDatas()->getVariableById(m_numberValue)->toString();
    case PrimitiveValueKind::Parameter:
        return this->modelParameter() == nullptr ? "" : "Parameter: " +
            SuperListItem::getById(this->modelParameter()->invisibleRootItem(),
            m_numberValue)->toString();
    case PrimitiveValueKind::Property:
        return this->modelProperties() == nullptr ? "" : "Property: " +
            SuperListItem::getById(this->modelProperties()->invisibleRootItem(),
            m_numberValue)->toString();
    case PrimitiveValueKind::DataBase:
        return this->modelDataBase() == nullptr ? "" : SuperListItem::getById(
            this->modelDataBase()->invisibleRootItem(), m_numberValue)
            ->toString();
    case PrimitiveValueKind::Message:
        return m_messageValue;
    case PrimitiveValueKind::Script:
        return "Script > " + m_messageValue;
    case PrimitiveValueKind::Switch:
        return (m_switchValue ? "ON" : "OFF");
    case PrimitiveValueKind::KeyBoard:
        return "Kb:" + reinterpret_cast<SystemKeyBoard *>(SuperListItem::getById
            (RPM::get()->project()->keyBoardDatas()->model()
            ->invisibleRootItem(), m_numberValue))->toString();
    }

    return "";
}

// -------------------------------------------------------

void PrimitiveValue::labelTab(QString &str) const {
    switch (m_kind) {
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::Default:
        break;
    case PrimitiveValueKind::None:
        str += "NONE";
        break;
    case PrimitiveValueKind::Number:
        str += QString::number(m_numberValue);
        break;
    case PrimitiveValueKind::NumberDouble:
        str += QString::number(m_numberDoubleValue);
        break;
    case PrimitiveValueKind::Variable:
        str += "V>" + RPM::get()->project()->gameDatas()->variablesDatas()
            ->getVariableById(m_numberValue)->name();
        break;
    case PrimitiveValueKind::Message:
        str += "\"" + m_messageValue + "\"";
        break;
    case PrimitiveValueKind::Script:
        str += "<" + m_messageValue + ">";
        break;
    case PrimitiveValueKind::Switch:
        str += (m_switchValue ? "ON" : "OFF");
        break;
    case PrimitiveValueKind::KeyBoard:
        str += "KB>" + reinterpret_cast<SystemKeyBoard *>(SuperListItem::getById
            (RPM::get()->project()->keyBoardDatas()->model()
            ->invisibleRootItem(), m_numberValue))->abbreviation();
        break;
    case PrimitiveValueKind::Property:
        str += "P>" + SuperListItem::getById(RPM::get()->project()
            ->currentObject()->modelProperties()->invisibleRootItem(),
            m_numberValue)->name();
        break;
    }
}

// -------------------------------------------------------

bool PrimitiveValue::isDefaultDataBaseValue() const {
    return m_kind == PrimitiveValueKind::DataBase && m_numberValue == 1;
}

// -------------------------------------------------------

bool PrimitiveValue::isDefaultNumberValue() const {
    return m_kind == PrimitiveValueKind::Number && m_numberValue == 0;
}

// -------------------------------------------------------

bool PrimitiveValue::isDefaultMessageValue() const {
    return m_kind == PrimitiveValueKind::Message && m_messageValue.isEmpty();
}

// -------------------------------------------------------

void PrimitiveValue::initializeCommandParameter(const EventCommand *command, int
    &i)
{
    m_kind = static_cast<PrimitiveValueKind>(command->valueCommandAt(i++)
        .toInt());
    switch (m_kind) {
    case PrimitiveValueKind::Default:
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::None:
        break;
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::Variable:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::Property:
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::KeyBoard:
        m_numberValue = command->valueCommandAt(i++).toInt();
        break;
    case PrimitiveValueKind::Message:
    case PrimitiveValueKind::Script:
        m_messageValue = command->valueCommandAt(i++);
        break;
    case PrimitiveValueKind::Switch:
        m_switchValue = command->valueCommandAt(i++) == RPM::TRUE_BOOL_STRING;
        break;
    case PrimitiveValueKind::NumberDouble:
        m_numberDoubleValue = command->valueCommandAt(i++).toDouble();
    }
}

// -------------------------------------------------------

void PrimitiveValue::getCommandParameter(QVector<QString> &command) {
    command.append(QString::number(static_cast<int>(m_kind)));
    switch (m_kind) {
    case PrimitiveValueKind::Default:
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::None:
        break;
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::Variable:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::Property:
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::KeyBoard:
        command.append(QString::number(m_numberValue));
        break;
    case PrimitiveValueKind::Message:
    case PrimitiveValueKind::Script:
        command.append(m_messageValue);
        break;
    case PrimitiveValueKind::Switch:
        command.append(m_switchValue ? RPM::TRUE_BOOL_STRING : RPM
            ::FALSE_BOOL_STRING);
        break;
    case PrimitiveValueKind::NumberDouble:
        command.append(QString::number(m_numberDoubleValue));
    }
}

// -------------------------------------------------------

void PrimitiveValue::setCopy(const PrimitiveValue &prim) {
    m_kind = prim.kind();

    switch (m_kind) {
    case PrimitiveValueKind::Default:
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::None:
        break;
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::Variable:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::Property:
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::KeyBoard:
         m_numberValue = prim.m_numberValue; break;
    case PrimitiveValueKind::Message:
    case PrimitiveValueKind::Script:
        m_messageValue = prim.m_messageValue; break;
    case PrimitiveValueKind::Switch:
        m_switchValue = prim.m_switchValue; break;
    case PrimitiveValueKind::NumberDouble:
        m_numberDoubleValue = prim.m_numberDoubleValue; break;
    }
    m_modelParameter = prim.m_modelParameter;
    m_modelProperties = prim.m_modelProperties;
    m_modelDataBase = prim.m_modelDataBase;
}

// -------------------------------------------------------

void PrimitiveValue::read(const QJsonObject &json) {
    QJsonValue v;

    m_kind = static_cast<PrimitiveValueKind>(json[RPM::JSON_KEY].toInt());

    // Value
    v = json[RPM::JSON_VALUE];
    switch (m_kind) {
    case PrimitiveValueKind::Default:
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::None:
        break;
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::Variable:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::Property:
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::KeyBoard:
        m_numberValue = v.toInt(); break;    
    case PrimitiveValueKind::Message:
    case PrimitiveValueKind::Script:
        m_messageValue = v.toString(); break;
    case PrimitiveValueKind::Switch:
        m_switchValue = v.toBool(); break;
    case PrimitiveValueKind::NumberDouble:
        m_numberDoubleValue = v.toDouble(); break;
    }
}

// -------------------------------------------------------

void PrimitiveValue::write(QJsonObject &json) const{
    QJsonValue v;

    json[RPM::JSON_KEY] = static_cast<int>(m_kind);

    // Value
    switch (m_kind) {
    case PrimitiveValueKind::Default:
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::None:
        break;
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::Variable:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::Property:
    case PrimitiveValueKind::DataBase:
    case PrimitiveValueKind::KeyBoard:
        v = m_numberValue; break;
    case PrimitiveValueKind::Message:
    case PrimitiveValueKind::Script:
        v = m_messageValue; break;
    case PrimitiveValueKind::Switch:
        v = m_switchValue; break;
    case PrimitiveValueKind::NumberDouble:
        v = m_numberDoubleValue; break;
    }
    json[RPM::JSON_VALUE] = v;
}
