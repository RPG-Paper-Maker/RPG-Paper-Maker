/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#include "systemicon.h"

const QString SystemIcon::JSON_PICTURE_ID = "pid";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemIcon::SystemIcon() : SystemIcon(1, new LangsTranslation, -1)
{

}

SystemIcon::SystemIcon(int i, LangsTranslation *names, int pictureID) :
    SystemLang(i, names),
    m_pictureID(pictureID)
{

}

SystemIcon::~SystemIcon(){

}

int SystemIcon::pictureID() const {
    return m_pictureID;
}

void SystemIcon::setPictureID(int id) {
    m_pictureID = id;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemIcon::setCopy(const SystemIcon& icon){
    SystemLang::setCopy(icon);

    m_pictureID = icon.m_pictureID;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemIcon::read(const QJsonObject &json){
    SystemLang::read(json);

    m_pictureID = json[JSON_PICTURE_ID].toInt();
}

// -------------------------------------------------------

void SystemIcon::write(QJsonObject &json) const{
    SystemLang::write(json);

    json[JSON_PICTURE_ID] = m_pictureID;
}
