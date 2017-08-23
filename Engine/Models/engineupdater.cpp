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

#include "engineupdater.h"
#include "projectupdater.h"
#include "wanok.h"
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QNetworkReply>
#include <QEventLoop>
#include <QUrl>
#include <QJsonDocument>
#include <QDirIterator>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

EngineUpdater::EngineUpdater()
{

}

EngineUpdater::~EngineUpdater()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void EngineUpdater::writeBasicJSONFile() {
    QJsonObject obj, objFile, objExeEngine, objExeGame,
            objWin32, objLinux, objOsx;
    QJsonArray tabScripts;

    // Last version
    obj["lastVersion"] = Project::ENGINE_VERSION;

    // Includes
    getJSONFile(objFile,
                "https://raw.githubusercontent.com/RPG-Paper-Maker/"
                "RPG-Paper-Maker/master/Game/Content/Datas/Scripts/System/"
                "desktop/includes.js",
                "Content/basic/Content/Datas/Scripts/System/desktop/"
                "includes.js");
    tabScripts.append(objFile);

    // Scripts
    QDirIterator files(Wanok::pathCombine(
                           Wanok::pathCombine(QDir::currentPath(),
                                              Wanok::pathBasic),
                           Wanok::pathScriptsSystemDir),
                       QDir::Files);
    while (files.hasNext()){
        files.next();
        QString name = files.fileName();
        objFile = QJsonObject();
        getJSONFile(objFile,
                    "https://raw.githubusercontent.com/RPG-Paper-Maker/"
                    "RPG-Paper-Maker/master/Game/Content/Datas/Scripts/System/"
                    + name,
                    "Content/basic/Content/Datas/Scripts/System/" + name);
        tabScripts.append(objFile);
    }
    obj["scripts"] = tabScripts;

    // Exe Engine
    getJSONExeEngine(objWin32, "win32");
    getJSONExeEngine(objLinux, "linux");
    getJSONExeEngine(objOsx, "osx");
    objExeEngine["win32"] = objWin32;
    objExeEngine["linux"] = objLinux;
    objExeEngine["osx"] = objOsx;
    obj["exeEngine"] = objExeEngine;

    // Exe Game
    getJSONExeGame(objWin32, "win32");
    getJSONExeGame(objLinux, "linux");
    getJSONExeGame(objOsx, "osx");
    objExeGame["win32"] = objWin32;
    objExeGame["linux"] = objLinux;
    objExeGame["osx"] = objOsx;
    obj["exeGame"] = objExeGame;

    // Write
    Wanok::writeOtherJSON(Wanok::pathCombine(
                              Wanok::pathCombine(QDir::currentPath(),
                                                 "Content"), "versions.json"),
                          obj, QJsonDocument::Indented);
}

// -------------------------------------------------------

void EngineUpdater::getJSONFile(QJsonObject& obj, QString source,
                                QString target)
{
    obj["source"] = source;
    obj["target"] = target;
}

// -------------------------------------------------------

void EngineUpdater::getJSONDir(QJsonObject &obj, QJsonArray& files,
                               QString target)
{
    obj["files"] = files;
    obj["target"] = target;
}

// -------------------------------------------------------

void EngineUpdater::getJSONExeEngine(QJsonObject& obj, QString os) {
    QString exe;

    if (os == "win32")
        exe = "RPG Paper Maker.exe";
    else if (os == "linux")
        exe = "RPG-Paper-Maker";
    else
        exe = "RPG-Paper-Maker.app";

    getJSONFile(obj, "https://github.com/RPG-Paper-Maker/RPG-Paper-Maker/tree/"
                     "master/Engine/Dependencies/" + os + "/" + exe, exe);
}

// -------------------------------------------------------

void EngineUpdater::getJSONExeGame(QJsonObject& obj, QString os) {
    QString exe = "Game";

    if (os == "win32")
        exe += ".exe";
    else if (os == "osx")
        exe += ".app";

    getJSONFile(obj, "https://raw.githubusercontent.com/RPG-Paper-Maker/"
                "RPG-Paper-Maker/master/Engine/Content/" + os + "/" + exe,
                "Content/basic/" + os + "/" + exe);
}

// -------------------------------------------------------

void EngineUpdater::start() {
    emit needUpdate();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void EngineUpdater::check() {
    QNetworkAccessManager manager;
    QNetworkReply *reply;
    QEventLoop loop;
    QString lastVersion;
    int dif;

    // Get the JSON
    reply = manager.get(QNetworkRequest(
        QUrl("https://raw.githubusercontent.com/RPG-Paper-Maker/"
             "RPG-Paper-Maker/master/versions.json")));

    QObject::connect(reply, SIGNAL(finished()), &loop, SLOT(quit()));
    loop.exec();
    m_document = QJsonDocument::fromJson(reply->readAll()).object();

    // Check last version
    lastVersion = m_document["lastVersion"].toString();
    dif = ProjectUpdater:: versionDifferent(lastVersion);

    emit finishedCheck(dif != 0);
}

// -------------------------------------------------------

void EngineUpdater::update() {

    emit finished();
}
