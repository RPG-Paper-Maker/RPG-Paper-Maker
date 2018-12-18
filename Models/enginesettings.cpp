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

#include "enginesettings.h"
#include "rpm.h"
#include "common.h"
#include <QDir>
#include <QApplication>
#include <QStyleFactory>

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
    RPM::readJSON(Common::pathCombine(QDir::currentPath(),
                                       RPM::pathEngineSettings), *this);
}

void EngineSettings::write(){
    RPM::writeJSON(Common::pathCombine(QDir::currentPath(),
                                        RPM::pathEngineSettings), *this);
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

QString EngineSettings::getThemeContent() const {
    QString content = "";
    switch (m_theme) {
    case ThemeKind::Dark:
        content += readContent("darktheme");
        #ifdef Q_OS_WIN
            content += readContent("darkthemeWin32");
        #endif
        break;
    case ThemeKind::White:
        content += readContent("whitetheme");
        break;
    }

    return content;
}

// -------------------------------------------------------

QString EngineSettings::readContent(QString name) const {
    QFile file(":/stylesheets/Themes/" + name + ".qss");
    if (file.open(QFile::ReadOnly)) {
       return QLatin1String(file.readAll());
    }
    return "";
}

// -------------------------------------------------------

void EngineSettings::updateTheme() {
    switch (m_theme) {
    case ThemeKind::Dark:
    {
        #ifdef Q_OS_WIN
            qApp->setStyleSheet(readContent("whitetheme"));
            qApp->setStyle(QStyleFactory::create("Fusion"));
            QPalette darkPalette;
            darkPalette.setColor(QPalette::Window, QColor(53,53,53));
            darkPalette.setColor(QPalette::WindowText, Qt::white);
            darkPalette.setColor(QPalette::Base, QColor(25,25,25));
            darkPalette.setColor(QPalette::AlternateBase, QColor(53,53,53));
            darkPalette.setColor(QPalette::ToolTipBase, Qt::white);
            darkPalette.setColor(QPalette::ToolTipText, Qt::white);
            darkPalette.setColor(QPalette::Text, Qt::white);
            darkPalette.setColor(QPalette::Button, QColor(53,53,53));
            darkPalette.setColor(QPalette::ButtonText, Qt::white);
            darkPalette.setColor(QPalette::BrightText, Qt::red);
            darkPalette.setColor(QPalette::Link, QColor(42, 130, 218));
            darkPalette.setColor(QPalette::Highlight, QColor(42, 130, 218));
            darkPalette.setColor(QPalette::HighlightedText, Qt::white);
            darkPalette.setColor(QPalette::Disabled, QPalette::Text,
                                 QColor(150,150,150));
            darkPalette.setColor(QPalette::Disabled, QPalette::WindowText,
                                 QColor(150,150,150));
            darkPalette.setColor(QPalette::Disabled, QPalette::ButtonText,
                                 QColor(150,150,150));
            qApp->setPalette(darkPalette);
        #else
            qApp->setStyleSheet(readContent("darktheme"));
        #endif
        break;
    }
    case ThemeKind::White:
        qApp->setStyleSheet(readContent("whitetheme"));
        break;
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
    m_theme = json.contains("theme") ? static_cast<ThemeKind>(
        json["theme"].toInt()) : ThemeKind::Dark;
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
