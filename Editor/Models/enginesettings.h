/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef ENGINESETTINGS_H
#define ENGINESETTINGS_H

#include "keyboarddatas.h"
#include "themekind.h"

// -------------------------------------------------------
//
//  CLASS EngineSettings
//
//  The engine settings (keyboard for the engine).
//
// -------------------------------------------------------

class EngineSettings : public Serializable
{
public:
    static const QString JSON_PROJECT_NAMES;
    static const QString JSON_PROJECT_LINKS;
    static const int MAX_PROJECTS_NUMBER;

    EngineSettings();
    virtual ~EngineSettings();
    void read();
    void write();
    KeyBoardDatas* keyBoardDatas() const;
    int zoomPictures() const;
    void setZoomPictures(int z);
    ThemeKind theme() const;
    void setTheme(ThemeKind t);
    int projectNumber() const;
    QString projectAtName(int i) const;
    QString projectAtLink(int i) const;

    QString getThemeContent() const;
    void updateTheme();
    void setDefault();
    void updateProject(QString name, QString link);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    KeyBoardDatas* m_keyBoardDatas;
    int m_zoomPictures;
    ThemeKind m_theme;
    QStringList m_projectNames;
    QStringList m_projectLinks;

    QString readContent(QString name) const;
};

#endif // ENGINESETTINGS_H
