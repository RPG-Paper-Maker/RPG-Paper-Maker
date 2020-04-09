/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef CONTROLNEWPROJECT_H
#define CONTROLNEWPROJECT_H

#include <QChar>

// -------------------------------------------------------
//
//  CLASS ControlNewproject
//
//  The controler of the new project dialog. There are some
//  restrictions for folder names, and this is also were we
//  are generating a new project folder.
//
// -------------------------------------------------------

class ControlNewproject
{
public:
    ControlNewproject();

    static QChar forbiddenSymbols[];

    QString filterDirectoryName(const QString &s);
    QString createNewProject(QString projectName, QString dirName, QString
        location);
};

#endif // CONTROLNEWPROJECT_H
