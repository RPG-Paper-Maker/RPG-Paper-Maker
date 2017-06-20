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
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemPicture::SystemPicture() :
    SystemPicture(-1, "<None>", false)
{

}

SystemPicture::SystemPicture(int i, QString n, bool isBR) :
    SuperListItem(i,n),
    m_isBR(isBR)
{

}

SystemPicture::~SystemPicture(){

}

bool SystemPicture::isBR() const { return m_isBR; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemPicture::getFolder(PictureKind kind, bool isBR){
    QString folder = isBR ? Wanok::pathBR
                          : Wanok::get()->project()->pathCurrentProject();
    QString path;

    switch (kind){
    case PictureKind::Bars:
        path = Wanok::pathBars; break;
    case PictureKind::Icons:
        path = Wanok::pathIcons; break;
    case PictureKind::Autotiles:
        path = Wanok::pathAutotiles; break;
    case PictureKind::Characters:
        path = Wanok::pathCharacters; break;
    case PictureKind::Reliefs:
        path = Wanok::pathReliefs; break;
    case PictureKind::Tilesets:
        path = Wanok::pathTilesets; break;
    default:
        throw std::invalid_argument("Kind of picture path not implemented");
    }

    return Wanok::pathCombine(folder, path);
}

// -------------------------------------------------------

QString SystemPicture::getPath(PictureKind kind) const{
    QString folder = getFolder(kind, m_isBR);

    return Wanok::pathCombine(folder, name());
}

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

    m_isBR = json["br"].toBool();
}

// -------------------------------------------------------

void SystemPicture::write(QJsonObject &json) const{
    SuperListItem::write(json);

    json["br"] = m_isBR;
}
