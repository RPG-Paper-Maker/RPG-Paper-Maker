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
#include "rpm.h"

const QString SystemWindowSkin::JSON_PICTURE_ID = "pid";
const QString SystemWindowSkin::JSON_TOP_LEFT = "tl";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------


SystemWindowSkin::SystemWindowSkin() :
    SystemWindowSkin(-1, "", -1, QRect(0, 0, 1, 1))
{

}

SystemWindowSkin::SystemWindowSkin(int i, QString n, int pictureID, QRectF
    topLeft) :
    SuperListItem (i, n),
    m_pictureID(pictureID),
    m_topLeft(topLeft)
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

QRectF * SystemWindowSkin::topLeft() {
    return &m_topLeft;
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
    m_topLeft = super.m_topLeft;
}

// -------------------------------------------------------

void SystemWindowSkin::read(const QJsonObject &json) {
    SuperListItem::read(json);
    QJsonArray tab;

    m_pictureID = json[JSON_PICTURE_ID].toInt();

    tab = json[JSON_TOP_LEFT].toArray();
    RPM::readRectF(tab, m_topLeft);
}

// -------------------------------------------------------

void SystemWindowSkin::write(QJsonObject &json) const {
    SuperListItem::write(json);
    QJsonArray tab;

    json[JSON_PICTURE_ID] = m_pictureID;

    RPM::writeRectF(tab, m_topLeft);
    json[JSON_TOP_LEFT] = tab;
    tab = QJsonArray();
}
