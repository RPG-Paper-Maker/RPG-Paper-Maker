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

#include "autotile.h"

// -------------------------------------------------------
//
//
//  ---------- AUTOTILEDATAS
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

AutotileDatas::AutotileDatas() :
    AutotileDatas(1, new QRect)
{

}

AutotileDatas::AutotileDatas(int autotileID, QRect *texture, bool up) :
    LandDatas(texture, up),
    m_autotileID(autotileID)
{

}

int AutotileDatas::autotileID() const {
    return m_autotileID;
}

bool AutotileDatas::operator==(const AutotileDatas& other) const {
    return LandDatas::operator==(other) && m_autotileID == other.m_autotileID;
}

bool AutotileDatas::operator!=(const AutotileDatas& other) const {
    return !operator==(other);
}

MapEditorSubSelectionKind AutotileDatas::getSubKind() const{
    return MapEditorSubSelectionKind::Autotiles;
}

QString AutotileDatas::toString() const {
    return "AUTOTILE";
}

// -------------------------------------------------------
//
//
//  ---------- AUTOTILE
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Autotile::Autotile()
{

}
