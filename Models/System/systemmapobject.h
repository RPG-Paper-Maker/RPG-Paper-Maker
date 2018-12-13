/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#ifndef SYSTEMMAPOBJECT_H
#define SYSTEMMAPOBJECT_H

#include "superlistitem.h"
#include "position3d.h"

// -------------------------------------------------------
//
//  CLASS SystemMapObject
//
//  A particulary map object (local).
//
// -------------------------------------------------------

class SystemMapObject : public SuperListItem
{
public:
    SystemMapObject();
    SystemMapObject(int i, QString n, Position3D& position);
    virtual ~SystemMapObject();
    Position3D position() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    Position3D m_position;
};

#endif // SYSTEMMAPOBJECT_H
