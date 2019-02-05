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

#ifndef SERIALIALIZABLE_H
#define SERIALIALIZABLE_H

#include <QJsonObject>
#include <QJsonArray>

// -------------------------------------------------------
//
//  CLASS Serializable
//
//  All the classes that can be written/read with json should
//  inherit this class in order to call RPM::read and RPM::write
//  methods.
//
// -------------------------------------------------------

class Serializable
{
public:
    virtual void read(const QJsonObject &json) = 0;
    virtual void write(QJsonObject &json) const = 0;
};

#endif // SERIALIALIZABLE_H
