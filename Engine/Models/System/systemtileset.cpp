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

#include "systemtileset.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemTileset::SystemTileset() :
    SystemTileset(1, "", 1)
{

}

SystemTileset::SystemTileset(int i, QString n, int pictureId) :
    SuperListItem(i, n),
    m_pictureID(pictureId)
{
    setPictureFromId(pictureId);
}

SystemTileset::SystemTileset(int i, QString n, SystemPicture *picture) :
    SuperListItem(i, n),
    m_picture(picture),
    m_pictureID(picture->id())
{

}

SystemTileset::~SystemTileset(){

}

SystemPicture* SystemTileset::picture() const { return m_picture; }

void SystemTileset::setPicture(SystemPicture* picture) {
    m_picture = picture;
    m_pictureID = picture->id();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemTileset::setPictureFromId(int id){
    setPicture((SystemPicture*) SuperListItem::getById(Wanok::get()->project()
               ->picturesDatas()->model(PictureKind::Tilesets)
               ->invisibleRootItem(), id));
}

// -------------------------------------------------------

void SystemTileset::updatePicture(){
    setPictureFromId(m_pictureID);
}

// -------------------------------------------------------

SuperListItem* SystemTileset::createCopy() const{
    SystemTileset* super = new SystemTileset;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemTileset::setCopy(const SystemTileset& super){
    SuperListItem::setCopy(super);

    m_picture = super.m_picture;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemTileset::read(const QJsonObject &json){
    SuperListItem::read(json);

    setPictureFromId(json["pic"].toInt());
}

// -------------------------------------------------------

void SystemTileset::write(QJsonObject &json) const{
    SuperListItem::write(json);

    json["pic"] = m_picture->id();
}
