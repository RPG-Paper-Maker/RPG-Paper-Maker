/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    ControlExport(Project *project);
    QString createDesktop(QString location, OSKind os, bool, int major, int
        minor);
    QString createBrowser(QString location);
    QString copyAllProject(QString location, QString projectName, QString path,
        QDir dirLocation);
    void removeWebNoNeed(QString path);
    void removeDesktopNoNeed(QString path);
    QString generateWebStuff(QString path);
    QString generateDesktopStuff(QString path, OSKind os, int major, int minor);
    void removeMapsTemp(QString pathDatas);
    void copyBRPictures(QString path);

protected:
    Project *m_project;
};

#endif // CONTROLEXPORT_H
