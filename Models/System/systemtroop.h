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

#ifndef SYSTEMTROOP_H
#define SYSTEMTROOP_H

#include <QStandardItemModel>
#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemTroop
//
//  A particulary troop (datas).
//
// -------------------------------------------------------

class SystemTroop : public SuperListItem
{
public:
    SystemTroop();
    SystemTroop(int i, QString n, QStandardItemModel *monstersList);
    virtual ~SystemTroop();
    QStandardItemModel* monstersList() const;

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemTroop &troop);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QStandardItemModel *m_monstersList;
};

Q_DECLARE_METATYPE(SystemTroop)

#endif // SYSTEMTROOP_H
