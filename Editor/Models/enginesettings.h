/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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
#include "axiskind.h"

// -------------------------------------------------------
//
//  CLASS EngineSettings
//
//  The different engine settings.
//
// -------------------------------------------------------

class EngineSettings : public Serializable
{
public:
    static const QString JSON_KEYBOARD;
    static const QString JSON_ZOOM_PICTURES;
    static const QString JSON_THEME;
    static const QString JSON_PROJECT_NAMES;
    static const QString JSON_PROJECT_LINKS;
    static const QString JSON_FIRST_TIME;
    static const QString JSON_ROTATION_OPERATIONS;
    static const QString JSON_ROTATION_LEFT_RIGHT_CLICKS;
    static const QString JSON_ROTATION_ANGLES;
    static const QString JSON_UPDATER;
    static const QString JSON_SHOW_AVAILABLE_CONTENT;
    static const QString JSON_FIRST_TIME_LANGUAGES;
    static const QString JSON_CURRENT_LANGUAGE;
    static const QString THEME_DEFAULT;
    static const QString THEME_WHITE;
    static const QString THEME_WHITE_MAC;
    static const QString THEME_DARK;
    static const QString PATH_THEMES;
    static const bool DEFAULT_FIRST_TIME_LANGUAGES;
    static const QString DEFAULT_CURRENT_LANGUAGE;

    EngineSettings();
    virtual ~EngineSettings();

    KeyBoardDatas * keyBoardDatas() const;
    int zoomPictures() const;
    void setZoomPictures(int z);
    ThemeKind theme() const;
    void setTheme(ThemeKind t);
    int projectNumber() const;
    QString projectAtName(int i) const;
    QString projectAtLink(int i) const;
    bool firstTime() const;
    void setFirstTime(bool b);
    bool rotationOperation(AxisKind ak) const;
    void setRotationOperation(AxisKind ak, bool b);
    bool rotationLeftRightClick(AxisKind ak) const;
    void setRotationLeftRightClick(AxisKind ak, bool b);
    double rotationAngle(AxisKind ak) const;
    void setRotationAngle(AxisKind ak, double a);
    bool updater() const;
    void setUpdater(bool u);
    bool showAvailableContent() const;
    void setShowAvailableContent(bool sac);
    bool firstTimeLanguages() const;
    void setFirstTimeLanguages(bool ftl);
    QString currentLanguage() const;
    void setCurrentLanguage(QString cl);

    void setDefault();
    QString getThemeContent() const;
    void read();
    void write();
    void updateTheme();
    void updateProject(QString name, QString link);
    void clearProjects();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    KeyBoardDatas *m_keyBoardDatas;
    int m_zoomPictures;
    ThemeKind m_theme;
    QStringList m_projectNames;
    QStringList m_projectLinks;
    bool m_firstTime;
    QList<bool> m_rotationOperations;
    QList<bool> m_rotationLeftRightClicks;
    QList<double> m_rotationAngles;
    bool m_updater;
    bool m_showAvailableContent;
    bool m_firstTimeLanguages;
    QString m_currentLanguage;

    QString readContent(QString name) const;
};

#endif // ENGINESETTINGS_H
