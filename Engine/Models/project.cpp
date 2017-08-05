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
#include <QDirIterator>
#include <QMessageBox>

const QString Project::VERSION = "0.2.0";

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
    QString line = in.readLine();
    file.close();

    if (line != Project::VERSION){
        QString information = "This project is under " + line + " version but"
                              " your current RPG Paper Maker version is " +
                              Project::VERSION + ".";
        QString noConvert = "Unfortunately, this version cannot be converted.";
        QMessageBox::critical(nullptr, "Error: incompatible versions",
                              information + "\n" + noConvert);
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
