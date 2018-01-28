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

#include "land.h"
#include "qbox3d.h"
#include "floor.h"
#include "lands.h"

const QString LandDatas::JSON_UP = "up";
const QString LandDatas::JSON_TEXTURE = "t";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

LandDatas::LandDatas(QRect* texture, bool up) :
    MapElement(),
    m_textureRect(texture),
    m_up(up)
{

}

LandDatas::~LandDatas()
{
    delete m_textureRect;
}

bool LandDatas::operator==(const LandDatas& other) const {
    return MapElement::operator==(other) && m_up == other.m_up &&
           m_textureRect->x() == other.m_textureRect->x() &&
           m_textureRect->y() == other.m_textureRect->y() &&
           m_textureRect->width() == other.m_textureRect->width() &&
           m_textureRect->height() == other.m_textureRect->height();
}

bool LandDatas::operator!=(const LandDatas& other) const {
    return !operator==(other);
}

QRect *LandDatas::textureRect() const { return m_textureRect; }

MapEditorSubSelectionKind LandDatas::getSubKind() const{
    return MapEditorSubSelectionKind::None;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void LandDatas::initializeVertices(int, int, int, QVector<Vertex>&,
                                   QVector<GLuint>&, Position&, int&)
{

}

// -------------------------------------------------------

float LandDatas::intersection(int squareSize, QRay3D& ray, Position& position) {
    QVector3D pos, size;
    getPosSize(pos, size, squareSize, position);

    QVector3D vecA = Lands::verticesQuad[0] * size + pos,
              vecC = Lands::verticesQuad[2] * size + pos;
    QBox3D box(vecA, vecC);

    return box.intersection(ray);
}

// -------------------------------------------------------

void LandDatas::getPosSize(QVector3D& pos, QVector3D& size, int squareSize,
                           Position &position)
{
    // Position
    float yLayerOffset = position.layer() * 0.05f;
    if (!m_up)
        yLayerOffset *= -1;
    float yPosition = position.getY(squareSize) + yLayerOffset;
    pos.setX(position.x() * squareSize);
    pos.setY(yPosition);
    pos.setZ(position.z() * squareSize);

    // Size
    size.setX(squareSize);
    size.setY(0.0f);
    size.setZ(squareSize);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void LandDatas::read(const QJsonObject &json){
    MapElement::read(json);

    if (json.contains(JSON_UP))
        m_up = json[JSON_UP].toBool();

    QJsonArray tab = json[JSON_TEXTURE].toArray();
    m_textureRect->setLeft(tab[0].toInt());
    m_textureRect->setTop(tab[1].toInt());

    if (tab.size() > 2) {
        m_textureRect->setWidth(tab[2].toInt());
        m_textureRect->setHeight(tab[3].toInt());
    }
    else {
        m_textureRect->setWidth(1);
        m_textureRect->setHeight(1);
    }
}

// -------------------------------------------------------

void LandDatas::write(QJsonObject &json) const{
    MapElement::write(json);

    if (!m_up)
        json[JSON_UP] = m_up;

    QJsonArray tab;
    tab.append(m_textureRect->left());
    tab.append(m_textureRect->top());
    if (m_textureRect->width() != 1 || m_textureRect->height() != 1) {
        tab.append(m_textureRect->width());
        tab.append(m_textureRect->height());
    }
    json[JSON_TEXTURE] = tab;
}
