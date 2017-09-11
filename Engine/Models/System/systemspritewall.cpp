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

#include "systemspritewall.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemSpriteWall::SystemSpriteWall() :
    SystemSpriteWall(1, "", 1)
{

}

SystemSpriteWall::SystemSpriteWall(int i, QString n, int pictureId) :
    SuperListItem(i, n),
    m_pictureID(pictureId)
{

}

SystemSpriteWall::~SystemSpriteWall()
{

}

SystemPicture* SystemSpriteWall::picture() const {
    return (SystemPicture*) SuperListItem::getById(
                Wanok::get()->project()->picturesDatas()
                ->model(PictureKind::Walls)->invisibleRootItem(), m_pictureID);
}

void SystemSpriteWall::setPictureID(int id) {
    m_pictureID = id;
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
    SuperListItem::setCopy(super);

    m_pictureID = super.m_pictureID;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemSpriteWall::read(const QJsonObject &json){
    SuperListItem::read(json);

    m_pictureID = json["pic"].toInt();
}

// -------------------------------------------------------

void SystemSpriteWall::write(QJsonObject &json) const{
    SuperListItem::write(json);

    json["pic"] = m_pictureID;
}
