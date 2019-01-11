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

#include "dialogsystemwindowskin.h"

const QString SystemWindowSkin::JSON_PICTURE_ID = "pid";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------


SystemWindowSkin::SystemWindowSkin() :
    SystemWindowSkin(-1, "", -1)
{

}

SystemWindowSkin::SystemWindowSkin(int i, QString n, int pictureID) :
    SuperListItem (i, n),
    m_pictureID(pictureID)
{

}

SystemWindowSkin::~SystemWindowSkin()
{

}

int SystemWindowSkin::pictureID() const {
    return m_pictureID;
}

void SystemWindowSkin::setPictureID(int id) {
    m_pictureID = id;
}

// -------------------------------------------------------
//
//  VIRTUAL
//
// -------------------------------------------------------

bool SystemWindowSkin::openDialog() {
    SystemWindowSkin windowSkin;
    windowSkin.setCopy(*this);
    DialogSystemWindowSkin dialog(windowSkin);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(windowSkin);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemWindowSkin::createCopy() const {
    SystemWindowSkin* super = new SystemWindowSkin;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemWindowSkin::setCopy(const SystemWindowSkin& super) {
    SuperListItem::setCopy(super);

    m_pictureID = super.m_pictureID;
}

// -------------------------------------------------------

void SystemWindowSkin::read(const QJsonObject &json) {
    SuperListItem::read(json);

    m_pictureID = json[JSON_PICTURE_ID].toInt();
}

// -------------------------------------------------------

void SystemWindowSkin::write(QJsonObject &json) const {
    SuperListItem::write(json);

    json[JSON_PICTURE_ID] = m_pictureID;
}
