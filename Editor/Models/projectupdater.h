/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef PROJECTUPDATER_H
#define PROJECTUPDATER_H

#include "project.h"

// -------------------------------------------------------
//
//  CLASS ProjectUpdater
//
//  Module used for detecting if a project needs to be updated according to
//  the engine version.
//
// -------------------------------------------------------

class ProjectUpdater : public QObject
{
    Q_OBJECT
public:
    ProjectUpdater(Project* project, QString previous);
    virtual ~ProjectUpdater();

    static const int incompatibleVersionsCount;
    static QString incompatibleVersions[];
    void clearListMapPaths();
    void clearListMapPortions();
    void copyPreviousProject();
    void getAllPathsMapsPortions();
    void updateVersion(QString& version);
    void copyExecutable();
    void copySystemScripts();

protected:
    Project* m_project;
    QString m_previousFolderName;
    QList<QString> m_listMapPaths;
    QList<QJsonObject> m_listMapProperties;
    QList<QString> m_listMapPropertiesPaths;
    QList<QList<QJsonObject>*> m_listMapPortions;
    QList<QList<QString>*> m_listMapPortionsPaths;

public slots:
    void check();
    void updateVersion_0_3_1();
    void updateVersion_0_4_0();
    void updateVersion_0_4_3();
    void updateVersion_0_5_2();
    void updateVersion_1_0_0();
    void updateVersion_1_1_1();
    void updateVersion_1_2_0();

signals:
    void progress(int, QString);
    void finished();
};

#endif // PROJECTUPDATER_H
