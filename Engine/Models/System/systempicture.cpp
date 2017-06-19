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

#include "systempicture.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemPicture::SystemPicture() :
    SystemPicture(1, "")
{

}

SystemPicture::SystemPicture(int i, QString n) :
    SuperListItem(i,n)
{

}

SystemPicture::~SystemPicture(){

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemPicture::createCopy() const{
    SystemPicture* super = new SystemPicture;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemPicture::setCopy(const SystemPicture& super){
    SuperListItem::setCopy(super);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemPicture::read(const QJsonObject &json){
    SuperListItem::read(json);

}

// -------------------------------------------------------

void SystemPicture::write(QJsonObject &json) const{
    SuperListItem::write(json);

}
