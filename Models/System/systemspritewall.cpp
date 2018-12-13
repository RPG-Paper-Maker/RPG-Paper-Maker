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

#include "systemspritewall.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemSpriteWall::SystemSpriteWall() :
    SystemSpecialElement()
{

}

SystemSpriteWall::SystemSpriteWall(int i, QString n, int pictureId) :
    SystemSpecialElement(i, n, pictureId)
{

}

SystemSpriteWall::~SystemSpriteWall()
{

}

SystemPicture* SystemSpriteWall::picture() const {
    return pictureByKind(PictureKind::Walls);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemSpriteWall::createCopy() const{
    SystemSpriteWall* super = new SystemSpriteWall;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemSpriteWall::setCopy(const SystemSpriteWall& super){
    SystemSpecialElement::setCopy(super);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemSpriteWall::read(const QJsonObject &json){
    SystemSpecialElement::read(json);
}

// -------------------------------------------------------

void SystemSpriteWall::write(QJsonObject &json) const{
    SystemSpecialElement::write(json);
}
