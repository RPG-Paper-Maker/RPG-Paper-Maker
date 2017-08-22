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

#include "project.h"
#include "wanok.h"
#include "oskind.h"
#include "projectupdater.h"
#include "dialogprogress.h"
#include <QDirIterator>
#include <QMessageBox>
#include <QApplication>

const QString Project::ENGINE_VERSION = "0.3.0";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Project::Project() :
    p_currentMap(nullptr),
    p_gameDatas(new GameDatas),
    m_treeMapDatas(new TreeMapDatas),
    m_langsDatas(new LangsDatas),
    m_scriptsDatas(new ScriptsDatas),
    m_picturesDatas(new PicturesDatas),
    m_keyBoardDatas(new KeyBoardDatas)
{

}

Project::~Project()
{
    delete m_langsDatas;
    delete p_gameDatas;
    delete m_treeMapDatas;
    delete m_scriptsDatas;
    delete m_picturesDatas;
    delete m_keyBoardDatas;
}

// Gets

QString Project::pathCurrentProject() const{ return p_pathCurrentProject; }

void Project::setPathCurrentProject(QString s){ p_pathCurrentProject = s; }

Map* Project::currentMap() const{ return p_currentMap; }

void Project::setCurrentMap(Map* m) { p_currentMap = m; }

GameDatas* Project::gameDatas() const { return p_gameDatas; }

TreeMapDatas* Project::treeMapDatas() const { return m_treeMapDatas; }

LangsDatas* Project::langsDatas() const { return m_langsDatas; }

ScriptsDatas* Project::scriptsDatas() const { return m_scriptsDatas; }

PicturesDatas* Project::picturesDatas() const { return m_picturesDatas; }

KeyBoardDatas* Project::keyBoardDatas() const { return m_keyBoardDatas; }

QString Project::version() const { return m_version; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Project::setDefault(){
    m_langsDatas->setDefault();
    m_keyBoardDatas->setDefaultGame();
    m_picturesDatas->setDefault();
    p_gameDatas->setDefault();
    m_treeMapDatas->setDefault();
    m_scriptsDatas->setDefault();
}

// -------------------------------------------------------

void Project::saveCurrentMap(){
    p_currentMap->save();
    p_currentMap->setSaved(true);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

bool Project::read(QString path){
    setPathCurrentProject(path);

    if (!readVersion())
        return false;

    if (!readOS())
        return false;

    readLangsDatas();
    readKeyBoardDatas();
    readPicturesDatas();
    readGameDatas();
    readTreeMapDatas();
    readScriptsDatas();
    p_currentMap = nullptr;

    return true;
}

// -------------------------------------------------------

bool Project::readVersion(){

    QFile file(Wanok::pathCombine(p_pathCurrentProject, "game.rpm"));
    if(!file.open(QIODevice::ReadOnly)) {
        QMessageBox::information(nullptr, "error", file.errorString());
    }

    QTextStream in(&file);
    QString version = in.readLine();
    file.close();
    QString information = "This project is under " + version + " version but" +
                          " your current RPG Paper Maker version is " +
                          Project::ENGINE_VERSION;

    int dBefore = ProjectUpdater::versionDifferent(version, "0.3.0");

    // If impossible to convert the version
    if (dBefore == -2) {
        QMessageBox::critical(nullptr, "Error: could not find project version",
                              "Impossible to convert" + version + ".");
        return false;
    }

    // If version < 0.3.0, tell that the project updater didn't existed yet
    if (dBefore == -1) {
        QMessageBox::critical(nullptr, "Error: impossible conversion",
                              information + " and the projects cannot be " +
                              "updated if the project version is inferior to " +
                              "0.3.0.");
        return false;
    }

    int d = ProjectUpdater::versionDifferent(version);

    // If the project if superior to the engine
    if (d == 1) {
        QMessageBox::critical(nullptr, "Error: impossible conversion",
                              information + ". Please try to update a new " +
                              "version of the engine and retry.");
        return false;
    }

    // If the project is inferior
    if (d == -1) {
        QDir dirProject(p_pathCurrentProject);
        QString previousFolderName = dirProject.dirName() +
                                     "-" + version;
        QMessageBox::StandardButton box =
            QMessageBox::question(nullptr, "Error: conversion needed",
                                  information + ". Convert the project? (a " +
                                  "copy of your current project will be " +
                                  "created under the name " + previousFolderName
                                  + ".",
                                  QMessageBox::Yes | QMessageBox::No);
        if (box == QMessageBox::Yes) {
            DialogProgress dialog;
            QThread* thread = new QThread(qApp->parent());
            ProjectUpdater* worker = new ProjectUpdater(this,
                                                        previousFolderName);
            worker->moveToThread(thread);
            qApp->connect(worker, SIGNAL(finished()),
                          worker, SLOT(deleteLater()));
            qApp->connect(worker, SIGNAL(finished()),
                          &dialog, SLOT(accept()));
            qApp->connect(thread, SIGNAL(started()),
                          worker, SLOT(check()));
            qApp->connect(worker, SIGNAL(progress(int, QString)),
                          &dialog, SLOT(setValueLabel(int, QString)));
            thread->start();
            dialog.exec();

            return true;
        }

        return false;
    }

    return true;
}

// -------------------------------------------------------

bool Project::readOS() {

    // Get the project OS
    OSKind projectOS;
    if (QFile(Wanok::pathCombine(p_pathCurrentProject,"Game.exe")).exists())
        projectOS = OSKind::Window;
    else if (QFile(Wanok::pathCombine(p_pathCurrentProject,"Game.sh")).exists())
        projectOS = OSKind::Linux;
    else
        projectOS = OSKind::Mac;

    // Get the computer OS
    OSKind computerOS;
    #ifdef Q_OS_WIN
        computerOS = OSKind::Window;
    #elif __linux__
        computerOS = OSKind::Linux;
    #else
        computerOS = OSKind::Mac;
    #endif

    // Compare
    if (computerOS != projectOS) {
        QString information = "This project is configured for " +
                Wanok::osToString(projectOS) + " OS but you seems to be on " +
                Wanok::osToString(computerOS) + " OS.";
        QString question = "Would you like to convert the project for " +
                Wanok::osToString(computerOS) + " OS? (This will only keep" +
                " \"Content\" folder, and \"game.rpm\", all the other " +
                " files will be removed in the root of the project)";
        QMessageBox::StandardButton box =
                QMessageBox::question(nullptr, "Error: incompatible OS",
                             information + "\n" + question,
                             QMessageBox::Yes | QMessageBox::No);
        if (box == QMessageBox::Yes) {
            removeOSFiles();
            copyOSFiles();
        }
        else
            return false;
    }

    return true;
}

// -------------------------------------------------------

bool Project::copyOSFiles() {
    QString pathContent = Wanok::pathCombine(QDir::currentPath(), "Content");

    // Copy excecutable and libraries according to current OS
    QString strOS = "";
    #ifdef Q_OS_WIN
        strOS = "win32";
    #elif __linux__
        strOS = "linux";
    #else
        strOS = "osx";
    #endif

    // Copying a basic project content
    return Wanok::copyPath(Wanok::pathCombine(pathContent, strOS),
                           p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::removeOSFiles() {
    QDirIterator directories(p_pathCurrentProject,
                             QDir::Dirs | QDir::NoDotAndDotDot);
    QDirIterator files(p_pathCurrentProject, QDir::Files);

    // Remove directories exept Content
    while (directories.hasNext()){
        directories.next();
        if (directories.fileName() != "Content")
            QDir(directories.filePath()).removeRecursively();
    }

    // Remove files exept game.rpm
    while (files.hasNext()){
        files.next();
        if (files.fileName() != "game.rpm")
            QFile(files.filePath()).remove();
    }
}

// -------------------------------------------------------

void Project::readGameDatas(){
    p_gameDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readLangsDatas(){
    m_langsDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readTreeMapDatas(){
    m_treeMapDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readScriptsDatas(){
    m_scriptsDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readKeyBoardDatas(){
    m_keyBoardDatas->read(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::readPicturesDatas(){
    m_picturesDatas->read(p_pathCurrentProject);
    updatePictures();
}

// -------------------------------------------------------

void Project::readSystemDatas(){
    p_gameDatas->readSystem(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::write(QString path){
    setPathCurrentProject(path);
    writeLangsDatas();
    writeKeyBoardDatas();
    writePicturesDatas();
    writeGameDatas();
    writeTreeMapDatas();
    writeScriptsDatas();
}

// -------------------------------------------------------

void Project::writeGameDatas(){
    p_gameDatas->write(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::writeLangsDatas(){
    Wanok::writeJSON(Wanok::pathCombine(p_pathCurrentProject,
                                        Wanok::pathLangs), *m_langsDatas);
}

// -------------------------------------------------------

void Project::writeTreeMapDatas(){
    Wanok::writeJSON(Wanok::pathCombine(p_pathCurrentProject,
                                        Wanok::pathTreeMap), *m_treeMapDatas);
}

// -------------------------------------------------------

void Project::writeScriptsDatas(){
    Wanok::writeJSON(Wanok::pathCombine(p_pathCurrentProject,
                                        Wanok::pathScripts), *m_scriptsDatas);
}

// -------------------------------------------------------

void Project::writeKeyBoardDatas(){
    Wanok::writeJSON(Wanok::pathCombine(p_pathCurrentProject,
                                        Wanok::pathKeyBoard), *m_keyBoardDatas);
}

// -------------------------------------------------------

void Project::writePicturesDatas(){
    Wanok::writeJSON(Wanok::pathCombine(p_pathCurrentProject,
                                        Wanok::pathPicturesDatas),
                     *m_picturesDatas);
}

// -------------------------------------------------------

void Project::writeSystemDatas(){
    p_gameDatas->writeSystem(p_pathCurrentProject);
}

// -------------------------------------------------------

void Project::updatePictures(){
    p_gameDatas->tilesetsDatas()->updatePictures();
}

// -------------------------------------------------------

QString Project::createRPMFile() {
    QFile file(Wanok::pathCombine(p_pathCurrentProject, "game.rpm"));
    if (!file.open(QIODevice::WriteOnly | QIODevice::Text))
        return "Error while creating game.rpm file";
    QTextStream out(&file);
    out << Project::ENGINE_VERSION;

    return NULL;
}
