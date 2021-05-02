/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    void updateCommands();

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
    void updateVersion_1_2_1();
    void updateVersion_1_3_0();
    void updateVersion_1_3_0_commands(QStandardItem *commands);
    void updateVersion_1_4_0();
    void updateVersion_1_4_0_commands(QStandardItem *commands);
    void updateVersion_1_4_1();
    void updateVersion_1_4_1_commands(QStandardItem *commands);
    void updateVersion_1_5_0();
    void updateVersion_1_5_3();
    void updateVersion_1_5_6();
    void updateVersion_1_5_6_commands(QStandardItem *commands);
    void updateVersion_1_6_0();
    void updateVersion_1_6_2();
    void updateVersion_1_6_3();
    void updateVersion_1_6_3_commands(QStandardItem *commands);
    void updateVersion_1_6_4();
    void updateVersion_1_7_0();
    void updateVersion_1_7_0_commands(QStandardItem *commands);
    void updateVersion_1_7_0_json(QString path, QString listName);
    void updateVersion_1_7_3();
    void updateVersion_1_7_3_commands(QStandardItem *commands);

signals:
    void progress(int, QString);
    void finished();
    void updatingCommands(QStandardItem *commands);
};

#endif // PROJECTUPDATER_H
