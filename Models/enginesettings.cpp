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

#include "enginesettings.h"
#include "wanok.h"
#include "common.h"
#include <QDir>
#include <QApplication>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

EngineSettings::EngineSettings() :
    m_keyBoardDatas(new KeyBoardDatas),
    m_zoomPictures(0),
    m_theme(ThemeKind::Dark)
{

}

EngineSettings::~EngineSettings()
{
    delete m_keyBoardDatas;
}

void EngineSettings::read(){
    Wanok::readJSON(Common::pathCombine(QDir::currentPath(),
                                       Wanok::pathEngineSettings), *this);
}

void EngineSettings::write(){
    Wanok::writeJSON(Common::pathCombine(QDir::currentPath(),
                                        Wanok::pathEngineSettings), *this);
}

KeyBoardDatas* EngineSettings::keyBoardDatas() const {
    return m_keyBoardDatas;
}

int EngineSettings::zoomPictures() const {
    return m_zoomPictures;
}

void EngineSettings::setZoomPictures(int z) {
    m_zoomPictures = z;
    write();
}

ThemeKind EngineSettings::theme() const {
    return m_theme;
}

void EngineSettings::setTheme(ThemeKind t) {
    m_theme = t;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString EngineSettings::getThemeFile() const {
    QString file = ":/stylesheets/";
    switch (m_theme) {
    case ThemeKind::Dark:
        file += "darktheme";
        break;
    case ThemeKind::White:
        file += "whitetheme";
        break;
    }

    return file + ".qss";
}

// -------------------------------------------------------

void EngineSettings::updateTheme() {
    QFile file(getThemeFile());
    if (file.open(QFile::ReadOnly)) {
       QString styleSheet = QLatin1String(file.readAll());
       qApp->setStyleSheet(styleSheet);
    }
}

// -------------------------------------------------------

void EngineSettings::setDefault(){
    m_keyBoardDatas->setDefaultEngine();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void EngineSettings::read(const QJsonObject &json){
    m_keyBoardDatas->read(json["kb"].toObject());

    if (json.contains("zp")) {
        m_zoomPictures = json["zp"].toInt();
    }
    if (json.contains("theme")) {
        m_theme = static_cast<ThemeKind>(json["theme"].toInt());
    }
}

// -------------------------------------------------------

void EngineSettings::write(QJsonObject &json) const{
    QJsonObject obj;

    m_keyBoardDatas->write(obj);
    json["kb"] = obj;
    json["zp"] = m_zoomPictures;
    if (m_theme != ThemeKind::Dark) {
        json["theme"] = static_cast<int>(m_theme);
    }
}
