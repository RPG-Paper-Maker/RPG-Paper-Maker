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

#include "systemrewardtable.h"

const QString SystemRewardTable::JSON_BASE = "b";
const QString SystemRewardTable::JSON_INFLATION = "i";
const QString SystemRewardTable::JSON_TABLE = "t";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemRewardTable::SystemRewardTable() : SystemRewardTable(0, 0) {

}

SystemRewardTable::SystemRewardTable(int base, int inflation) :
    m_base(base),
    m_inflation(inflation)
{

}

SystemRewardTable::~SystemRewardTable() {

}

int SystemRewardTable::base() const {
    return m_base;
}

void SystemRewardTable::setBase(int i) {
    m_base = i;
}

int SystemRewardTable::inflation() const {
    return m_inflation;
}

void SystemRewardTable::setInflation(int i) {
    m_inflation = i;
}

QHash<int, int> * SystemRewardTable::table() {
    return &m_table;
}

// -------------------------------------------------------
//
//  INTERMEDIARY METHODS
//
// -------------------------------------------------------

void SystemRewardTable::reset() {
    m_base = 0;
    m_inflation = 0;
    m_table.clear();
}

// -------------------------------------------------------
//
//  VIRTUAL METHODS
//
// -------------------------------------------------------

void SystemRewardTable::setCopy(const SystemRewardTable& reward) {
    m_base = reward.m_base;
    m_inflation = reward.m_inflation;
    m_table.clear();
    QHash<int, int>::const_iterator i;
    for (i = reward.m_table.begin(); i != reward.m_table.end(); i++) {
        m_table.insert(i.key(), i.value());
    }
}

// -------------------------------------------------------

void SystemRewardTable::read(const QJsonObject &json) {
    m_base = json[JSON_BASE].toInt();
    m_inflation = json[JSON_INFLATION].toInt();
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

void SystemRewardTable::write(QJsonObject &json) const {
    json[JSON_BASE] = m_base;
    json[JSON_INFLATION] = m_inflation;
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
