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

SystemProgressionTable::SystemProgressionTable() : SystemProgressionTable(0, 0,
    0)
{

}

SystemProgressionTable::SystemProgressionTable(int initialValue, int finalValue,
    int equation) :
    m_initialValue(initialValue),
    m_finalValue(finalValue),
    m_equation(equation)
{

}

SystemProgressionTable::~SystemProgressionTable() {

}

int SystemProgressionTable::initialValue() const {
    return m_initialValue;
}

void SystemProgressionTable::setInitialValue(int i) {
    m_initialValue = i;
}

int SystemProgressionTable::finalValue() const {
    return m_finalValue;
}

void SystemProgressionTable::setFinalValue(int i) {
    m_finalValue = i;
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
    m_initialValue = 0;
    m_finalValue = 0;
    m_equation = 0;
    m_table.clear();
}

// -------------------------------------------------------
//
//  VIRTUAL METHODS
//
// -------------------------------------------------------

void SystemProgressionTable::setCopy(const SystemProgressionTable& progression) {
    m_initialValue = progression.m_initialValue;
    m_finalValue = progression.m_finalValue;
    m_equation = progression.m_equation;
    m_table.clear();
    QHash<int, int>::const_iterator i;
    for (i = progression.m_table.begin(); i != progression.m_table.end(); i++) {
        m_table.insert(i.key(), i.value());
    }
}

// -------------------------------------------------------

void SystemProgressionTable::read(const QJsonObject &json) {
    m_initialValue = json[JSON_INITIAL_VALUE].toInt();
    m_finalValue = json[JSON_FINAL_VALUE].toInt();
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
    json[JSON_INITIAL_VALUE] = m_initialValue;
    json[JSON_FINAL_VALUE] = m_finalValue;
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
