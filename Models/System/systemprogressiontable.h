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

#ifndef SYSTEMPROGRESSIONTABLE_H
#define SYSTEMPROGRESSIONTABLE_H

#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemRewardTable
//
//  A particulary reward table for monsters (datas).
//
// -------------------------------------------------------

class SystemProgressionTable : public SuperListItem
{
public:
    static const QString JSON_INITIAL_VALUE;
    static const QString JSON_FINAL_VALUE;
    static const QString JSON_EQUATION;
    static const QString JSON_TABLE;

    SystemProgressionTable();
    SystemProgressionTable(int initialValue, int finalValue, int equation);
    virtual ~SystemProgressionTable();
    int initialValue() const;
    void setInitialValue(int i);
    int finalValue() const;
    void setFinalValue(int i);
    int equation() const;
    void setEquation(int i);
    QHash<int, int> * table();

    void reset();

    void setCopy(const SystemProgressionTable& progression);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_initialValue;
    int m_finalValue;
    int m_equation;
    QHash<int, int> m_table;
};

Q_DECLARE_METATYPE(SystemProgressionTable)

#endif // SYSTEMPROGRESSIONTABLE_H
