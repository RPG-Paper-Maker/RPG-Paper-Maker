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
#include "engineupdatefilekind.h"

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
    static const QString jsonFiles;
    static const QString jsonSource;
    static const QString jsonTarget;
    static const QString gitRepoEngine;
    static const QString gitRepoGame;

    static void writeBasicJSONFile();
    static void writeTrees();
    static void writeTree(QString path, QString fileName, QString gitRepo);
    static void getTree(QJsonObject& objTree, QString localUrl,
                        QString networkUrl, QString targetUrl);
    static void getJSONFile(QJsonObject &obj, QString source, QString target);
    static void getJSONDir(QJsonObject &obj, QJsonArray& files, QString target);
    static void getJSONExeEngine(QJsonObject &obj, QString os);
    static void getJSONExeGame(QJsonObject &obj, QString os);
    void start();
    void updateVersion(QJsonObject& obj);
    void download(EngineUpdateFileKind action, QJsonObject& obj);
    void downloadFile(EngineUpdateFileKind action, QJsonObject& obj,
                      bool exe = false);
    void addFile(QString& source, QString& target, bool exe);
    void removeFile(QString& target);
    void replaceFile(QString& source, QString& target, bool exe);
    void downloadFolder(EngineUpdateFileKind action, QJsonObject& obj);
    void addFolder(QString& target, QJsonArray& files);
    void removeFolder(QString& target);
    void replaceFolder(QString& target, QJsonArray& files);
    void downloadExecutables();
    void downloadScripts();
    void removePreviousScripts();
    void getVersions(QJsonArray& versions) const;

protected:
    QJsonObject m_document;
    int m_index;

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
