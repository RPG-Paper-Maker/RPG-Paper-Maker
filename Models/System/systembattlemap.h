/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#ifndef SYSTEMBATTLEMAP_H
#define SYSTEMBATTLEMAP_H

#include <QStandardItemModel>
#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"
#include "position3d.h"

// -------------------------------------------------------
//
//  CLASS SystemBattleMap
//
//  A particulary battle map position.
//
// -------------------------------------------------------

class SystemBattleMap : public SuperListItem
{
public:
    SystemBattleMap();
    SystemBattleMap(int i, QString name);
    virtual ~SystemBattleMap();
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemBattleMap &battleMap);

    static const QString jsonIdMap;
    static const QString jsonPosition;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_idMap;
    Position3D m_position;
};

Q_DECLARE_METATYPE(SystemBattleMap)

#endif // SYSTEMATTLEMAP_H
