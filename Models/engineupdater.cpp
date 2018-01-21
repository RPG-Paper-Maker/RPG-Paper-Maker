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
#include <QEventLoop>
#include <QUrl>
#include <QJsonDocument>
#include <QDirIterator>
#include <QMessageBox>

const QString EngineUpdater::jsonFiles = "files";
const QString EngineUpdater::jsonSource = "source";
const QString EngineUpdater::jsonTarget = "target";
const QString EngineUpdater::jsonTree = "tree";
const QString EngineUpdater::jsonOS = "os";
const QString EngineUpdater::jsonWindows = "w";
const QString EngineUpdater::jsonLinux = "l";
const QString EngineUpdater::jsonMac = "m";
const QString EngineUpdater::jsonOnlyFiles = "onlyFiles";
const QString EngineUpdater::jsonAdd = "add";
const QString EngineUpdater::jsonRemove = "remove";
const QString EngineUpdater::jsonReplace = "replace";
const QString EngineUpdater::gitRepoEngine = "RPG-Paper-Maker";
const QString EngineUpdater::gitRepoGame = "Game-Scripts";
const QString EngineUpdater::pathGitHub =
        "https://raw.githubusercontent.com/RPG-Paper-Maker";

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
    QJsonObject obj, objFile, objDirSystem, objDirSystemDesktop, objExeEngine,
            objExeGame, objWin32, objLinux, objOsx;
    QJsonArray tabScripts, tabSystemDesktop;

    // Last version
    obj["lastVersion"] = Project::ENGINE_VERSION;

    // Scripts
    getJSONFile(objFile, pathGitHub +
                "/RPG-Paper-Maker/master/Game/Content/Datas/Scripts/System/"
                "desktop/includes.js",
                "Content/basic/Content/Datas/Scripts/System/desktop/"
                "includes.js");
    tabSystemDesktop.append(objFile);
    getJSONDir(objDirSystemDesktop, tabSystemDesktop,
               "Content/basic/Content/Datas/Scripts/System/desktop");
    tabScripts.append(objDirSystemDesktop);
    QDirIterator files(Wanok::pathCombine(
                           Wanok::pathCombine(QDir::currentPath(),
                                              Wanok::pathBasic),
                           Wanok::pathScriptsSystemDir),
                       QDir::Files);
    while (files.hasNext()){
        files.next();
        QString name = files.fileName();
        objFile = QJsonObject();
        getJSONFile(objFile, pathGitHub +
                    "/RPG-Paper-Maker/master/Game/Content/Datas/Scripts/System/"
                    + name,
                    "Content/basic/Content/Datas/Scripts/System/" + name);
        tabScripts.append(objFile);
    }
    getJSONDir(objDirSystem, tabScripts,
               "Content/basic/Content/Datas/Scripts/System");
    obj["scripts"] = objDirSystem;

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

    // versions
    obj["versions"] = QJsonArray();

    // Write
    Wanok::writeOtherJSON(Wanok::pathCombine(
                              Wanok::pathCombine(QDir::currentPath(),
                                                 "Content"), "versions.json"),
                          obj, QJsonDocument::Indented);
}

// -------------------------------------------------------

void EngineUpdater::writeTrees() {
    writeTree("Content/Datas/Scripts/System", "system-scripts", gitRepoGame);
    writeTree("Content/linux/libraries", "game-linux-libraries", gitRepoEngine);
    writeTree("Dependencies/linux/libraries", "engine-linux-libraries",
              gitRepoEngine, "libraries");
}

// -------------------------------------------------------

void EngineUpdater::writeTree(QString path, QString fileName, QString gitRepo,
                              QString targetPath)
{
    QString networkUrl = pathGitHub + gitRepo + "/master/";
    QString localUrl = "../" + gitRepo + "/"; // Only for unix
    QJsonObject objTree;

    if (gitRepo == gitRepoGame)
        targetPath = "Content/basic/" + path;
    if (targetPath.isEmpty())
        targetPath = path;

    getTree(objTree, localUrl, networkUrl, path, targetPath);
    Wanok::writeOtherJSON("../RPG-Paper-Maker/Trees/" + fileName + ".json",
                          objTree, QJsonDocument::Indented);
}

// -------------------------------------------------------

void EngineUpdater::getTree(QJsonObject& objTree, QString localUrl,
                            QString networkUrl, QString path, QString targetUrl)
{
    QDirIterator directories(Wanok::pathCombine(localUrl, path),
                             QDir::Dirs | QDir::NoDotAndDotDot | QDir::Files);
    QJsonArray tabFiles;

    while (directories.hasNext()) {
        directories.next();
        QString name = directories.fileName();
        if (name != "RPG Paper Maker.exe") {
            QString currentPath = Wanok::pathCombine(path, name);
            QString currentTarget = Wanok::pathCombine(targetUrl, name);
            QJsonObject obj;
            if (directories.fileInfo().isDir())
                getTree(obj, localUrl, networkUrl, currentPath, currentTarget);
            else {
                getJSONFile(obj, Wanok::pathCombine(networkUrl, currentPath),
                            currentTarget);
            }
            tabFiles.append(obj);
        }
    }

    getJSONDir(objTree, tabFiles, targetUrl);
}

// -------------------------------------------------------

void EngineUpdater::getJSONFile(QJsonObject& obj, QString source,
                                QString target)
{
    obj[jsonSource] = source;
    obj[jsonTarget] = target;
}

// -------------------------------------------------------

void EngineUpdater::getJSONDir(QJsonObject &obj, QJsonArray& files,
                               QString target)
{
    obj[jsonFiles] = files;
    obj[jsonTarget] = target;
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

    getJSONFile(obj, pathGitHub +
                "/RPG-Paper-Maker/master/Engine/Dependencies/" +
                os + "/" + exe, exe);
}

// -------------------------------------------------------

void EngineUpdater::getJSONExeGame(QJsonObject& obj, QString os) {
    QString exe = "Game";

    if (os == "win32")
        exe += ".exe";
    else if (os == "osx")
        exe += ".app";

    getJSONFile(obj, pathGitHub +
                "/RPG-Paper-Maker/master/Engine/Content/" + os + "/" + exe,
                "Content/" + os + "/" + exe);
}

// -------------------------------------------------------

void EngineUpdater::start() {
    emit needUpdate();
}

// -------------------------------------------------------

void EngineUpdater::updateVersion(QJsonObject& obj) {
    QJsonArray tabAdd =
          obj.contains(jsonAdd) ? obj[jsonAdd].toArray() : QJsonArray();
    QJsonArray tabRemove =
          obj.contains(jsonRemove) ? obj[jsonRemove].toArray() : QJsonArray();
    QJsonArray tabReplace =
          obj.contains(jsonReplace) ? obj[jsonReplace].toArray() : QJsonArray();
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
    if (obj.contains(jsonOS)) {
        QString strOS = "";
        #ifdef Q_OS_WIN
            strOS = jsonWindows;
        #elif __linux__
            strOS = jsonLinux;
        #else
            strOS = jsonMac;
        #endif

        if (!obj[jsonOS].toArray().contains(strOS))
            return;
    }

    if (obj.contains(jsonFiles))
        downloadFolder(action, obj);
    else
        downloadFile(action, obj);
}

// -------------------------------------------------------

void EngineUpdater::downloadFile(EngineUpdateFileKind action, QJsonObject& obj,
                                 bool exe)
{
    QString source = obj[jsonSource].toString();
    QString target = obj[jsonTarget].toString();
    bool onlyFiles = obj.contains(jsonOnlyFiles) ? obj[jsonOnlyFiles].toBool()
                                                 : false;
    bool isTree = obj.contains(jsonTree) ? obj[jsonTree].toBool() : false;

    if (isTree) {
        QNetworkReply* reply = readFile(source);
        QJsonObject objTree =
                QJsonDocument::fromJson(reply->readAll()).object();
        downloadFolder(action, objTree, onlyFiles);
    }
    else {
        if (action == EngineUpdateFileKind::Add)
            addFile(source, target, exe);
        else if (action == EngineUpdateFileKind::Remove)
            removeFile(target);
        else if (action == EngineUpdateFileKind::Replace)
            replaceFile(source, target, exe);
    }
}

// -------------------------------------------------------

QNetworkReply* EngineUpdater::readFile(QString source) {
    QNetworkAccessManager manager;
    QNetworkReply* reply;
    QEventLoop loop;

    reply = manager.get(QNetworkRequest(QUrl(source)));
    QObject::connect(reply, SIGNAL(finished()), &loop, SLOT(quit()));
    loop.exec();
    if (reply->error() != QNetworkReply::NetworkError::NoError) {
        QMessageBox::critical(nullptr, "Error",
                              "A network error occured: " +
                              reply->errorString());
    }

    return reply;
}

// -------------------------------------------------------

void EngineUpdater::addFile(QString& source, QString& target, bool exe) {
    QString path = Wanok::pathCombine(QDir::currentPath(), target);
    QNetworkReply* reply = readFile(source);
    QFile file(path);

    file.open(QIODevice::WriteOnly);
    file.write(reply->readAll());

    // If exe, change permissions
    if (exe) {
        file.setPermissions(QFileDevice::ReadUser | QFileDevice::WriteUser |
                            QFileDevice::ExeUser | QFileDevice::ReadGroup |
                            QFileDevice::ExeGroup | QFileDevice::ReadOther |
                            QFileDevice::ExeOther);
    }
    file.close();
}

// -------------------------------------------------------

void EngineUpdater::removeFile(QString& target) {
    QString path = Wanok::pathCombine(QDir::currentPath(), target);
    QFile file(path);
    file.remove();
}

// -------------------------------------------------------

void EngineUpdater::replaceFile(QString& source, QString& target, bool exe) {
    removeFile(target);
    addFile(source, target, exe);
}

// -------------------------------------------------------

void EngineUpdater::downloadFolder(EngineUpdateFileKind action,
                                   QJsonObject& obj, bool onlyFiles)
{
    QString target = obj[jsonTarget].toString();
    QJsonArray files = obj[jsonFiles].toArray();
    onlyFiles = obj.contains(jsonOnlyFiles) ? obj[jsonOnlyFiles].toBool()
                                            : onlyFiles;

    // The folder itself
    if (action == EngineUpdateFileKind::Add)
        addFolder(target, files, onlyFiles);
    else if (action == EngineUpdateFileKind::Remove)
        removeFolder(target, onlyFiles);
    else if (action == EngineUpdateFileKind::Replace)
        replaceFolder(target, files, onlyFiles);
}

// -------------------------------------------------------

void EngineUpdater::addFolder(QString& target, QJsonArray& files,
                              bool onlyFiles)
{
    // Create the folder
    if (!onlyFiles) {
        QString path = Wanok::pathCombine(QDir::currentPath(), target);
        QDir dir(path);
        QString dirName = dir.dirName();
        dir.cdUp();
        dir.mkdir(dirName);
    }

    // Files inside the folder
    QJsonObject obj;
    for (int i = 0; i < files.size(); i++) {
        obj = files.at(i).toObject();
        download(EngineUpdateFileKind::Add, obj);
    }
}

// -------------------------------------------------------

void EngineUpdater::removeFolder(QString& target, bool onlyFiles) {
    QString path = Wanok::pathCombine(QDir::currentPath(), target);

    if (onlyFiles) {
        QDirIterator files(path, QDir::Files);

        while (files.hasNext()) {
            files.next();
            QFile(files.filePath()).remove();
        }
    }
    else {
        QDir dir(path);
        dir.removeRecursively();
    }
}

// -------------------------------------------------------

void EngineUpdater::replaceFolder(QString& target, QJsonArray &files,
                                  bool onlyFiles)
{
    removeFolder(target, onlyFiles);
    addFolder(target, files, onlyFiles);
}

// -------------------------------------------------------

void EngineUpdater::downloadExecutables() {

    // Games
    QJsonObject objGame = m_document["exeGame"].toObject();
    QJsonObject objGameWin32 = objGame["win32"].toObject();
    QJsonObject objGameLinux = objGame["linux"].toObject();
    QJsonObject objGameOsx = objGame["osx"].toObject();
    downloadFile(EngineUpdateFileKind::Replace, objGameWin32, true);
    downloadFile(EngineUpdateFileKind::Replace, objGameLinux, true);
    downloadFile(EngineUpdateFileKind::Replace, objGameOsx, true);

    // Engine
    QJsonObject objEngine = m_document["exeEngine"].toObject();
    QJsonObject objEngineExe;
    QString strOS = "";
    #ifdef Q_OS_WIN
        strOS = "win32";
    #elif __linux__
        strOS = "linux";
    #else
        strOS = "osx";
    #endif
    objEngineExe = objEngine[strOS].toObject();
    downloadFile(EngineUpdateFileKind::Replace, objEngineExe, true);
}

// -------------------------------------------------------

void EngineUpdater::downloadScripts() {
    QNetworkReply* reply = readFile(
                pathGitHub + "RPG-Paper-Maker/master/Trees/system-script.json");
    QJsonObject objTree = QJsonDocument::fromJson(reply->readAll()).object();
    downloadFolder(EngineUpdateFileKind::Replace, objTree);
}

// -------------------------------------------------------

void EngineUpdater::getVersions(QJsonArray& versions) const {
    QJsonArray tab = m_document["versions"].toArray();
    for (int i = m_index; i < tab.size(); i++)
        versions.append(tab.at(i));
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
        QUrl(pathGitHub + "/RPG-Paper-Maker/master/versions.json")));

    QObject::connect(reply, SIGNAL(finished()), &loop, SLOT(quit()));
    loop.exec();
    if (reply->error() != QNetworkReply::NetworkError::NoError) {
        emit finishedCheck(false);
        return;
    }
    m_document = QJsonDocument::fromJson(reply->readAll()).object();

    // For develop
    /*
    QJsonDocument json;
    Wanok::readOtherJSON(Wanok::pathCombine(
                             QDir::currentPath(),
                             Wanok::pathCombine("Content", "versions.json")),
                         json);
    m_document = json.object();
    */

    // Check last version
    lastVersion = m_document["lastVersion"].toString();
    dif = ProjectUpdater:: versionDifferent(lastVersion);

    // Checking versions index
    QJsonArray tabVersions = m_document["versions"].toArray();
    QJsonObject obj;
    m_index = tabVersions.size();
    if (m_index != 0) {
        for (int i = 0; i < tabVersions.size(); i++) {
            obj = tabVersions.at(i).toObject();
            if (ProjectUpdater::versionDifferent(obj["v"].toString(),
                                                 Project::ENGINE_VERSION) == 1)
            {
                m_index = i;
                break;
            }
        }
    }

    emit finishedCheck(dif != 0);
}

// -------------------------------------------------------

void EngineUpdater::update() {
    QJsonArray tabVersions = m_document["versions"].toArray();
    QJsonObject obj;

    // Updating for each versions
    if (m_index != tabVersions.size()) {
        int progressVersion = 80 / (tabVersions.size() - m_index);
        for (int i = m_index; i < tabVersions.size(); i++) {
            obj = tabVersions.at(i).toObject();
            emit progress(((i - m_index) * progressVersion),
                          "Downloading version " + obj["v"].toString() + "...");
            updateVersion(obj);
            QThread::sleep(1);
        }
    }

    // Executables
    emit progress(80, "Downloading all the system scripts...");
    downloadScripts();

    // System scripts
    emit progress(90, "Downloading executables for games and engine...");
    downloadExecutables();
    emit progress(100, "Finished!");
    QThread::sleep(1);

    emit finished();
}
