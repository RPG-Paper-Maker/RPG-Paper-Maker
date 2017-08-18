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

class ProjectUpdater
{
public:
    static const int incompatibleVersionsCount;
    static QString incompatibleVersions[];
    static bool getSubVersions(QString& version, int& m, int& f, int& b);
    static int versionDifferent(QString projectVersion, QString otherVersion
                                = Project::ENGINE_VERSION);
    static void check(Project* project);
    static void updateVersion(QString& version);
};

#endif // PROJECTUPDATER_H
