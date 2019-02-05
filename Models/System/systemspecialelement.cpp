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

#include "systemspecialelement.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemSpecialElement::SystemSpecialElement() :
    SystemSpecialElement(1, "", 1)
{

}

SystemSpecialElement::SystemSpecialElement(int i, QString n, int pictureId) :
    SuperListItem(i, n),
    m_pictureID(pictureId)
{

}

SystemSpecialElement::~SystemSpecialElement()
{

}

SystemPicture* SystemSpecialElement::picture() const {
    return nullptr;
}

void SystemSpecialElement::setPictureID(int id) {
    m_pictureID = id;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemSpecialElement::createCopy() const{
    SystemSpecialElement* super = new SystemSpecialElement;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemSpecialElement::setCopy(const SystemSpecialElement& super){
    SuperListItem::setCopy(super);

    m_pictureID = super.m_pictureID;
}

// -------------------------------------------------------

SystemPicture* SystemSpecialElement::pictureByKind(PictureKind kind) const {
    return (SystemPicture*) SuperListItem::getById(
                RPM::get()->project()->picturesDatas()->model(kind)
                ->invisibleRootItem(), m_pictureID);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemSpecialElement::read(const QJsonObject &json){
    SuperListItem::read(json);

    m_pictureID = json["pic"].toInt();
}

// -------------------------------------------------------

void SystemSpecialElement::write(QJsonObject &json) const{
    SuperListItem::write(json);

    json["pic"] = m_pictureID;
}
