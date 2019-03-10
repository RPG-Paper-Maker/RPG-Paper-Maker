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

#include "titlescreengameoverdatas.h"
#include "rpm.h"
#include "common.h"

const QString TitleScreenGameOverDatas::JSON_TITLE_LOGO = "tl";
const QString TitleScreenGameOverDatas::JSON_TITLE_BACKGROUND = "tb";
const QString TitleScreenGameOverDatas::JSON_TITLE_MUSIC = "tm";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

TitleScreenGameOverDatas::TitleScreenGameOverDatas() :
    m_titleLogoID(new SuperListItem),
    m_titleBackgroundID(new SuperListItem),
    m_titleMusic(new SystemPlaySong(-1, SongKind::Music))
{

}

TitleScreenGameOverDatas::~TitleScreenGameOverDatas() {
    delete m_titleLogoID;
    delete m_titleBackgroundID;
    delete m_titleMusic;
}

SuperListItem * TitleScreenGameOverDatas::titleLogoID() const {
    return m_titleLogoID;
}

SuperListItem * TitleScreenGameOverDatas::titleBackgroundID() const {
    return m_titleBackgroundID;
}

SystemPlaySong * TitleScreenGameOverDatas::titleMusic() const {
    return m_titleMusic;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void TitleScreenGameOverDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_TITLE_SCREEN_GAME_OVER),
        *this);
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::setDefault() {
    m_titleLogoID->setId(1);
    m_titleBackgroundID->setId(2);
    m_titleMusic->setId(1);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void TitleScreenGameOverDatas::read(const QJsonObject &json) {
    if (json.contains(JSON_TITLE_LOGO)) {
        m_titleLogoID->setId(json[JSON_TITLE_LOGO].toInt());
    }
    if (json.contains(JSON_TITLE_BACKGROUND)) {
        m_titleBackgroundID->setId(json[JSON_TITLE_BACKGROUND].toInt());
    }
    m_titleMusic->read(json[JSON_TITLE_MUSIC].toObject());
}

// -------------------------------------------------------

void TitleScreenGameOverDatas::write(QJsonObject &json) const {
    QJsonObject obj;

    if (!m_titleLogoID->isDefault()) {
        json[JSON_TITLE_LOGO] = m_titleLogoID->id();
    }
    if (!m_titleBackgroundID->isDefault()) {
        json[JSON_TITLE_BACKGROUND] = m_titleBackgroundID->id();
    }
    obj = QJsonObject();
    m_titleMusic->write(obj);
    json[JSON_TITLE_MUSIC] = obj;
}
