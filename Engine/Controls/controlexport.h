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

#ifndef CONTROLEXPORT_H
#define CONTROLEXPORT_H

#include <QString>
#include <QDir>
#include "oskind.h"
#include "project.h"

// -------------------------------------------------------
//
//  CLASS ControlNewproject
//
//  The controler of the export dialog.
//
// -------------------------------------------------------

class ControlExport
{
public:
    ControlExport(Project* project);
    QString createDesktop(QString, OSKind, bool);
    QString createBrowser(QString location);
    QString copyAllProject(QString location, QString projectName, QString path,
                           QDir dirLocation);
    void removeWebNoNeed(QString path);
    QString generateWebStuff(QString path);

protected:
    Project* m_project;
};

#endif // CONTROLEXPORT_H
