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

#ifndef POSITION_H
#define POSITION_H

#include "position3d.h"

// -------------------------------------------------------
//
//  CLASS Position
//
//  A possible position of an element in the map (taking layer
//  into account).
//
// -------------------------------------------------------

class Position : public Position3D
{
public:
    Position();
    Position(int x, int y, int y_plus, int z, int layer);
    virtual ~Position();

    const static int LAYERS_NUMBER = 2;
    bool operator==(const Position& other) const;
    bool operator!=(const Position& other) const;
    void setX(int x);
    void setZ(int z);
    void setCoords(int x, int y, int y_plus, int z);
    int layer() const;
    void setLayer(int l);

    virtual QString toString(int squareSize) const;

    void read(const QJsonArray &json);
    void write(QJsonArray & json) const;

protected:
    int m_layer;

    void getStringLayerYPlus(QString& infos, int squareSize) const;
};

inline uint qHash(const Position& pos)
{
   return (pos.x() + pos.y() + pos.yPlus() + pos.z() + pos.layer());
}

#endif // POSITION_H
