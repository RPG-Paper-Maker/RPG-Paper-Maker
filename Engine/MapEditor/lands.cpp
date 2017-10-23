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

#include "lands.h"
#include "floors.h"

// -------------------------------------------------------
//
//
//  ---------- LANDDATAS
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

LandDatas::LandDatas()
{

}

LandDatas::~LandDatas()
{

}

MapEditorSubSelectionKind LandDatas::getSubKind() const{
    return MapEditorSubSelectionKind::None;
}

float LandDatas::intersection(int squareSize, QRay3D& ray, Position& position) {
    /*
    QVector3D pos, size, center;
    float minDistance = 0, distance = 0;
    QBox3D box;

    QVector3D vecA = Floor::verticesQuad[0] * size + pos,
              vecB = Floor::verticesQuad[1] * size + pos,
              vecC = Floor::verticesQuad[2] * size + pos,
              vecD = Floor::verticesQuad[3] * size + pos;
        box = QBox3D(vecA, vecC);
        minDistance = box.intersection(ray);*/

    return 0.0f;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void LandDatas::read(const QJsonObject &){

}

// -------------------------------------------------------

void LandDatas::write(QJsonObject &) const{

}

// -------------------------------------------------------
//
//
//  ---------- LANDS
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Lands::Lands()
{

}
