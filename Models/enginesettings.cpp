/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "enginesettings.h"
#include "rpm.h"
#include "common.h"
#include <QDir>
#include <QApplication>
#include <QStyleFactory>

const QString EngineSettings::JSON_PROJECT_NAMES = "pn";
const QString EngineSettings::JSON_PROJECT_LINKS = "pl";
const int EngineSettings::MAX_PROJECTS_NUMBER = 6;

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
    // Default mac theme should be white
    #ifdef Q_OS_MAC
        m_theme = ThemeKind::White;
    #endif
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

int EngineSettings::projectNumber() const {
    return m_projectNames.length();
}

QString EngineSettings::projectAtName(int i) const {
    return m_projectNames.at(i);
}

QString EngineSettings::projectAtLink(int i) const {
    return m_projectLinks.at(i);
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
            qApp->setStyleSheet(readContent("defaulttheme"));
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
        #ifdef  Q_OS_MAC
            qApp->setStyleSheet(readContent("whitemactheme"));
        #else
            qApp->setStyleSheet(readContent("whitetheme"));
        #endif
        break;
    }
}

// -------------------------------------------------------

void EngineSettings::setDefault(){
    m_keyBoardDatas->setDefaultEngine();
}

// -------------------------------------------------------

void EngineSettings::updateProject(QString name, QString link) {
    int index = m_projectLinks.indexOf(link);
    int number;
    if (index != -1) {
        m_projectNames.removeAt(index);
        m_projectLinks.removeAt(index);
    }

    m_projectNames.insert(0, name);
    m_projectLinks.insert(0, link);

    number = projectNumber();
    if (number > MAX_PROJECTS_NUMBER) {
        m_projectNames.removeAt(number - 1);
        m_projectLinks.removeAt(number - 1);
    }

    write();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void EngineSettings::read(const QJsonObject &json) {
    QJsonArray tab;
    int i;

    m_keyBoardDatas->read(json["kb"].toObject());

    if (json.contains("zp")) {
        m_zoomPictures = json["zp"].toInt();
    }
    m_theme = json.contains("theme") ? static_cast<ThemeKind>(
        json["theme"].toInt()) : ThemeKind::Dark;

    tab = json[JSON_PROJECT_NAMES].toArray();
    for (i = 0; i < tab.size(); i++) {
        m_projectNames.append(tab.at(i).toString());
    }
    tab = json[JSON_PROJECT_LINKS].toArray();
    for (i = 0; i < tab.size(); i++) {
        m_projectLinks.append(tab.at(i).toString());
    }
}

// -------------------------------------------------------

void EngineSettings::write(QJsonObject &json) const {
    QJsonObject obj;
    QJsonArray tab;
    int i;

    m_keyBoardDatas->write(obj);
    json["kb"] = obj;
    json["zp"] = m_zoomPictures;
    if (m_theme != ThemeKind::Dark) {
        json["theme"] = static_cast<int>(m_theme);
    }
    for (i = 0; i < m_projectNames.length(); i++) {
        tab.append(m_projectNames.at(i));
    }
    json[JSON_PROJECT_NAMES] = tab;
    tab = QJsonArray();
    for (i = 0; i < m_projectLinks.length(); i++) {
        tab.append(m_projectLinks.at(i));
    }
    json[JSON_PROJECT_LINKS] = tab;
}
