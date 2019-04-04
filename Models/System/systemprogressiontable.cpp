/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemprogressiontable.h"

const QString SystemProgressionTable::JSON_INITIAL_VALUE = "i";
const QString SystemProgressionTable::JSON_FINAL_VALUE = "f";
const QString SystemProgressionTable::JSON_EQUATION = "e";
const QString SystemProgressionTable::JSON_TABLE = "t";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemProgressionTable::SystemProgressionTable() : SystemProgressionTable(new
    PrimitiveValue(0), new PrimitiveValue(0), 0)
{

}

SystemProgressionTable::SystemProgressionTable(PrimitiveValue *initialValue,
    PrimitiveValue *finalValue, int equation) :
    m_initialValue(initialValue),
    m_finalValue(finalValue),
    m_equation(equation)
{

}

SystemProgressionTable::~SystemProgressionTable() {
    delete m_initialValue;
    delete m_finalValue;
}

PrimitiveValue * SystemProgressionTable::initialValue() const {
    return m_initialValue;
}

PrimitiveValue * SystemProgressionTable::finalValue() const {
    return m_finalValue;
}

int SystemProgressionTable::equation() const {
    return m_equation;
}

void SystemProgressionTable::setEquation(int i) {
    m_equation = i;
}

QHash<int, int> * SystemProgressionTable::table() {
    return &m_table;
}

// -------------------------------------------------------
//
//  INTERMEDIARY METHODS
//
// -------------------------------------------------------

void SystemProgressionTable::reset() {
    m_initialValue->setNumberValue(0);
    m_initialValue->setKind(PrimitiveValueKind::Number);
    m_finalValue->setNumberValue(0);
    m_finalValue->setKind(PrimitiveValueKind::Number);
    m_equation = 0;
    m_table.clear();
}

// -------------------------------------------------------

bool SystemProgressionTable::isDefault() const {
    return m_initialValue->kind() == PrimitiveValueKind::Number &&
        m_initialValue->numberValue() == 0 && m_finalValue->kind() ==
        PrimitiveValueKind::Number && m_finalValue->numberValue() == 0 &&
        m_equation == 0 && m_table.isEmpty();
}

// -------------------------------------------------------
//
//  VIRTUAL METHODS
//
// -------------------------------------------------------

void SystemProgressionTable::setCopy(const SystemProgressionTable& progression)
{
    m_initialValue->setCopy(*progression.m_initialValue);
    m_finalValue->setCopy(*progression.m_finalValue);
    m_equation = progression.m_equation;
    m_table.clear();
    QHash<int, int>::const_iterator i;
    for (i = progression.m_table.begin(); i != progression.m_table.end(); i++) {
        m_table.insert(i.key(), i.value());
    }
}

// -------------------------------------------------------

void SystemProgressionTable::read(const QJsonObject &json) {
    QJsonObject obj;

    obj = json[JSON_INITIAL_VALUE].toObject();
    m_initialValue->read(obj);
    obj = json[JSON_FINAL_VALUE].toObject();
    m_finalValue->read(obj);
    m_equation = json[JSON_EQUATION].toInt();
    m_table.clear();
    QJsonArray tab = json[JSON_TABLE].toArray();
    for (int i = 0; i < tab.size(); i++) {
        QJsonObject obj = tab.at(i).toObject();
        int level = obj["k"].toInt();
        int value = obj["v"].toInt();
        m_table[level] = value;
    }
}

// -------------------------------------------------------

void SystemProgressionTable::write(QJsonObject &json) const {
    QJsonObject obj;

    obj = QJsonObject();
    m_initialValue->write(obj);
    json[JSON_INITIAL_VALUE] = obj;
    obj = QJsonObject();
    m_finalValue->write(obj);
    json[JSON_FINAL_VALUE] = obj;
    json[JSON_EQUATION] = m_equation;
    QJsonArray tab;
    QHash<int, int>::const_iterator i;
    for (i = m_table.begin(); i != m_table.end(); i++) {
        QJsonObject objHash;
        QJsonArray tabKey;
        int level = i.key();
        int value = i.value();
        objHash["k"] = level;
        objHash["v"] = value;
        tab.append(objHash);
    }
    if (!tab.isEmpty()) {
        json[JSON_TABLE] = tab;
    }
}
