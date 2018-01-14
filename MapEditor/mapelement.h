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

#ifndef MAPELEMENT_H
#define MAPELEMENT_H

#include "mapeditorsubselectionkind.h"
#include "mapeditorselectionkind.h"
#include "serializable.h"
#include "orientationkind.h"
#include "cameraupdownkind.h"
#include "position.h"
#include <QVector3D>

// -------------------------------------------------------
//
//  CLASS MapElement
//
//  A square element in the map.
//
// -------------------------------------------------------

class MapElement : public Serializable
{
public:
    MapElement();
    virtual ~MapElement();
    bool operator==(const MapElement& other) const;
    bool operator!=(const MapElement& other) const;
    void setXOffset(int x);
    void setYOffset(int y);
    void setZOffset(int z);

    static QString jsonX;
    static QString jsonY;
    static QString jsonZ;

    virtual MapEditorSelectionKind getKind() const;
    virtual MapEditorSubSelectionKind getSubKind() const;
    virtual QString toString() const;
    virtual void getPosSizeCenter(QVector3D& pos, QVector3D& size,
                                  QVector3D& center, QVector3D &offset,
                                  int squareSize, Position &position, int width,
                                  int height, bool front);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_xOffset;
    int m_yOffset;
    int m_zOffset;
};

#endif // MAPELEMENT_H
