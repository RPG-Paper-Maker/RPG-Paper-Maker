/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    QString createDesktop(QString location, OSKind os, bool protect, int major,
        int minor);
    QString createBrowser(QString location, bool protect);
    QString createFolder(QString location, QString projectName, QString path,
                         QDir dirLocation);
    QString copyAllProject(QString path);
    QString protectJSON(QString path);
    void removeWebNoNeed(QString path);
    void removeDesktopNoNeed(QString path, bool protect);
    QString generateWebStuff(QString path, bool protect);
    QString generateDesktopStuff(QString path, OSKind os, int major, int minor);
    void removeMapsTemp(QString pathDatas);
    void copyBRDLC(QString path, bool protect);
    void copyBRDLCKind(QString path, bool protect, int kind, int start, int end);

protected:
    Project *m_project;
};

#endif // CONTROLEXPORT_H
