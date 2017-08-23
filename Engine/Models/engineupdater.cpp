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

void EngineUpdater::updateVersion(QJsonObject& obj) {
    QJsonArray tabAdd = obj["add"].toArray();
    QJsonArray tabRemove = obj["remove"].toArray();
    QJsonArray tabReplace = obj["replace"].toArray();
    QJsonObject objFile;

    for (int i = 0; i < tabAdd.size(); i++) {
        objFile = tabAdd.at(i).toObject();
        download(EngineUpdateFileKind::Add, objFile);
    }
    for (int i = 0; i < tabRemove.size(); i++) {
        objFile = tabRemove.at(i).toObject();
        download(EngineUpdateFileKind::Remove, objFile);
    }
    for (int i = 0; i < tabReplace.size(); i++) {
        objFile = tabReplace.at(i).toObject();
        download(EngineUpdateFileKind::Replace, objFile);
    }
}

// -------------------------------------------------------

void EngineUpdater::download(EngineUpdateFileKind action, QJsonObject& obj) {
    if (obj.contains("files"))
        downloadFolder(action, obj);
    else
        downloadFile(action, obj);
}

// -------------------------------------------------------

void EngineUpdater::downloadFile(EngineUpdateFileKind action, QJsonObject& obj)
{
    QString source = obj["source"].toString();
    QString target = obj["target"].toString();

    if (action == EngineUpdateFileKind::Add)
        addFile(source, target);
    else if (action == EngineUpdateFileKind::Remove)
        removeFile(target);
    else if (action == EngineUpdateFileKind::Replace)
        replaceFile(source, target);
}

// -------------------------------------------------------

void EngineUpdater::addFile(QString& source, QString& target) {
    QNetworkAccessManager manager;
    QNetworkReply *reply;
    QEventLoop loop;
    QString path;

    reply = manager.get(QNetworkRequest(QUrl(source)));
    QObject::connect(reply, SIGNAL(finished()), &loop, SLOT(quit()));
    loop.exec();
    path = Wanok::pathCombine(QDir::currentPath(), target);

    QFile file(path);
    file.open(QIODevice::WriteOnly);
    file.write(reply->readAll());
    file.close();
}

// -------------------------------------------------------

void EngineUpdater::removeFile(QString& target) {
    QString path = Wanok::pathCombine(QDir::currentPath(), target);
    QFile file(path);
    file.remove();
}

// -------------------------------------------------------

void EngineUpdater::replaceFile(QString& source, QString& target) {
    removeFile(target);
    addFile(source, target);
}

// -------------------------------------------------------

void EngineUpdater::downloadFolder(EngineUpdateFileKind action,
                                   QJsonObject& obj)
{
    QString target = obj["target"].toString();
    QJsonArray files = obj["files"].toArray();

    // The folder itself
    if (action == EngineUpdateFileKind::Add)
        addFolder(target, files);
    else if (action == EngineUpdateFileKind::Remove)
        removeFolder(target);
    else if (action == EngineUpdateFileKind::Replace)
        replaceFolder(target, files);
}

// -------------------------------------------------------

void EngineUpdater::addFolder(QString& target, QJsonArray& files) {

    // Create the folder
    QString path = Wanok::pathCombine(QDir::currentPath(), target);
    QDir dir(path);
    QString dirName = dir.dirName();
    dir.cdUp();
    dir.mkdir(dirName);

    // Files inside the folder
    QJsonObject obj;
    for (int i = 0; i < files.size(); i++) {
        obj = files.at(i).toObject();
        download(EngineUpdateFileKind::Add, obj);
    }
}

// -------------------------------------------------------

void EngineUpdater::removeFolder(QString& target) {
    QString path = Wanok::pathCombine(QDir::currentPath(), target);
    QDir dir(path);
    dir.removeRecursively();
}

// -------------------------------------------------------

void EngineUpdater::replaceFolder(QString& target, QJsonArray &files) {
    removeFolder(target);
    addFolder(target, files);
}

// -------------------------------------------------------

void EngineUpdater::downloadExecutables() {

}

// -------------------------------------------------------

void EngineUpdater::downloadScripts() {

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
    /*
    reply = manager.get(QNetworkRequest(
        QUrl("https://raw.githubusercontent.com/RPG-Paper-Maker/"
             "RPG-Paper-Maker/master/versions.json")));

    QObject::connect(reply, SIGNAL(finished()), &loop, SLOT(quit()));
    loop.exec();
    m_document = QJsonDocument::fromJson(reply->readAll()).object();
    */
    QJsonDocument json;
    Wanok::readOtherJSON(Wanok::pathCombine(
                             QDir::currentPath(),
                             Wanok::pathCombine("Content", "versions.json")),
                         json);
    m_document = json.object();

    // Check last version
    lastVersion = m_document["lastVersion"].toString();
    dif = ProjectUpdater:: versionDifferent(lastVersion);

    emit finishedCheck(dif != 0);
}

// -------------------------------------------------------

void EngineUpdater::update() {
    QJsonArray tabVersions = m_document["versions"].toArray();
    QJsonObject obj;

    // Checking versions index
    emit progress(5, "Checking versions...");
    int index = tabVersions.size();
    for (int i = 0; i < tabVersions.size(); i++) {
        obj = tabVersions.at(i).toObject();
        if (ProjectUpdater::versionDifferent(obj["v"].toString(),
                                             Project::ENGINE_VERSION) == 1)
        {
            index = i;
            break;
        }
    }

    // Updating for each versions
    int progressVersion = 70 / (tabVersions.size() - index);
    for (int i = index; i < tabVersions.size(); i++) {
        obj = tabVersions.at(i).toObject();
        emit progress(10 + ((i - index) * progressVersion),
                      "Downloading version " + obj["v"].toString() + "...");
        updateVersion(obj);
    }

    // Executables
    emit progress(80, "Downloading executables for games and engine...");
    downloadExecutables();

    // System scripts
    emit progress(90, "Downloading all the system scripts");
    downloadScripts();
    emit progress(100, "Finished!");
    QThread::sleep(1);

    emit finished();
}
