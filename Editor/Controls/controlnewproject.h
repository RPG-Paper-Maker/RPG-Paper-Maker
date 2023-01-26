/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef CONTROLNEWPROJECT_H
#define CONTROLNEWPROJECT_H

#include <QObject>
#include <QChar>
#include "dialogprogress.h"

// -------------------------------------------------------
//
//  CLASS ControlNewproject
//
//  The controler of the new project dialog. There are some
//  restrictions for folder names, and this is also were we
//  are generating a new project folder.
//
// -------------------------------------------------------

class ControlNewproject : public QObject
{
    Q_OBJECT

public:
    ControlNewproject();

    static QChar forbiddenSymbols[];

    static QString filterDirectoryName(const QString &s, bool space = false);
    QString createNewProject(QString projectName, QString dirName, QString
        location);

private:
    DialogProgress m_progress;

signals:
    void progress(int);
};

#endif // CONTROLNEWPROJECT_H
