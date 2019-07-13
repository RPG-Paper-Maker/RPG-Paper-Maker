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

QStandardItemModel* PrimitiveValue::modelParameter() const {
    return m_modelParameter;
}

void PrimitiveValue::setModelParameter(QStandardItemModel* model) {
    m_modelParameter = model;
}

QStandardItemModel* PrimitiveValue::modelProperties() const {
    return m_modelProperties;
}

void PrimitiveValue::setModelProperties(QStandardItemModel* model) {
    m_modelProperties = model;
}

QStandardItemModel* PrimitiveValue::modelDataBase() const {
    return m_modelDataBase;
}

void PrimitiveValue::setModelDataBase(QStandardItemModel* model) {
    m_modelDataBase = model;
}

QString PrimitiveValue::toString() const{
    switch (m_kind){
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
                ->variablesDatas()->getVariableById(m_numberValue)
                ->toString();
    case PrimitiveValueKind::Parameter:
        return "Parameter:";
    case PrimitiveValueKind::Property:
        return "Property:";
    case PrimitiveValueKind::DataBase:
        return modelDataBase() == nullptr ? "" : SuperListItem::getById(
            modelDataBase()->invisibleRootItem(), m_numberValue)->toString();
    case PrimitiveValueKind::Message:
        return m_messageValue;
    case PrimitiveValueKind::Script:
        return "Script > " + m_messageValue;
    case PrimitiveValueKind::Switch:
        return (m_switchValue ? "ON" : "OFF");
    case PrimitiveValueKind::KeyBoard:
        SystemKeyBoard* k = (SystemKeyBoard*) SuperListItem::getById(
                    RPM::get()->project()->keyBoardDatas()->model()
                    ->invisibleRootItem(), m_numberValue);
        return "Kb:" + k->toString();
    }

    return "";
}

void PrimitiveValue::labelTab(QString& str) const{
    switch (m_kind){
    case PrimitiveValueKind::Anything:
    case PrimitiveValueKind::Parameter:
    case PrimitiveValueKind::Property:
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
        str += "V>" + RPM::get()->project()->gameDatas()
                ->variablesDatas()->getVariableById(m_numberValue)
                ->name();
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
        SystemKeyBoard* k =
                (SystemKeyBoard*) SuperListItem::getById(
                    RPM::get()->project()->keyBoardDatas()->model()
                    ->invisibleRootItem(), m_numberValue);
        str += "KB>" + k->abbreviation();
        break;
    }
}

int PrimitiveValue::numberValue() const { return m_numberValue; }

double PrimitiveValue::numberDoubleValue() const { return m_numberDoubleValue; }

QString PrimitiveValue::messageValue() const { return m_messageValue; }

bool PrimitiveValue::switchValue() const { return m_switchValue; }

void PrimitiveValue::setNumberValue(int n) { m_numberValue = n; }

void PrimitiveValue::setNumberDoubleValue(double n) { m_numberDoubleValue = n; }

void PrimitiveValue::setMessageValue(QString m) { m_messageValue = m; }

void PrimitiveValue::setSwitchValue(bool s) { m_switchValue = s; }

PrimitiveValueKind PrimitiveValue::kind() const { return m_kind; }

void PrimitiveValue::setKind(PrimitiveValueKind k) { m_kind = k; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

PrimitiveValue* PrimitiveValue::createKeyBoard(int id){
    PrimitiveValue* v = new PrimitiveValue;
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

void PrimitiveValue::setCopy(const PrimitiveValue &prim){
    m_kind = prim.kind();

    switch (m_kind){
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

void PrimitiveValue::initializeCommandParameter(const EventCommand* command,
                                                int& i){
    m_kind = static_cast<PrimitiveValueKind>(command->valueCommandAt(i++)
                                             .toInt());
    switch (m_kind){
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
        m_switchValue = command->valueCommandAt(i++) == "1";
        break;
    case PrimitiveValueKind::NumberDouble:
        m_numberDoubleValue = command->valueCommandAt(i++).toDouble();
    }
}

// -------------------------------------------------------

void PrimitiveValue::getCommandParameter(QVector<QString> &command){
    command.append(QString::number((int)m_kind));
    switch (m_kind){
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
        command.append(m_switchValue ? "1" : "0");
        break;
    case PrimitiveValueKind::NumberDouble:
        command.append(QString::number(m_numberDoubleValue));
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
//
//  READ / WRITE
//
// -------------------------------------------------------

void PrimitiveValue::read(const QJsonObject &json){
    m_kind = static_cast<PrimitiveValueKind>(json["k"].toInt());

    // Value
    QJsonValue v = json["v"];
    switch (m_kind){
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

    json["k"] = (int) m_kind;

    // Value
    switch (m_kind){
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
    json["v"] = v;
}
