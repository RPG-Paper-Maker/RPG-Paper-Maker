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

#include "systemautotile.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemAutotile::SystemAutotile() :
    SystemSpecialElement()
{

}

SystemAutotile::SystemAutotile(int i, QString n, int pictureId) :
    SystemSpecialElement(i, n, pictureId)
{

}

SystemAutotile::~SystemAutotile()
{

}

SystemPicture* SystemAutotile::picture() const {
    return pictureByKind(PictureKind::Autotiles);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemAutotile::createCopy() const{
    SystemAutotile* super = new SystemAutotile;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemAutotile::setCopy(const SystemAutotile& super){
    SystemSpecialElement::setCopy(super);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemAutotile::read(const QJsonObject &json){
    SystemSpecialElement::read(json);
}

// -------------------------------------------------------

void SystemAutotile::write(QJsonObject &json) const{
    SystemSpecialElement::write(json);
}
