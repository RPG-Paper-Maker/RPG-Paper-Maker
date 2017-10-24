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

#include "mapelement.h"

QString MapElement::jsonOrientation = "o";
QString MapElement::jsonUp = "up";
QString MapElement::jsonX = "xOff";
QString MapElement::jsonY = "yOff";
QString MapElement::jsonZ = "zOff";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MapElement::MapElement() :
    m_orientation(OrientationKind::None),
    m_up(CameraUpDownKind::None),
    m_xOffset(0),
    m_yOffset(0),
    m_zOffset(0)
{

}

MapElement::~MapElement()
{

}

void MapElement::setUpDown(CameraUpDownKind upDown) {
    m_up = upDown;
}

MapEditorSelectionKind MapElement::getKind() const{
    return MapEditorSelectionKind::Land;
}

MapEditorSubSelectionKind MapElement::getSubKind() const{
    return MapEditorSubSelectionKind::None;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void MapElement::read(const QJsonObject & json){
    if (json.contains(MapElement::jsonOrientation)) {
        m_orientation = static_cast<OrientationKind>(
                    json[MapElement::jsonOrientation].toInt());
    }
    if (json.contains(MapElement::jsonUp))
        m_up = static_cast<CameraUpDownKind>(json[MapElement::jsonUp].toInt());
    if (json.contains(MapElement::jsonX))
        m_xOffset = json[MapElement::jsonX].toInt();
    if (json.contains(MapElement::jsonY))
        m_yOffset = json[MapElement::jsonY].toInt();
    if (json.contains(MapElement::jsonZ))
        m_zOffset = json[MapElement::jsonZ].toInt();
}

// -------------------------------------------------------

void MapElement::write(QJsonObject &json) const{
    if (m_orientation != OrientationKind::None)
        json[MapElement::jsonOrientation] = (int) m_orientation;
    if (m_up != CameraUpDownKind::None)
        json[MapElement::jsonUp] = (int) m_up;
    if (m_xOffset != 0)
        json[MapElement::jsonX] = m_xOffset;
    if (m_yOffset != 0)
        json[MapElement::jsonY] = m_yOffset;
    if (m_zOffset != 0)
        json[MapElement::jsonZ] = m_zOffset;
}
