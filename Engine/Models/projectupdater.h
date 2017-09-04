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
    static bool getSubVersions(QString& version, int& m, int& f, int& b);
    static int versionDifferent(QString projectVersion, QString otherVersion
                                = Project::ENGINE_VERSION);
    void copyPreviousProject();
    void getAllPathsMapsPortions(QList<QString> &listPaths,
                                 QList<QJsonObject> &listObjects);
    void updateVersion(QString& version);
    void copyExecutable();
    void copySystemScripts();

protected:
    Project* m_project;
    QString m_previousFolderName;

public slots:
    void check();
    void updateVersion_0_3_1();

signals:
    void progress(int, QString);
    void finished();
};

#endif // PROJECTUPDATER_H
