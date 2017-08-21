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

#include "projectupdater.h"
#include "wanok.h"
#include <QDir>

const int ProjectUpdater::incompatibleVersionsCount = 0;

QString ProjectUpdater::incompatibleVersions[incompatibleVersionsCount]{};

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ProjectUpdater::ProjectUpdater(Project* project, QString previous) :
    m_project(project),
    m_previousFolderName(previous)
{

}

ProjectUpdater::~ProjectUpdater()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool ProjectUpdater::getSubVersions(QString& version, int& m, int& f, int& b) {
    QStringList list = version.split(".");
    if (list.size() != 3)
        return false;
    bool ok;
    int integer;
    integer = list.at(0).toInt(&ok);
    if (!ok)
        return false;
    m = integer;
    integer = list.at(1).toInt(&ok);
    if (!ok)
        return false;
    f = integer;
    integer = list.at(2).toInt(&ok);
    if (!ok)
        return false;
    b = integer;

    return true;
}

// -------------------------------------------------------

int ProjectUpdater::versionDifferent(QString projectVersion,
                                     QString otherVersion)
{
    int mProject, fProject, bProject, mEngine, fEngine, bEngine;
    bool ok = getSubVersions(projectVersion, mProject, fProject, bProject);
    bool ok2 = getSubVersions(otherVersion, mEngine, fEngine, bEngine);

    // Error while trying to convert one of the versions version
    if (!ok || !ok2)
        return -2;

    // If project <, return -1, if =, return 0, if > return 1
    if (mProject < mEngine)
        return -1;
    else if (mProject > mEngine)
        return 1;
    else {
        if (fProject < fEngine)
            return -1;
        else if (fProject > fEngine)
            return 1;
        else {
            if (bProject < bEngine)
                return -1;
            else if (bProject > bEngine)
                return 1;
            else
                return 0;
        }
    }
}

// -------------------------------------------------------

void ProjectUpdater::copyPreviousProject() {
    QDir dirProject(m_project->pathCurrentProject());
    QString currentPath = dirProject.path();
    dirProject.cdUp();
    QDir(dirProject.path()).mkdir(m_previousFolderName);
    Wanok::copyPath(currentPath, Wanok::pathCombine(dirProject.path(),
                                                    m_previousFolderName));
}

// -------------------------------------------------------

void ProjectUpdater::updateVersion(QString& version) {

}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void ProjectUpdater::check() {
    emit progress(10, "Copying the previous project...");
    copyPreviousProject();
    emit progress(80, "Checking incompatible versions...");

    // Updating for incompatible versions
    int index = incompatibleVersionsCount;

    for (int i = 0; i < incompatibleVersionsCount; i++) {
        if (m_project->version() == incompatibleVersions[i]) {
            index = i;
            break;
        }
    }

    for (int i = index; i < incompatibleVersionsCount; i++) {
        emit progress(80, "Checking version " + incompatibleVersions[i] +
                      "...");
        updateVersion(incompatibleVersions[i]);
    }

    emit progress(100, "");
    emit finished();
}
