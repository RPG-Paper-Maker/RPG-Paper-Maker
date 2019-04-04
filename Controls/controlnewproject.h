/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    QString createNewProject(QString dirName, QString location);
};

#endif // CONTROLNEWPROJECT_H
