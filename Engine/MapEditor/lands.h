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

#ifndef LANDS_H
#define LANDS_H

#include "mapelement.h"
#include "qray3d.h"
#include "position.h"

// -------------------------------------------------------
//
//  CLASS LandDatas
//
//  A square floor datas.
//
// -------------------------------------------------------

class LandDatas : public MapElement
{
public:
    LandDatas();
    virtual ~LandDatas();
    virtual MapEditorSubSelectionKind getSubKind() const;

    float intersection(int squareSize, QRay3D& ray, Position& position);

    virtual void read(const QJsonObject &);
    virtual void write(QJsonObject &) const;
};

// -------------------------------------------------------
//
//  CLASS Lands
//
// -------------------------------------------------------

class Lands
{
public:
    Lands();
};

#endif // LANDS_H
