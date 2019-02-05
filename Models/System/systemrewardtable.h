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

#ifndef SYSTEMREWARDTABLE_H
#define SYSTEMREWARDTABLE_H

#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemRewardTable
//
//  A particulary reward table for monsters (datas).
//
// -------------------------------------------------------

class SystemRewardTable : public SuperListItem
{
public:
    static const QString JSON_BASE;
    static const QString JSON_INFLATION;
    static const QString JSON_TABLE;

    SystemRewardTable();
    SystemRewardTable(int base, int inflation);
    virtual ~SystemRewardTable();
    int base() const;
    void setBase(int i);
    int inflation() const;
    void setInflation(int i);
    QHash<int, int> * table();

    void reset();

    void setCopy(const SystemRewardTable& reward);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_base;
    int m_inflation;
    QHash<int, int> m_table;
};

Q_DECLARE_METATYPE(SystemRewardTable)

#endif // SYSTEMREWARDTABLE_H
