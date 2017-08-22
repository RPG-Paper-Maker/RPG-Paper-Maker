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

#ifndef ENGINEUPDATER_H
#define ENGINEUPDATER_H

#include <QCoreApplication>
#include <QJsonObject>

// -------------------------------------------------------
//
//  CLASS ProjectUpdater
//
//  Module used for detecting if the engine needs to be updated
//
// -------------------------------------------------------

class EngineUpdater : public QObject
{
    Q_OBJECT
public:
    EngineUpdater();
    virtual ~EngineUpdater();
    static void writeBasicJSONFile();
    static void getJSONFile(QJsonObject &obj, QString source, QString target);
    void start();

protected:
    QJsonObject m_document;

public slots:
    void check();
    void update();

signals:
    void progress(int, QString);
    void finishedCheck(bool);
    void needUpdate();
    void finished();
};

#endif // ENGINEUPDATER_H
